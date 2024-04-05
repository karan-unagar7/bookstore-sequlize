const { Router } = require("express");
const { signUp, signIn, getUser } = require("../controller/user.controller");
const verifyUser = require("../middleware/auth");

const userRouter = Router();

userRouter.post("/sign-up", signUp);
userRouter.post("/sign-in", signIn);
userRouter.get("/get-user", verifyUser, getUser);

module.exports = userRouter;
