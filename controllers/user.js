const { userModel } = require("../models/index.js");
const { matchedData, header } = require("express-validator");
const { encrypt, compare } = require("../utils/handlePassword.js");
const { tokenSign, getUserFromToken } = require("../utils/handleJwt.js");
const { handleHttpError } = require("../utils/handleError.js");
const { uploadToPinata } = require("../utils/handleUploadIPFS.js");


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

const login = async (req, res) =>{
    try{
        req = matchedData(req)
        const user = await userModel.findOne({email: req.email})
        if(!user){
            handleHttpError(res, 'USER_NOT_FOUND', 404)
        }
        else if(user.status === 0){
            handleHttpError(res, 'USER_NOT_VALIDATED', 401)
        }
        else{
            const resultComparation = await compare(req.password, user.password)
            if (resultComparation){
                const body = {
                    token: tokenSign(user),
                    user: {
                        email: user.email,
                        role: user.role,
                        _id: user._id,
                        name: user.name
                    }
                }
                res.send(body)
            }
            else{
                handleHttpError(res, 'INVALID_LOGIN', 400)
            }    
        }
        
    }catch (err){
        handleHttpError(res, 'INTERNAL_SERVER_ERROR', 500)
    }
}

const addPersonalUserData = async (req, res) =>{
    try{
        const id = req.user._id;
        req = matchedData(req)
        const user = await userModel.findOneAndUpdate({_id: id}, req, { new: true, select: '-password' })
        if(!user){
            handleHttpError(res, 'USER_NOT_FOUND', 404)
        }
        else{
            res.send(user)
        }

    }catch (err){
        handleHttpError(res, 'INTERNAL_SERVER_ERROR', 500)
    }
}

const addCompanyUserData = async (req, res) =>{
    try{
        const id = req.user._id;
        req = matchedData(req)
        const user = await userModel.findOneAndUpdate({_id: id}, req, { new: true, select: '-password' })
        if(!user){
            handleHttpError(res, 'USER_NOT_FOUND', 404)
        }
        else{
            res.send(user)
        }
    }catch (err){
        if(err.code === 11000)
            handleHttpError(res, 'COMPANY_EXISTS', 409)
        else
            handleHttpError(res, 'INTERNAL_SERVER_ERROR', 500)
    }
}

const uploadLogo = async (req, res) =>{
    try{
        const id = req.user._id;

        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;
        const pinataResponse = await uploadToPinata(fileBuffer, fileName);
        const ipfsFile = pinataResponse.IpfsHash;
        const ipfs = `https://${process.env.PINATA_GATEWAY}/ipfs/${ipfsFile}`;

        const user = await userModel.findOneAndUpdate({_id: id}, {url:ipfs}, { new: true, select: '-password' })
        
        res.send(user)
    }catch(err){
        handleHttpError(res, 'INTERNAL_SERVER_ERROR', 500)
    }
}

const getUser = async (req, res) =>{
    try{
        const user = req.user;
        res.send(user)
    }catch(err){
        handleHttpError(res, 'INTERNAL_SERVER_ERROR', 500)
    }
}

const deleteUser = async (req, res) =>{
    try{
        const { soft } = req.query
        console.log(soft)
        const user = req.user;
        if (!user) {
            return handleHttpError(res, 'USER_NOT_FOUND', 404);
        }
        if(soft === 'true'){
            await userModel.delete({_id: user._id})
            res.status(200).send({message: 'User soft deleted succesfully'})
        } 
        else{
            await userModel.deleteOne({_id: user._id})
            res.status(200).send({message: 'User hard deleted succesfully'})
        }
    }catch (err){
        handleHttpError(res, 'INTERNAL_SERVER_ERROR', 500)
    }
}

module.exports = { createUser, verifyCode, login, addPersonalUserData, addCompanyUserData, uploadLogo, getUser, deleteUser };