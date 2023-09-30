const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const usersRouter = require("./routers/usersRouter.js");
const activitiesRouter = require("./routers/activitiesRouter.js");
// Define a mongoose model for your "users" collection

const app = express();

const connectLoop = () => {
  mongoose
    .connect("mongodb+srv://sornniyoma:Knxt6Av6bwb9hpmA@cluster0.ermfmbd.mongodb.net/api")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err);
      setTimeout(connectLoop, 5000); // retry
    });
};
connectLoop();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//logger
app.use(morgan(":date[web] REQUEST: :method :url via :user-agent STATUS :status (:response-time ms)"));
//user routes
app.use("/users", usersRouter);
//make activities route using same params as user
usersRouter.use("/:userId/activities", activitiesRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
