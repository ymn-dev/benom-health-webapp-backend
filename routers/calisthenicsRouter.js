
const {Calisthenics} = require("../metTable.js");
const express = require("express");
/*
met = cycling.vigorous_bicycling
//พลังงานต่อ 1 นาที = 3.5 x NET x น้ำหนัก(กิโล)
const calories = time*3.5*kg
*/

const calisthenicsRouter = express.Router();
calisthenicsRouter.use(express.json());
calisthenicsRouter.use(express.urlencoded({ extended: true }));

calisthenicsRouter.post("/", (req, res, next) => {
    const activity = req.body.exerciseName.split(":");
    const weight = req.body.weight;
    let MET;
    if (activity[0] === "Calisthenics") {
        MET = Calisthenics[activity[1]]
    };
    const duration = req.body.duration;
    const calories = 3.5 * MET * weight * duration / 200;
    
    res.json({calories});
});


module.exports = calisthenicsRouter;