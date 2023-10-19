const express = require("express");
const loginRouter = express.Router();
const { errorHandler, errorHandling, createJwt } = require("../utils.js");
const loginValidation = require("../controllers/loginController");
loginRouter.use(express.json());
loginRouter.use(express.urlencoded({ extended: true }));

loginRouter.get("/", (req, res, next) => {
  res.json({ message: `this is a signin path` });
});
loginRouter.post("/", loginValidation);

loginRouter.use(errorHandling);
module.exports = loginRouter;
