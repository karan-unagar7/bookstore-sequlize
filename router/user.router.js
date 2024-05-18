const { Router } = require("express");
const { signUp, signIn, getUser,deleteUser } = require("../controller/user.controller");
const verifyUser = require("../middleware/auth");

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/getuser", verifyUser, getUser);
router.delete('/delete' , verifyUser , deleteUser)

module.exports = router;
