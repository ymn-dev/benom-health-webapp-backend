const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const Activity = require("../model/Activity.js");
const { errorHandler, errorHandling, authorization } = require("../utils.js");

const activitiesRouter = express.Router({ mergeParams: true });
activitiesRouter.use(express.json());
activitiesRouter.use(express.urlencoded({ extended: true }));

activitiesRouter.param("activityId", async (req, res, next, id) => {
  try {
    const activities = await Activity.findOne({ _id: req.userId });
    const activityIndex = activities.exerciseLog.findIndex((exercise) => exercise.logId === id);
    if (activityIndex === -1 || activities.exerciseLog[activityIndex].deleted) {
      return errorHandler(`activity not found`, next, 404);
    }
    req.activities = activities;
    req.activityIndex = activityIndex;
    next();
  } catch (err) {
    errorHandler(err, next);
  }
});

activitiesRouter.get("/", authorization, async (req, res, next) => {
  try {
    const myLog = await Activity.findById(req.userId).select("-deleted");

    const filterDeletedLog = myLog.exerciseLog.filter((exercise) => !exercise.deleted);
    myLog.exerciseLog = filterDeletedLog;
    res.json({
      data: myLog,
    });
  } catch (err) {
    return errorHandler(err, next);
  }
});

//add activity
activitiesRouter.post("/", authorization, async (req, res, next) => {
  console.log(next);
  try {
    const { exerciseName, date, weight, startTime, duration, calories, picture } = req.body;
    if (!exerciseName || !date || !weight || !startTime || !duration) {
      return errorHandler(`missing fields`, next, 400);
    }
    const logId = crypto.randomUUID();
    const userWeight = req.weight || weight;
    const newActivity = {
      logId,
      exerciseName,
      date,
      weight: userWeight,
      startTime,
      duration,
      calories,
      picture,
      createdTime: new Date(),
    };
    const result = await Activity.updateOne(
      { _id: req.userId },
      {
        $push: { exerciseLog: newActivity },
        $inc: {
          exerciseTime: Number(duration),
          caloriesBurned: Number(calories),
        },
      }
    );
    delete newActivity.deleted;
    if (result.acknowledged) {
      res.json({
        message: `successfully updated activity`,
        data: newActivity,
      });
    } else {
      return; //to catch block
    }
    next();
  } catch (err) {
    errorHandler(err, next);
  }
});

activitiesRouter.get("/:activityId", authorization, async (req, res, next) => {
  res.json({
    data: req.activities.exerciseLog[req.activityIndex],
  });
  next();
});

activitiesRouter.patch("/:activityId", authorization, async (req, res, next) => {
  try {
    const myLog = req.activities;
    const myActivity = myLog.exerciseLog[req.activityIndex];
    const { startTime, duration, calories, picture } = req.body;
    if (startTime) myActivity.startTime = startTime;
    if (duration) {
      myLog.exerciseTime -= Number(myActivity.duration);
      myActivity.duration = duration;
      myLog.exerciseTime += Number(myActivity.duration);
    }
    if (calories) {
      myLog.caloriesBurned -= Number(myActivity.calories);
      myActivity.calories = calories;
      myLog.caloriesBurned += Number(myActivity.calories);
    }
    if (picture) myActivity.picture = picture;
    const updatedActivity = await myLog.save();
    res.json({
      message: `successfully updated activity `,
      data: updatedActivity.exerciseLog[req.activityIndex],
    });
    next();
  } catch (err) {
    errorHandler(err, next);
  }
});

activitiesRouter.delete("/:activityId", authorization, async (req, res, next) => {
  try {
    const myLog = req.activities;
    const myActivity = myLog.exerciseLog[req.activityIndex];
    myActivity.deleted = true;
    myLog.caloriesBurned -= Number(myActivity.calories);
    myLog.exerciseTime -= Number(myActivity.duration);
    await myLog.save();
    res.json({
      message: `successfully deleted activity`,
      data: {
        exerciseName: myActivity.exerciseName,
        date: myActivity.date,
        startTime: myActivity.startTime,
      },
    });

    next();
  } catch (err) {
    errorHandler(err, next);
  }
});

module.exports = activitiesRouter;
