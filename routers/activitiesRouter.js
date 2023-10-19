const express = require("express");
const ActivityController = require("../controllers/activitiesController");
const { authorization } = require("../utils.js");

const activitiesRouter = express.Router({ mergeParams: true });
activitiesRouter.use(express.json());
activitiesRouter.use(express.urlencoded({ extended: true }));

activitiesRouter.param("activityId", ActivityController.getActivityId);

activitiesRouter.get("/", authorization, ActivityController.getAllActivities);

activitiesRouter.post("/", authorization, ActivityController.addActivity);

activitiesRouter.get("/:activityId", authorization, ActivityController.getOneActivity);

activitiesRouter.patch("/:activityId", authorization, ActivityController.editActivity);

activitiesRouter.delete("/:activityId", authorization, ActivityController.deleteActivity);

module.exports = activitiesRouter;
