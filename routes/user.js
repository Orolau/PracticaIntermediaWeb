const express = require("express");
const router = express.Router();
const { createUser, verifyCode, login, addPersonalUserData, addCompanyUserData, uploadLogo, getUser, deleteUser, createGuestUser, recoverToken, validationToRecoverPassword, changePassword, addAddressUserData } = require("../controllers/user.js");
const {validatorRegisterUser, guestValidator, validateCode, validatorLogin,validatorPassword, validatorPersonalData, validatorCompanyData, validatorRecoverToken, validatorCodeToChangePassword, validatorAdressData} = require("../validators/user.js");
const authMiddleware = require("../middleware/session.js");
const { uploadMiddlewareMemory } = require("../utils/handleStorage.js");
const checkUniqueCIF = require("../middleware/checkUniqueCif.js");

router.post('/register', validatorRegisterUser, createUser);
router.put('/validation', authMiddleware, validateCode, verifyCode);
router.post('/login', validatorLogin, login );
router.patch('/register', authMiddleware, validatorPersonalData, addPersonalUserData);
router.patch('/company', authMiddleware, checkUniqueCIF, validatorCompanyData, addCompanyUserData);
router.patch('/address', authMiddleware, validatorAdressData, addAddressUserData);
router.patch('/logo', authMiddleware, uploadMiddlewareMemory.single("image"), uploadLogo);
router.get('/', authMiddleware, getUser);
router.delete('/', authMiddleware, deleteUser);
router.post('/invite', authMiddleware, guestValidator, createGuestUser);
router.post('/recover', validatorRecoverToken, recoverToken);
router.post('/validation', validatorCodeToChangePassword, validationToRecoverPassword);
router.patch('/password', authMiddleware, validatorPassword, changePassword);

module.exports = router; 