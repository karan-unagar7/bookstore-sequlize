const { Router } = require("express");
const {addBook,getAllBook,getOneBook,updateBook,deleteBook}=require('../controller/book.controller')
const verifyUser = require("../middleware/auth");

const bookRouter = Router();

bookRouter.post("/add-book" , verifyUser ,addBook)
bookRouter.get('/getall-book' , verifyUser ,getAllBook)
bookRouter.get('/getone-book/:id' , verifyUser ,getOneBook)
bookRouter.put('/update-book/:id' , verifyUser ,updateBook)
bookRouter.delete('/delete-book/:id' , verifyUser ,deleteBook)




module.exports = bookRouter;
