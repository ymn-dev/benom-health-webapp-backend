const {Walking} = require("../metTable.js");
const express = require("express");

const walkingRouter  = express.Router();
walkingRouter.use(express.json());
walkingRouter.use(express.urlencoded({ extended: true }));

walkingRouter.post("/", (req, res, next) => {
    const activity = req.body.exerciseName.split(":");
    const weight = req.body.weight;
    let MET;
    if (activity[0] === "Walking") {
        MET = Walking[activity[1]]
    };
    const duration = req.body.duration;
    const calories = 3.5 * MET * weight * duration / 200;
    
    res.json({calories});
});


module.exports = walkingRouter;