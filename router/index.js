const {Router} = require('express');
const userRouter = require('./user.router')
const bookRouter = require('./book.router')

const router= Router();

router.use('/auth' , userRouter)
router.use('/book' , bookRouter)



module.exports = router;