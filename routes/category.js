const express = require('express');
const router = express.Router();
const { categoryController } = require('../controller');
const { addCategoryValidator, isIdValidator } = require('../validators/category');
const isAuth = require('../middleware/isAuth');
const validate = require('../validators/validate');
const isAdmin = require('../middleware/isAdmin');


router.post('/', isAuth, isAdmin, addCategoryValidator, validate, categoryController.addCategory);

router.put('/:id', isAuth, isAdmin, isIdValidator, validate, categoryController.updateCategory);

router.delete('/:id', isAuth, isAdmin, isIdValidator, validate, categoryController.deleteCategory);

router.get('/', isAuth, categoryController.searchCategory);

router.get('/:id', isAuth, isIdValidator, categoryController.getCategory);

module.exports = router;