const { errorHandler, errorHandling } = require("../utils.js");
const express = require("express");
const User = require("../model/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const resetPasswordRouter = express.Router();
resetPasswordRouter.use(express.json());
resetPasswordRouter.use(express.urlencoded({ extended: true }));

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const verifyToken = (token) => {
  const decoded = jwt.verify(token, jwtSecretKey);
  return decoded;
};

resetPasswordRouter.get("/", async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email }, "email password deleted").lean();
    if (!user || user.deleted) {
      return errorHandler(`email not found`, next, 404);
    }
    //need new email only key here so wont be using createJwt function
    const token = jwt.sign({ email, usage: user.password }, jwtSecretKey, { expiresIn: "10m" });
    res.json({ token });
  } catch (err) {
    errorHandler(err, next);
  }
});

resetPasswordRouter.patch("/", async (req, res, next) => {
  try {
    const token = req.query.token;
    const newPassword = req.body.newPassword;
    const result = verifyToken(token);
    if (!result) {
      return errorHandler(`invalid token`, next, 400);
    }
    const user = await User.findOne({ email: result.email }, "email password");
    if (result.usage !== user.password) {
      return errorHandler(`token already used`, next, 400);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: `successfully updated the password` });
  } catch (err) {
    errorHandler(err, next);
  }
});
resetPasswordRouter.use(errorHandling);

module.exports = resetPasswordRouter;
