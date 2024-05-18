const { Router } = require("express");
const {add,getAll,getOne,update,deletee}=require('../controller/book.controller')

const router = Router();

router.post("/add" ,add)
router.get('/getall' ,getAll)
// router.get('/getone/:id' ,getOne)
router.get('/getone' ,getOne)
router.put('/update/:id' ,update)
router.delete('/delete/:id' ,deletee)

module.exports = router;
