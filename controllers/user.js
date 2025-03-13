const { userModel } = require("../models/index.js");
const { matchedData } = require("express-validator");
const { encrypt } = require("../utils/handlePassword.js");
const { tokenSign, getUserFromToken } = require("../utils/handleJwt.js");
const { handleHttpError } = require("../utils/handleError.js");


const createUser = async (req, res) => {
    try {
        req = matchedData(req)
        const password = await encrypt(req.password)
        const code = Math.floor(100000 + Math.random() *900000).toString()
        const body = { ...req, password, code, status:0, veryficationAtemps:3}
        const dataUser = await userModel.create(body)
        
        dataUser.set('password', undefined, { strict: false })
        const data = {
            token: tokenSign(dataUser),
            user: dataUser
        }

        res.send(data)
    } catch (err) {
        console.log(err.code)
        if(err.code === 11000)
            handleHttpError(res, 'USER_EXISTS', 409)
        else
            handleHttpError(res, 'INTERNAL_SERVER_ERROR', 500)
    }

}

const verifyCode = async (req, res) =>{
    try{
        req = matchedData(req)
        const code = await req.code;
        const id = getUserFromToken(req.token);
        const user = await userModel.findById(id);
        if (code === user.code){
            const modifiedUser = await userModel.findByIdAndUpdate(id, {status: 1}, {new:true});
            const body = {
                token: req.token, 
                user: {
                    status: modifiedUser.status,

                }}
            res.send(body)
        }
        else{
            handleHttpError(res, 'ERROR_MAIL_CODE', 400)
        }
    }catch (err){
        handleHttpError(res, 'INTERNAL_SERVER_ERROR', 500)
    }
}

module.exports = { createUser, verifyCode };