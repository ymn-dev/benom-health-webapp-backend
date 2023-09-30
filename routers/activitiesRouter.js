const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const Activity = require("../model/Activity.js");
const { errorHandler } = require("../utils.js");

const activitiesRouter = express.Router({ mergeParams: true });
activitiesRouter.use(express.json());
activitiesRouter.use(express.urlencoded({ extended: true }));

activitiesRouter.param("activityId", async (req, res, next, id) => {
  try {
    const activityId = await Activity.findOne({ _id: id });
  } catch (err) {
    errorHandler(err, next);
  }
});

// activitiesRouter.get();

// activitiesRouter.post();

// activitiesRouter.put();

// activitiesRouter.delete();

activitiesRouter.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message });
});

module.exports = activitiesRouter;
