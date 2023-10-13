const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../model/User.js");
const { errorHandler, errorHandling, createJwt } = require("../utils.js");
const fs = require("fs");

const loginRouter = express.Router();
loginRouter.use(express.json());
loginRouter.use(express.urlencoded({ extended: true }));
loginRouter.get("/", (req, res, next) => {
  res.json({ message: `this is a signin path` });
});
loginRouter.post("/", async (req, res, next) => {
  try {
    const { account, password } = req.body;
    if (!account || !password) {
      return errorHandler(`please input both account and password`, next, 400);
    }
    const query = account.indexOf("@") > -1 ? { email: account } : { userName: account };

    const user = await User.findOne(query, "userName email password").lean();

    if (!user || user.deleted) {
      return errorHandler(`invalid account or password`, next, 404);
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return errorHandler(`invalid account or password`, next, 400);
    }
    const myJwt = createJwt({ _id: user._id, userName: user.userName });
    // res.cookie("token", myJwt, {
    //   httpOnly: true,
    //   secure: true,
    // });
    res.json({ token: myJwt, _id: user._id });
  } catch (err) {
    errorHandler(err, next);
  }
});

loginRouter.use(errorHandling);
module.exports = loginRouter;
