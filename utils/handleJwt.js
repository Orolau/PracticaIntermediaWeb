const jwt = require("jsonwebtoken");
const { handleHttpError } = require("./handleError");
const JWT_SECRET = process.env.JWT_SECRET;

const tokenSign = (user) => {
    const sign = jwt.sign({
        _id: user._id,
        role: user.role
    },
        JWT_SECRET,
        {
            expiresIn: "2h"
        }
    )
    return sign;
}

const verifyToken = (tokenJwt) =>{
    try{
        return jwt.verify(tokenJwt, JWT_SECRET)
    }catch(err){
        handleHttpError(err, 'INVALID_TOKEN', 401)
    }
}

const getUserFromToken = (tokenJwt) =>{
    try{
        return jwt.decode(tokenJwt, JWT_SECRET)._id
    }catch(err){
        handleHttpError(err, 'INVALID_TOKEN', 401)
    }
} 

module.exports = { tokenSign, verifyToken, getUserFromToken}