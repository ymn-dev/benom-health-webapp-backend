const express = require("express");
const { ReadPreference } = require("mongodb");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const usersRouter = require("./routers/usersRouter.js");
const activitiesRouter = require("./routers/activitiesRouter.js");
const loginRouter = require("./routers/loginRouter.js");
require("dotenv").config();

const app = express();

const connectLoop = () => {
  mongoose
    .connect(process.env.DATABASE_KEY, { serverApi: { version: "1", strict: false }, autoIndex: false, readPreference: ReadPreference.PRIMARY_PREFERRED })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err);
      setTimeout(connectLoop, 5000); // retry
    });
};
connectLoop();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
//to add CORS *****************
//logger
app.use(morgan(":date[web] REQUEST: :method :url via :user-agent STATUS :status (:response-time ms)"));
//user routes
app.use("/users", usersRouter);
//make activities route using same params as user
usersRouter.use("/:userId/activities", activitiesRouter);
app.use("/signin", loginRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
