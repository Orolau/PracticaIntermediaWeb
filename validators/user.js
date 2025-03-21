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

const validatorPersonalData = [
    check("email").exists().withMessage("No email").isEmail().withMessage("No valid email"),
    check("name").exists().withMessage("No name").notEmpty().withMessage("No valid name"),
    check("surnames").exists().withMessage("No name").notEmpty().withMessage("No valid surname"),
    check("nif").exists().withMessage("No name").notEmpty().withMessage("No valid nif"),
    validateResults
]

const validatorCompanyData = [
    check("company").exists().withMessage("No company"),
    check("company.name").isString().withMessage("Name must be a string"),
    check("company.cif").isString().withMessage("Cif must be a string"),
    check("company.street").isString().withMessage("Street must be a string"),
    check("company.city").isString().withMessage("City must be a string"),
    check("company.province").isString().withMessage("Province must be a string"),
    check("company.number").isInt().withMessage("Number must be a integer"),
    check("company.postal").isInt().withMessage("Postal must be a integer"),
    validateResults
]

module.exports= {validatorRegisterUser, validateCode, validatorLogin, validatorPersonalData, validatorCompanyData};