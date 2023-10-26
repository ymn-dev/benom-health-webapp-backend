const Activity = require("../model/Activity.js");
const { getMET } = require("../metTable.js");
const crypto = require("crypto");
const { errorHandler, getCalories, isMinus } = require("../utils.js");
const getActivityId = async (req, res, next, id) => {
  try {
    const activities = await Activity.findOne({ _id: req.userId });
    const activityIndex = activities.exerciseLog.findIndex((exercise) => exercise._id === id);
    if (activityIndex === -1 || activities.exerciseLog[activityIndex].deleted) {
      return errorHandler(`activity not found`, next, 404);
    }
    req.activities = activities;
    req.activityIndex = activityIndex;
    next();
  } catch (err) {
    errorHandler(err, next);
  }
};

const getOneActivity = async (req, res, next) => {
  res.json({
    data: req.activities.exerciseLog[req.activityIndex],
  });
  next();
};

const getAllActivities = async (req, res, next) => {
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
};

const addActivity = async (req, res, next) => {
  try {
    const { exerciseName, date, weight, startTime, duration, calories, picture } = req.body;
    const userWeight = req.weight || Number(weight);
    if (!exerciseName || !date || !startTime || !duration || !userWeight) {
      return errorHandler(`missing fields`, next, 400);
    }
    if (isMinus(duration)) {
      return errorHandler(`duration can't be minus!`, next, 400);
    }
    const _id = crypto.randomUUID();
    const [hours, minutes] = startTime.split(":");
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes);
    dateTime.toISOString();

    const autoCalcCalories = !calories ? Number(getCalories(getMET(exerciseName), userWeight, duration).toFixed(2)) : Number(calories);
    const newActivity = {
      _id,
      exerciseName,
      date,
      startTime,
      dateTime,
      weight: userWeight,
      duration: Number(duration),
      calories: autoCalcCalories,
      picture,
      createdTime: new Date(),
    };
    const result = await Activity.updateOne(
      { _id: req.userId },
      {
        $push: { exerciseLog: newActivity },
        $inc: {
          exerciseTime: Number(duration),
          caloriesBurned: autoCalcCalories,
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
};

const editActivity = async (req, res, next) => {
  try {
    const myLog = req.activities;
    const myActivity = myLog.exerciseLog[req.activityIndex];
    const { exerciseName, date, weight, startTime, duration, calories, picture } = req.body;
    if (isMinus(duration)) {
      return errorHandler(`duration can't be minus!`, next, 400);
    }
    if (date) myLog.date = date;
    if (startTime) myActivity.startTime = startTime;
    if (duration) {
      myLog.exerciseTime -= Number(myActivity.duration);
      myActivity.duration = duration;
      myLog.exerciseTime += Number(myActivity.duration);
    }
    if (exerciseName) myActivity.exerciseName = exerciseName;
    if (weight) myActivity.weight = weight;

    myLog.caloriesBurned -= Number(myActivity.calories);
    if (calories) {
      myActivity.calories = calories.toFixed(2);
    } else {
      myActivity.calories = Number(getCalories(getMET(exerciseName), weight, duration).toFixed(2));
    }
    myLog.caloriesBurned += Number(myActivity.calories);
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
};

const deleteActivity = async (req, res, next) => {
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
};

module.exports = { getActivityId, getOneActivity, getAllActivities, addActivity, editActivity, deleteActivity };
