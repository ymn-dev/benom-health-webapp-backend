const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const Exercise = require("../model/activitiesRouter.js");

const activitiesRouter = express.Router({ mergeParams: true });
activitiesRouter.use(express.json());
activitiesRouter.use(express.urlencoded({ extended: true }));

module.exports = activitiesRouter;
