const { getMET } = require("../metTable.js");
const { errorHandler, errorHandling, getCalories } = require("../utils.js");
const express = require("express");

const caloriesRouter = express.Router();
caloriesRouter.use(express.json());
caloriesRouter.use(express.urlencoded({ extended: true }));

caloriesRouter.post("/", (req, res, next) => {
  try {
    const activity = req.body.exerciseName;
    const MET = getMET(activity);
    const weight = req.body.weight;
    const duration = req.body.duration;
    const calories = getCalories(MET, weight, duration);
    res.json({ calories });
  } catch (err) {
    return errorHandler(err, next);
  }
});
caloriesRouter.use(errorHandling);

module.exports = caloriesRouter;
