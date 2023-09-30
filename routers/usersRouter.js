const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../model/User.js");
const Activity = require("../model/Activity.js");
const crypto = require("crypto");
const { errorHandler } = require("../utils.js");

const usersRouter = express.Router();
usersRouter.use(express.json());
usersRouter.use(express.urlencoded({ extended: true }));

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
    const user = await User.findById(req.userId).select("-password");
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
    const users = await User.find().select("-password"); // Retrieve all users from the database
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
    const savedUser = await newUser.save();
    const userLog = new Activity({
      _id,
      exerciseLog: [],
    });
    const savedUserLog = await userLog.save();
    res.json({
      message: `user created successfully`,
      data: {
        userName,
        email,
      },
    });
  } catch (err) {
    errorHandler(err, next);
  }
});

//edit user
usersRouter.patch("/:userId", async (req, res, next) => {
  try {
    const { firstName, lastName, profilePicture, gender, birthday, height, weight, dailyCalories } = req.body;
    const myUser = await User.findById(req.userId).select("-password");
    if (myUser.birthday) {
      return errorHandler(`you can put birthday only once`, next, 400);
    }
    if (myUser.firstName) {
      return errorHandler(`you can put first name only once`, next, 400);
    }
    if (myUser.lastName) {
      return errorHandler(`you can put last name only once`, next, 400);
    }
    if (myUser.gender) {
      return errorHandler(`you can put gender only once`, next, 400);
    }
    if (firstName) myUser.firstName = firstName;
    if (lastName) myUser.lastName = lastName;
    if (profilePicture) myUser.profilePicture = profilePicture;
    if (gender) myUser.gender = gender;
    if (birthday) myUser.birthday = birthday;
    if (height) myUser.height = height;
    if (weight) myUser.weight = weight;
    if (dailyCalories) myUser.dailyCalories = dailyCalories;
    const updatedUser = await myUser.save();
    delete updatedUser.password;
    res.json({
      message: `user updated successfully`,
      data: updatedUser,
    });
  } catch (err) {
    errorHandler(err, next);
  }
});

//error handler
usersRouter.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message });
});

module.exports = usersRouter;
