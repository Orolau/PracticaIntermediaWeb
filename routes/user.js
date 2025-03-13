const express = require("express");
const router = express.Router();
const { createUser, verifyCode } = require("../controllers/user.js");
const {validatorRegisterUser, validateCode} = require("../validators/user.js");

router.post('/register', validatorRegisterUser, createUser);
router.put('/validation', validateCode, verifyCode);
module.exports = router; 