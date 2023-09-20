const crypto = require("crypto");
console.log(crypto.randomUUID());
const currentTimestamp = new Date();
console.log(currentTimestamp.getTime());

// console.log(currentTimestamp.toISOString());

/*
template
{
  "_id": "3601072d-8a0e-49ec-88c9-39f58a7460fc",
  "email": "email@sample.com",
  "userName": "userrr",
  "password": "1Qqqwww@",
  "profilePicture": "",
  "firstName": "",
  "lastName": "",
  "gender": "",
  "birthday": "",
  "height": 0,
  "weight": 0,
  "dailyCalories": 0,
  "exerciseLog": [],
  "exerciseTime": 0,
  "caloriesBurned": 0,
  "liveExercseTime": 0,
  "liveCaloriesBurned": 0,
  "joinDate":1695222190731,
}



*/
