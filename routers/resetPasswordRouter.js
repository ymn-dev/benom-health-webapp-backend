const { errorHandler, errorHandling } = require("../utils.js");
const express = require("express");
const User = require("../model/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const resetPasswordRouter = express.Router();
resetPasswordRouter.use(express.json());
resetPasswordRouter.use(express.urlencoded({ extended: true }));

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const verifyToken = (token) => {
  const decoded = jwt.verify(token, jwtSecretKey);
  return decoded;
};

resetPasswordRouter.post("/", async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email }, "email password deleted").lean();
    if (!user || user.deleted) {
      return errorHandler(`email not found`, next, 404);
    }
    //need new email only key here so wont be using createJwt function
    const token = jwt.sign({ email, usage: user.password }, jwtSecretKey, { expiresIn: "15m" });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "benomwebapp@gmail.com",
        pass: process.env.MAILER_PASSWORD,
      },
    });
    const mailOptions = {
      from: "benomwebapp@gmail.com",
      to: email,
      subject: "Password Reset Request for Benom Webapplication",
      text: `There was a request for password change, If you did not request a new password, please ignore this email\n
      click this link to reset password https://benom-health-webapp-frontend.vercel.app/resetpassword?token=${token}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(500).json({ error: `some error occured, please try again ${error}` });
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
        res.json({ message: `success, please check your email` });
      }
    });
  } catch (err) {
    errorHandler(err, next);
  }
});

resetPasswordRouter.patch("/", async (req, res, next) => {
  try {
    const token = req.body.token;
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
