const {check} = require ("express-validator")
const validateResults = require("../utils/handleValidator")

const validatorRegisterUser = [
    check("email").exists().withMessage("No email").isEmail().withMessage("No valid email"),
    check("password").exists().withMessage("No password").isLength({min:8}).withMessage("Password must be 8 characters at least"),
    validateResults
];

const validateCode = [
    check('token').exists().withMessage("No token"),
    check('code').exists().withMessage("No code").isLength({min: 6, max: 6}).withMessage("Invalid code"),
    validateResults
];

const validatorLogin = [
    check("email").exists().withMessage("No email").isEmail().withMessage("No valid email"),
    check("password").exists().withMessage("No password"),
    validateResults
];

module.exports= {validatorRegisterUser, validateCode, validatorLogin};