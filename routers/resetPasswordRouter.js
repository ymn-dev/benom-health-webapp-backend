const { errorHandling } = require("../utils.js");
const express = require("express");
const ResetPasswordController = require("../controllers/resetPasswordController.js");
const resetPasswordRouter = express.Router();
resetPasswordRouter.use(express.json());
resetPasswordRouter.use(express.urlencoded({ extended: true }));

resetPasswordRouter.post("/", ResetPasswordController.resetAccountCheck);

resetPasswordRouter.patch("/", ResetPasswordController.resetHandler);
resetPasswordRouter.use(errorHandling);

module.exports = resetPasswordRouter;
