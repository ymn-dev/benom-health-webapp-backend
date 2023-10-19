const User = require("../model/User.js");
const Activity = require("../model/Activity.js");
const { errorHandler } = require("../utils.js");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const getUserId = async (req, res, next, id) => {
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
};

const getOneUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password -deleted");
    res.json({
      data: user,
    });
    next();
  } catch (err) {
    errorHandler(err, next);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password"); // Retrieve all users from the database

    res.json({
      data: users,
    });
  } catch (err) {
    errorHandler(err, next);
  }
  next();
};

const addUser = async (req, res, next) => {
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
};

const editUser = async (req, res, next) => {
  try {
    const { firstName, lastName, profilePicture, gender, birthday, height, weight, dailyCalories } = req.body;
    const myUser = await User.findOne({ _id: req.userId, deleted: false }).select("-password -deleted");
    if (!myUser) {
      return errorHandler(`this user doesnt exist`, next, 404);
    }
    if (myUser.birthday && birthday) {
      return errorHandler(`you can put birthday only once`, next, 400);
    }
    if (myUser.firstName && firstName) {
      return errorHandler(`you can put first name only once`, next, 400);
    }
    if (myUser.lastName && lastName) {
      return errorHandler(`you can put last name only once`, next, 400);
    }
    if (myUser.gender && gender) {
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
    res.json({
      message: `user updated successfully`,
      data: updatedUser,
    });
    next();
  } catch (err) {
    errorHandler(err, next);
  }
};

const deleteUser = async (req, res, next) => {
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
};

module.exports = { getUserId, getOneUser, getAllUsers, addUser, editUser, deleteUser };
