const express = require("express");
const { authorization, authentication, isAdmin } = require("../utils.js");
const UserController = require("../controllers/usersRouterController.js");
const usersRouter = express.Router();
usersRouter.use(express.json());
usersRouter.use(express.urlencoded({ extended: true }));

usersRouter.param("userId", UserController.getUserId);

usersRouter.get("/:userId", authorization, UserController.getOneUser);

usersRouter.get("/", authentication, isAdmin, UserController.getAllUsers);

usersRouter.post("/", UserController.addUser);

usersRouter.patch("/:userId", authorization, UserController.editUser);

usersRouter.delete("/:userId", authorization, UserController.deleteUser);

module.exports = usersRouter;
