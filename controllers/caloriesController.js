const { getMET } = require("../metTable.js");
const { errorHandler, getCalories } = require("../utils.js");
const calculateCalories = (req, res, next) => {
  try {
    const activity = req.body.exerciseName;
    const MET = getMET(activity);
    const weight = req.body.weight;
    const duration = req.body.duration;
    const calories = getCalories(MET, weight, duration).toFixed(2);
    res.json({ calories });
  } catch (err) {
    return errorHandler(err, next);
  }
};
module.exports = calculateCalories;
