const { check, param } = require('express-validator');
const { default: mongoose } = require('mongoose');

const addCategoryValidator = [
    check('title')
        .notEmpty()
        .withMessage('Title is required'),
    check('desc')
        .notEmpty()
        .withMessage('Description is required')
];

const isIdValidator = [
    param('id').custom(async (id) => {
        if (id && !mongoose.Types.ObjectId.isValid(id)) {
            throw  "Invalid category id"
        }
    })
];

module.exports = { addCategoryValidator, isIdValidator };