const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../model/User.js");
const Activity = require("../model/Activity.js");
const crypto = require("crypto");
const { errorHandler, errorHandling, authorization, authentication, isAdmin } = require("../utils.js");

const usersRouter = express.Router();
usersRouter.use(express.json());
usersRouter.use(express.urlencoded({ extended: true }));

usersRouter.param("userId", async (req, res, next, id) => {
  try {
    const user = await User.findOne({ _id: id }, "_id weight deleted").lean();
    if (!user || user.deleted) {
      return errorHandler(`user not found`, next, 404);
    }
    req.weight = user.weight;
    req.userId = user._id;
    next();
  } catch (err) {
    errorHandler(err, next);
  }
});

//fetch one user
usersRouter.get("/:userId", authorization, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password -deleted");
    res.json({
      data: user,
    });
    next();
  } catch (err) {
    errorHandler(err, next);
  }
});

// Route for fetching all users
usersRouter.get("/", authentication, isAdmin, async (req, res, next) => {
  try {
    const users = await User.find({ deleted: false }).select("-password -deleted"); // Retrieve all users from the database

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
    if (userName.startsWith("admin")) {
      return errorHandler(`username cannot start with 'admin'`, next, 400);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const _id = crypto.randomUUID();
    const newUser = await User.create({
      _id,
      userName,
      email,
      password: hashedPassword,
      joinDate: new Date(),
    });
    const userLog = await Activity.create({
      _id,
      exerciseLog: [],
    });
    res.json({
      message: `user created successfully`,
      data: {
        userName,
        email,
      },
    });
    next();
  } catch (err) {
    errorHandler(err, next);
  }
});

//edit user
usersRouter.patch("/:userId", authorization, async (req, res, next) => {
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
    delete updatedUser.deleted;
    res.json({
      message: `user updated successfully`,
      data: updatedUser,
    });
    next();
  } catch (err) {
    errorHandler(err, next);
  }
});

//delete
usersRouter.delete("/:userId", authorization, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("userName deleted");
    // console.log(user);
    // const name = user.userName;
    user.deleted = true;
    await user.save();
    res.json({
      message: `successfully deleted ${user.userName}`,
    });
  } catch (err) {
    errorHandler(err, next);
  }
});

//error handler
usersRouter.use(errorHandling);

module.exports = usersRouter;
