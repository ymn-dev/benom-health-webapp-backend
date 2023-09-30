const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../model/User.js");

const usersRouter = express.Router();

usersRouter.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the URL parameter

    // Retrieve the user with the specified ID from the database
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      // If no user is found with the given ID, return a 404 Not Found response
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user); // Send the user as a JSON response
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" }); // Handle errors gracefully
  }
});

// Route for fetching all users
usersRouter.get("/", async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users from the database
    res.json(users); // Send the users as JSON response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" }); // Handle errors gracefully
  }
});
// const hashedPassword = bcrypt.hashSync(password, 12);

// const validPassword = bcrypt.compareSync(password, db.user.password);

module.exports = usersRouter;
