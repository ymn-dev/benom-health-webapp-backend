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

const createJwt = ({ _id, userName }, lifeSpan = "2h") => {
  //secret key generated via crypto.randomBytes(32).toString("hex");
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign({ _id, userName }, jwtSecretKey, {
    expiresIn: lifeSpan,
  });
  return token;
};

const verifyToken = (req, res, next) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  // const token = req.cookies.token;
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorHandler(`missing token`, next, 401);
  }
  const token = authHeader.split(" ")[1]; // Get the token part after "Bearer"
  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    return decoded;
  } catch (err) {
    // res.clearCookie("token");
    return errorHandler(`invalid token`, next, 400);
  }
};

const authentication = (req, res, next) => {
  const decoded = verifyToken(req, res, next);
  if (decoded) {
    req.me = decoded._id;
    next();
  }
};

const authorization = (req, res, next) => {
  const decoded = verifyToken(req, res, next);
  if (decoded) {
    if (decoded._id === req.userId || decoded.userName.startsWith("admin")) {
      next();
    } else {
      // res.clearCookie("token");
      return errorHandler(`Unauthorized: Access Denied`, next, 403);
    }
  }
};

const isAdmin = (req, res, next) => {
  if (req.me === "2ec2cddc-b4ee-4f72-a28d-10ac95bc4964") {
    return next();
  }

  // res.clearCookie("token");
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

module.exports = { createJwt, errorHandler, errorHandling, authentication, authorization, isAdmin, getAge, getBMR, getBMI };
