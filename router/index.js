const {Router} = require('express');
const verifyUser=require("../middleware/auth")
const userRouter = require('./user.router')
const bookRouter = require('./book.router')

const router= Router();

router.use('/user',userRouter)
router.use('/book' , verifyUser,bookRouter)



module.exports = router;