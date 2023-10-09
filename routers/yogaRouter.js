const {Yoga} = require("../metTable.js");
const express = require("express");

const yogaRouter = express.Router();
yogaRouter.use(express.json());
yogaRouter.use(express.urlencoded({ extended: true }));

yogaRouter.post("/", (req, res, next) => {
    const activity = req.body.exerciseName.split(":");
    const weight = req.body.weight;
    let MET;
    if (activity[0] === "Yoga") {
        MET = Yoga[activity[1]]
    };
    const duration = req.body.duration;
    const calories = 3.5 * MET * weight * duration / 200;
    
    res.json({calories});
});


module.exports = yogaRouter;