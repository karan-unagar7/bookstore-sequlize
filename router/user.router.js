const { Router } = require("express");
const { signUp, signIn, getUser } = require("../controller/user.controller");
const verifyUser = require("../middleware/auth");

const router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/get-user", verifyUser, getUser);

module.exports = router;
