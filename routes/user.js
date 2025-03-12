const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/user.js");
const {validatorRegisterUser} = require("../validators/user.js");

router.post('/register', validatorRegisterUser, createUser);
module.exports = router; 