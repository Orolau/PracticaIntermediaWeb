const {check} = require ("express-validator")
const validateResults = require("../utils/handleValidator")

const validatorRegisterUser = [
    check("email").exists().withMessage("No email").isEmail().withMessage("No valid email"),
    check("password").exists().withMessage("No password").isLength({min:8}).withMessage("Password must be 8 characters at least"),
    validateResults
];

module.exports= {validatorRegisterUser};