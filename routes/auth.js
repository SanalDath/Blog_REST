const express = require('express');
const router = express.Router();
const { authController } = require('../controller');
const { signupValidation,
    signinValidator,
    emailValidator,
    VerifyUser,
    ChangePassword,
    OldandNewPasswordValidator,
    updateUserValidator} = require('../validators/auth');
const validate = require('../validators/validate');
const isAuth = require('../middleware/isAuth');


router.post('/signup', signupValidation, validate, authController.signup);

router.post('/signin', signinValidator, validate, authController.signin);

router.post('/send-verification-email', emailValidator, validate, authController.verifyCode);

router.post('/verify-user', VerifyUser, validate, authController.verifyUser);

router.post('/forgot-password-route', emailValidator, validate, authController.forgotPasswordCode);

router.post('/change-password', ChangePassword, validate, authController.changePassword);

//decrypting the token
router.put('/change-password', OldandNewPasswordValidator, isAuth, authController.modifypassword);

router.put('/update-user', isAuth, updateUserValidator, validate, authController.UpdateUser);

module.exports = router;