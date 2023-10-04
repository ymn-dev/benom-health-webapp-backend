const jwt = require("jsonwebtoken");
require("dotenv").config();

const errorHandler = (message, next, status = 500) => {
  const myError = new Error(message);
  myError.status = status;
  return next(myError);
};

const errorHandling = (err, req, res, next) => {
  const status = err.status || 500;
  return res.status(status).json({ error: err.message });
};

const createJwt = ({ _id, userName }) => {
  //secret key generated via crypto.randomBytes(32).toString("hex");
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign({ _id, userName }, jwtSecretKey, {
    expiresIn: "2h",
  });
  return token;
};

const authorization = (req, res, next) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  //via cookie
  const token = req.cookies.token;
  if (!token) {
    return errorHandler(`missing token`, next, 401);
  }

  try {
    const decoded = jwt.verify(token, jwtSecretKey);

    if (decoded._id === req.userId) {
      next();
    } else if (decoded.userName.startsWith("admin")) {
      next();
    } else {
      res.clearCookie("token");
      return errorHandler(`Unauthorized: Access Denied`, next, 403);
    }
  } catch (err) {
    res.clearCookie("token");
    return errorHandler(`invalid token`, next, 400);
  }
};

const isAdmin = (req, res, next) => {
  console.log(req.userId);
  if (req.userId === "651b642c-112e-482d-88f6-20d3e78dc363") {
    return next();
  }
  return errorHandler(`Unauthorized: Access Denied`, next, 403);
};

const getAge = (birthday) => {
  if (!birthday) return "Please add birthday";
  const currentDate = new Date();
  const birthDate = new Date(birthday);
  const timeDifference = currentDate - birthDate;
  //the date object counting in millisecond, we want year
  const age = Math.floor(timeDifference / (365.25 * 24 * 60 * 60 * 1000));
  return age;
};

const getBMR = (height, weight, birthday, gender) => {
  if (!weight || !height || !birthday) {
    return "Please add weight(kg), height(cm) and birthday";
  }
  let base = 10 * weight + 6.25 * height - 5 * getAge();
  if (gender === "Male") {
    base += 5;
  }
  if (gender === "Female") {
    base -= 161;
  }
  return base;
};
const getBMI = (height, weight) => {
  if (!weight || !height) {
    return "Please add weight(kg) and height (cm)";
  }
  return weight / ((height / 100) * (height / 100));
};

module.exports = { createJwt, errorHandler, errorHandling, authorization, isAdmin, getAge, getBMR, getBMI };
