const jwt = require("jsonwebtoken");
require("dotenv").config();

const errorHandler = (message, next, status = 500) => {
  const myError = new Error(message);
  myError.status = status;
  return next(myError);
};

const errorHandling = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message });
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
  const authHeader = req.headers.authorization;
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorHandler(`Unauthorized`, next, 401);
  }
  const token = authHeader.split(" ")[1]; // Get the token part after "Bearer"
  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    req.userName = decoded.userName;
    next();
  } catch (err) {
    return errorHandler(`invalid token`, next, 400);
  }
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

module.exports = { createJwt, errorHandler, errorHandling, getAge, getBMR, getBMI };
