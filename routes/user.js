const express = require("express");
const router = express.Router();
const { createUser, verifyCode, login } = require("../controllers/user.js");
const {validatorRegisterUser, validateCode, validatorLogin} = require("../validators/user.js");

router.post('/register', validatorRegisterUser, createUser);
router.put('/validation', validateCode, verifyCode);
router.post('/login', validatorLogin, login );
module.exports = router; 