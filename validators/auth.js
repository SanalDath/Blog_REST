const { check } = require('express-validator');
const isEmailValidator = require('../validators/isEmailValidator');

const signupValidation = [
    check("name")
        .notEmpty()
        .withMessage('Name is required'),
    check("email")
        .isEmail()
        .withMessage('Please enter valid email')
        .notEmpty()
        .withMessage('Email is required'),
    check('password')
        .notEmpty()
        .withMessage('Password should not be empty')
        .isLength({ min: 6 })
        .withMessage('Password should require minimum 6 characters')
];

const signinValidator = [
    check('email')
        .notEmpty()
        .withMessage('Email should not be empty')
        .isEmail()
        .withMessage('The entred email is not valid'),
    check('password')
        .notEmpty()
        .withMessage('Password should not be empty')
];

const emailValidator = [
    check('email')
        .isEmail()
        .withMessage('Invalid email')
        .notEmpty()
        .withMessage('Email required')
];

const VerifyUser = [
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Valid email id is required'),
    check('code')
        .notEmpty()
        .withMessage('Code is required')
];

const ChangePassword = [
    check('email')
        .isEmail()
        .withMessage('Enter a valid email')
        .notEmpty()
        .withMessage('Email should not be empty'),
    check('code')
        .notEmpty()
        .withMessage('Code is empty'),
    check('password')
        .notEmpty()
        .withMessage('Password shuld not be empty')
        .isLength({ min: 6 })
        .withMessage('Password should contain minimum 6 charachters')
];

const OldandNewPasswordValidator = [
    check('oldPassword')
        .notEmpty()
        .withMessage('Old password should not be empty'),
    check('newPassword')
        .notEmpty()
        .withMessage('New password should not be empty'),
    check('confirmPassword')
        .notEmpty()
        .withMessage('New password should not be empty'),
];

const updateUserValidator = [
    check('email').custom(async (email) => {
        if (email) {
            const isEmailValid = isEmailValidator(email);
            if (!isEmailValid) {
                throw "Email is not valid";
            }
        }
    })
];

module.exports = {
    signupValidation,
    signinValidator,
    emailValidator,
    VerifyUser,
    ChangePassword,
    OldandNewPasswordValidator,
    updateUserValidator
};