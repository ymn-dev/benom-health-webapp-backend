const { errorHandling } = require("../utils.js");
const express = require("express");
const caloriesRouter = express.Router();
const calculateCalories = require("../controllers/caloriesController.js");
caloriesRouter.use(express.json());
caloriesRouter.use(express.urlencoded({ extended: true }));
caloriesRouter.post("/", calculateCalories);
caloriesRouter.use(errorHandling);

module.exports = caloriesRouter;
