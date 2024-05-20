const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../config/config')

const generateToken = (payload)=>{
    return jwt.sign(payload , SECRET_KEY , {
        expiresIn:'5 h'
    })
}

const verifyToken = (token)=>{
    return jwt.verify(token,SECRET_KEY)
}

module.exports = {generateToken,verifyToken}