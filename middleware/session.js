const {handleHttpError} = require ("../utils/handleError");
const {verifyToken} = require("../utils/handleJwt");
const {userModel} = require("../models/index.js");

const authMiddleware = async (req, res, next ) =>{
    try{
        if(!req.headers.authoritation){
            handleHttpError(res, "NOT_TOKEN", 401)
            return
        }
        const token = req.headers.authoritation.split(' ').pop()
        const dataToken = await verifyToken(token)

        if(!dataToken._id){
            handleHttpError(res, "ERROR_ID_TOKEN", 401)
            return 
        }
        const user = await userModel.findById(dataToken._id)
        req.user = user
        next()
    }catch(err){
        handleHttpError(res, "NOT_SESSION", 401)
    }
}
module.exports = authMiddleware