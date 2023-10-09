const {Cycling} = require("../metTable.js");
const express = require("express");

const cyclingRouter = express.Router();
cyclingRouter.use(express.json());
cyclingRouter.use(express.urlencoded({ extended: true }));

cyclingRouter.post("/", (req, res, next) => {
    const activity = req.body.exerciseName.split(":");
    const weight = req.body.weight;
    let MET;
    if (activity[0] === "Cycling") {
        MET = Cycling[activity[1]]
    };
    const duration = req.body.duration;
    const calories = 3.5 * MET * weight * duration / 200;
    
    res.json({calories});
});


module.exports = cyclingRouter;