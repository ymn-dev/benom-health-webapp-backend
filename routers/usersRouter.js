const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../model/User.js");

const usersRouter = express.Router();
usersRouter.use(express.json());
usersRouter.use(express.urlencoded({ extended: true }));

usersRouter.param("userId", async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        error: `user not found`,
      });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//fetch one user
usersRouter.get("/:userId", async (req, res) => {
  res.json({
    data: req.user,
  });
});

// Route for fetching all users
usersRouter.get("/", async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users from the database
    res.json({
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// const hashedPassword = bcrypt.hashSync(password, 12);

// const validPassword = bcrypt.compareSync(password, db.user.password);

module.exports = usersRouter;
