const { Router } = require("express");
const {addBook,getAllBook,getOneBook,updateBook,deleteBook}=require('../controller/book.controller')

const router = Router();

router.post("/add-book" ,addBook)
router.get('/getall-book' ,getAllBook)
router.get('/getone-book/:id' ,getOneBook)
router.put('/update-book/:id' ,updateBook)
router.delete('/delete-book/:id' ,deleteBook)




module.exports = router;
