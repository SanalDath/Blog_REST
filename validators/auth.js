const { check } = require('express-validator');

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

module.exports = { signupValidation, signinValidator, emailValidator };