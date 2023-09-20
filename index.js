const express = require("express");
const mongoose = require("mongoose");

// Define a mongoose model for your "users" collection
const User = require("./model/User.js");

const app = express();

const connectLoop = () => {
  mongoose
    .connect("mongodb+srv://sornniyoma:Knxt6Av6bwb9hpmA@cluster0.ermfmbd.mongodb.net/api")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err);
      setTimeout(connectLoop, 5000); // retry
    });
};
connectLoop();

// Route for fetching a specific user by ID
app.get("/users/:id", async (req, res) => {
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
app.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users from the database
    res.json(users); // Send the users as JSON response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" }); // Handle errors gracefully
  }
});

app.listen(3001, () => {
  console.log(`Server is running`);
});
