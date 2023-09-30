const express = require("express");
const mongoose = require("mongoose");

const activitiesRouter = express.Router({ mergeParams: true });
activitiesRouter.use(express.json());
activitiesRouter.use(express.urlencoded({ extended: true }));

module.exports = activitiesRouter;
