const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../model/User.js");
const crypto = require("crypto");

const usersRouter = express.Router();
usersRouter.use(express.json());
usersRouter.use(express.urlencoded({ extended: true }));

const errorHandler = (message, next, status = 500) => {
  const myError = new Error(message);
  myError.status = status;
  return next(myError);
};

usersRouter.param("userId", async (req, res, next, id) => {
  try {
    const userId = await User.findOne({ _id: id }, "_id").lean();
    if (!userId) {
      // const myError = new Error(`user not found`);
      // myError.status = 404;
      // return next(myError);
      return errorHandler(`user not found`, next, 404);
    }
    req.userId = userId;
    next();
  } catch (err) {
    // const myError = new Error(err);
    // return next(myError);
    errorHandler(err, next);
  }
});

//fetch one user
usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    res.json({
      data: user,
    });
    next();
  } catch (err) {
    errorHandler(err, next);
  }
});

// Route for fetching all users
usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find(); // Retrieve all users from the database
    res.json({
      data: users,
    });
  } catch (err) {
    errorHandler(err, next);
  }
  next();
});

//create user
usersRouter.post("/", async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return errorHandler(`missing fields`, next, 400);
    }
    const existingUser = await User.findOne({ userName });
    const existingEmail = await User.findOne({ email });
    if (existingUser) {
      return errorHandler(`username is in use`, next, 400);
    }
    if (existingEmail) {
      return errorHandler(`email is in use`, next, 400);
    }

    const hashedPassword = bcrypt.hashSync(password, 12);
    const _id = crypto.randomUUID();
    const newUser = new User({
      _id,
      userName,
      email,
      password: hashedPassword,
      joinDate: new Date().getTime(),
    });
    console.log(newUser);
    try {
      const savedUser = await newUser.save();
      console.log(savedUser);
      res.json({
        message: `user created successfully`,
        data: {
          userName,
          email,
        },
      });
    } catch (err) {
      return errorHandler(err, next);
    }
  } catch (err) {
    errorHandler(err, next);
  }
});

usersRouter.patch("/:userId", (req, res, next) => {});

//error handler
usersRouter.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message });
});

module.exports = usersRouter;
