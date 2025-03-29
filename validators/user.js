const {check} = require ("express-validator")
const validateResults = require("../utils/handleValidator")

const validatorRegisterUser = [
    check("email").exists().withMessage("No email").isEmail().withMessage("No valid email"),
    check("password").exists().withMessage("No password").isLength({min:8}).withMessage("Password must be 8 characters at least"),
    validateResults
];

const validateCode = [
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
    check("company.name").optional().isString().withMessage("Name must be a string"),
    check("company.cif").optional().isString().withMessage("Cif must be a string"),
    check("company.street").optional().isString().withMessage("Street must be a string"),
    check("company.city").optional().isString().withMessage("City must be a string"),
    check("company.province").optional().isString().withMessage("Province must be a string"),
    check("company.number").optional().isInt().withMessage("Number must be a integer"),
    check("company.postal").optional().isInt().withMessage("Postal must be a integer"),
    validateResults
]

const validatorAdressData = [
    check("address").exists().withMessage("No adrress"),
    check("address.street").optional().isString().withMessage("Street must be a string"),
    check("address.province").optional().isString().withMessage("Province must be a string"),
    check("address.city").optional().isString().withMessage("City must be a string"),
    check("address.number").optional().isInt().withMessage("Number must be a integer"),
    check("address.postal").optional().isInt().withMessage("Postal must be a integer"),
    validateResults
]

const guestValidator = [
    check("email").exists().withMessage("No email").isEmail().withMessage("No valid email"),
    check("name").optional().isString().withMessage("Name must be a string"),
    check("surnames").optional().isString().withMessage("Surnames must be a string"),
    check("password").exists().withMessage("No password").isLength({min:8}).withMessage("Password must be 8 characters at least"),
    validateResults
];

const validatorRecoverToken = [
    check("email").exists().withMessage("No email").isEmail().withMessage("No valid email"),
    validateResults
];
const validatorCodeToChangePassword =[
    check("email").exists().withMessage("No email").isEmail().withMessage("No valid email"),
    check('code').exists().withMessage("No code").isLength({min: 6, max: 6}).withMessage("Invalid code"),
    validateResults
]

const validatorPassword =[
    check("password").exists().withMessage("No password").isLength({min:8}).withMessage("Password must be 8 characters at least"),
    validateResults
]

module.exports= {validatorRegisterUser, validatorRecoverToken, guestValidator, validateCode, validatorLogin,
     validatorPersonalData, validatorAdressData, validatorCompanyData, validatorCodeToChangePassword, validatorPassword};