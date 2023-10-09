const {Running} = require("../metTable.js");
const express = require("express");

const runningRouter = express.Router();
runningRouter.use(express.json());
runningRouter.use(express.urlencoded({ extended: true }));

runningRouter.post("/", (req, res, next) => {
    const activity = req.body.exerciseName.split(":");
    const weight = req.body.weight;
    let MET;
    if (activity[0] === "Running") {
        MET = Running[activity[1]]
    };
    const duration = req.body.duration;
    const calories = 3.5 * MET * weight * duration / 200;
    
    res.json({calories});
});


module.exports = runningRouter;