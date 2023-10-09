const {Swimming} = require("../metTable.js");
const express = require("express");

const swimmingRouter = express.Router();
swimmingRouter.use(express.json());
swimmingRouter.use(express.urlencoded({ extended: true }));

swimmingRouter.post("/", (req, res, next) => {
    const activity = req.body.exerciseName.split(":");
    const weight = req.body.weight;
    let MET;
    if (activity[0] === "Swimming") {
        MET = Swimming[activity[1]]
    };
    const duration = req.body.duration;
    const calories = 3.5 * MET * weight * duration / 200;
    
    res.json({calories});
});


module.exports = swimmingRouter;