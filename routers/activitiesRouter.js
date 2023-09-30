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
    const activities = await Activity.findOne({ _id: req.userId });
    const activity = activities.exerciseLog.find((exercise) => exercise._id === id);
    if (!activity) {
      return errorHandler(`activity not found`, next, 404);
    }
    req.activity = activity;
    next();
  } catch (err) {
    errorHandler(err, next);
  }
});

activitiesRouter.get("/", async (req, res, next) => {
  try {
    const myLog = await Activity.findById(req.userId);
    res.json({
      data: myLog,
    });
  } catch (err) {
    errorHandler(err, next);
  }
});

activitiesRouter.post("/", async (req, res, next) => {
  try {
    const { exerciseName, date, weight, startTime, duration, calories, picture } = req.body;
    if (!exerciseName || !date || !weight || !startTime || !duration) {
      return errorHandler(`missing fields`, next, 400);
    }
    const _id = crypto.randomUUID();
    const deleted = false;
    const newActivity = {
      _id,
      exerciseName,
      date,
      weight,
      startTime,
      duration,
      calories,
      picture,
      createdTime: new Date().getTime(),
      deleted,
    };
    const result = await Activity.updateOne({ _id: req.userId }, { $push: { exerciseLog: newActivity } });
    if (result.acknowledged) {
      res.json({
        message: `successfully updated activity`,
        data: newActivity,
      });
    } else {
      return; //to catch
    }
    next();
  } catch (err) {
    errorHandler(err, next);
  }
});

activitiesRouter.get("/:activityId", async (req, res, next) => {
  res.json({
    data: req.activity,
  });
  next();
});

// activitiesRouter.put();

// activitiesRouter.delete();

activitiesRouter.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message });
});

module.exports = activitiesRouter;
