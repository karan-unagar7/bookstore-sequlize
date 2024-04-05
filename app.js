const express =require('express');
const {PORT}=require('./config/config')
const router = require('./router/index')
require('./model/index')
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1' , router)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})