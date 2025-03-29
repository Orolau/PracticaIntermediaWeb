const { userModel } = require("../models/index.js");
const { matchedData, header } = require("express-validator");
const { encrypt, compare } = require("../utils/handlePassword.js");
const { tokenSign, getUserFromToken } = require("../utils/handleJwt.js");
const { handleHttpError } = require("../utils/handleError.js");
const { uploadToPinata } = require("../utils/handleUploadIPFS.js");

// Crea un nuevo usuario, encripta la contraseña y genera un código de verificación
const createUser = async (req, res) => {
    try {
        req = matchedData(req)
        const password = await encrypt(req.password)
        const code = Math.floor(100000 + Math.random() *900000).toString()//genera un código de 6 dígitos
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
// Verifica el código enviado por el usuario comparándolo con el almacenado en la bbdd para activar la cuenta
const verifyCode = async (req, res) =>{
    try{
        const token = req.headers.authoritation
        const user = req.user
        req = matchedData(req)
        if (req.code === user.code){
            const modifiedUser = await userModel.findByIdAndUpdate(user.id, {status: 1}, {new:true});
            const body = {
                token: token, 
                user: {
                    status: modifiedUser.status,
                }}
            res.send(body)
        }
        else{
            handleHttpError(res, 'ERROR_MAIL_CODE', 400)
        }
    }catch (err){
        console.log(err)
        handleHttpError(res, 'INTERNAL_SERVER_ERROR', 500)
    }
}
// Inicia sesión verificando las credenciales y genera un token
const login = async (req, res) =>{
    try{
        req = matchedData(req)
        const user = await userModel.findOne({email: req.email})
        if(!user){
            handleHttpError(res, 'USER_NOT_FOUND', 404)
        }
        else if(user.veryficationAtemps<=0){
            handleHttpError(res, 'NO_ATEMPS_LEFT', 402)
        }
        else if(user.status === 0){
            handleHttpError(res, 'USER_NOT_VALIDATED', 401)
        }
        else{
            const resultComparation = await compare(req.password, user.password)
            if (resultComparation){
                await userModel.findOneAndUpdate({_id: user._id}, {veryficationAtemps: 3})
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
                await userModel.findOneAndUpdate({_id: user._id}, {veryficationAtemps: user.veryficationAtemps-1})
                handleHttpError(res, 'INVALID_LOGIN', 400)
            }    
        }
        
    }catch (err){
        console.log(err)
        handleHttpError(res, 'INTERNAL_SERVER_ERROR', 500)
    }
}
// Añade información personal (nombre, apellidos y nif) al usuario autenticado
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

// Añade información de la empresa asociada al usuario. si el usuario es autonomo, la compañía toma los datos del usuario
const addCompanyUserData = async (req, res) => {
    try {
        const id = req.user._id;
        const userOld = req.user;
        const autonomo = req.query.autonomo === 'true';
        req = matchedData(req);

        
        if (autonomo) {
            req.company = req.company || {};
            req.company.name = userOld.name;
            req.company.cif = userOld.nif;
            req.company.street = userOld.address?.street;
            req.company.number = userOld.address?.number;
            req.company.city = userOld.address?.city;
            req.company.postal = userOld.address?.postal;
            req.company.province = userOld.address?.province;
        }

        const user = await userModel.findOneAndUpdate({ _id: id }, req, { new: true, select: '-password' });

        if (!user) {
            handleHttpError(res, 'USER_NOT_FOUND', 404);
        } else {
            res.send(user);
        }
    } catch (err) {
        if (err.code === 11000) {
            handleHttpError(res, 'COMPANY_EXISTS', 409);
        } else {
            handleHttpError(res, 'INTERNAL_SERVER_ERROR', 500);
        }
    }
};

// Añade una dirección al usuario
const addAddressUserData = async (req, res) =>{
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

//Subida a la nube del logo proporcionado y actualización del campo url del usuario autenticado
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

//Devuelve el usuario autenticado con el token
const getUser = async (req, res) =>{
    try{
        const user = req.user;
        res.send(user)
    }catch(err){
        handleHttpError(res, 'INTERNAL_SERVER_ERROR', 500)
    }
}

//Elimina el usuario al que se le corresponde el token pasado (hard: borrado completo; soft: borrado lógico, sigue en la base de datos pero con la cuenta deshabilitada)
const deleteUser = async (req, res) =>{
    try{
        const { soft } = req.query
        const user = req.user
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

//Crea un nuevo usuario con el rol guest y al que se le asigna la misma compañía del usuario autenticado
const createGuestUser = async (req, res) =>{
    try {
        const user = req.user
        req = matchedData(req)
        const password = await encrypt(req.password)
        const code = Math.floor(100000 + Math.random() *900000).toString()
        const body = { ...req, company:user.company, password, code, role:'guest', status:0, veryficationAtemps:3}
        const dataUser = await userModel.create(body)
        
        const data = {
            token: tokenSign(dataUser),
            user:{
                email: dataUser.email,
                status: dataUser.status,
                role: dataUser.role,
                _id: dataUser._id
            }
        }

        res.send(data)
    } catch (err) {
        if(err.code === 11000)
            handleHttpError(res, 'USER_EXISTS', 409)
        else
            handleHttpError(res, 'INTERNAL_SERVER_ERROR', 500)
    }

}

/*Recuperación de la contraseña*/
// 1. Recuperar el token, por lo que se envía el usuario introduce el email y se envía a este un nuevo código de verificación
const recoverToken = async (req, res) =>{
    try{
        req = matchedData(req)
        const code = Math.floor(100000 + Math.random() *900000).toString()
        const user = await userModel.findOneAndUpdate({email: req.email}, {code: code}, { new: true})
        const body ={
            user:{
                email: user.email,
                //code: code,
                status: user.status,
                role: user.role,
                _id: user._id
            }
        }
        res.send(body)
    }catch (err){
        handleHttpError(res, 'INTERNAL_SERVER_ERROR', 500)
    }
}

// 2. Validación del nuevo código enviado, entonces se devuelve el token
const validationToRecoverPassword = async (req, res) =>{
    try{
        req = matchedData(req)
        const user = await userModel.findOne({email:req.email})
       
        if(!user)
            handleHttpError(res, 'USER_NOT_FOUND', 404)
        else if(user.code !== req.code)
            handleHttpError(res, 'ERROR_MAIL_CODE', 401)
        else{
            const data = {
                token: tokenSign(user),
                user: {
                    email: user.email,
                    status: user.status,
                    role: user.role,
                    _id: user._id
                }
            }
            res.send(data)
        }

    }catch (err){
        console.log(err)
        handleHttpError(res, 'INTERNAL_SERVER_ERROR', 500)
    }
}
// 3. Cambio de la contraseña del usuario, proporcionando un token válido
const changePassword = async (req, res) =>{
    try{
        const user = req.user
        req = matchedData(req)
        const password = await encrypt(req.password)
        if (!user)
            handleHttpError(res, 'USER_NOT_FOUND', 404)
        else{
            await userModel.findByIdAndUpdate(user._id, {password: password})
            res.status(200).send({message: "Password changed succesfully"})
        }
        
    }catch(err){
        handleHttpError(res, 'INTERNAL_SERVER_ERROR', 500)
    }
}


module.exports = { createUser, recoverToken, validationToRecoverPassword, verifyCode, login, addPersonalUserData,
     addCompanyUserData, addAddressUserData, uploadLogo, getUser, deleteUser, createGuestUser, changePassword };