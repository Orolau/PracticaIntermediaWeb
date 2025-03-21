const express = require("express");
const router = express.Router();
const { createUser, verifyCode, login, addPersonalUserData, addCompanyUserData } = require("../controllers/user.js");
const {validatorRegisterUser, validateCode, validatorLogin, validatorPersonalData, validatorCompanyData} = require("../validators/user.js");
const authMiddleware = require("../middleware/session.js");

router.post('/register', validatorRegisterUser, createUser);
router.put('/validation', validateCode, verifyCode);
router.post('/login', validatorLogin, login );
router.put('/register', authMiddleware, validatorPersonalData, addPersonalUserData);
router.patch('/company', authMiddleware, validatorCompanyData, addCompanyUserData)
module.exports = router; 