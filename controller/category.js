const { Category, User } = require('../models');

const addCategory = async (req, res, next) => {
    try {
        const { title, desc } = req.body;
        const { _id } = req.user;

        const isCategoryExist = await Category.findOne({ title });
        
        if (isCategoryExist) {

            res.code = 400;
            throw new Error('Category already exists');
        }

        const user = await User.findById(_id);
        
        if (!user) {

            res.code = 404;
            throw new Error('User does not exist');
        }

        const addNewCategory = new Category({ title, desc, updatedBy: _id });
        await addNewCategory.save();

        res.status(200).json({ code: 200, status: true, message: "New category addded successfuly" });

    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { _id } = req.user;
        const { title, desc } = req.body;
        

        const category = await Category.findById(id);

        if (!category) {
            res.code = 400;
            throw new Error('Category not found');
        }

        const isCategoryExist = await Category.findOne({ title });

        if (isCategoryExist && isCategoryExist.title === title && String(isCategoryExist._id) !== String(category._id)) {
            res.code = 400;
            throw new Error('Title already exists');
        }
        
        category.title = title ? title : category.title;
        category.desc = desc;
        category.updatedBy = _id;

        await category.save();

        res.status(200).json({ code: 200, status: true, message: "Category is updated successfuly", data: {category} });

    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            res.code = 404;;
            throw new Error('Category not found');
        }

        await Category.findByIdAndDelete(id);

        res.status(200).json({ code: 200, status: true, message: "Category deleted successfuly" });

    } catch (error) {
        next(error);
    }
};
 
const searchCategory = async (req, res, next) => {
    try {
        const { q, size, page } = req.query;

        const sizeNumber = parseInt(size) || 10;
        const pageNumber = parseInt(page) || 1;

        let query = {};

        if (q) {
            const search = RegExp(q, "i");
            query = { $or: [{ title: search }, { desc: search }] };
        }

        const total = await Category.countDocuments(query);
        const pages = Math.ceil(total / sizeNumber);

        const category = await Category
            .find(query)
            .skip((pageNumber - 1) * sizeNumber)
            .limit(sizeNumber)
            .sort({ updatedBy: -1 });

        if (!category) {
            res.code = 400;
            throw new Error('Categorys not available');
        }

        res.status(200)
            .json({ code: 200, status: true, message: "results", data: { category, total, pages } });
    } catch(error) {
        next(error);
    }
};

const getCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            res.code = 400;
            throw new Error('Category not found');
        }

        res.status(200).json({ code: 200, status: true, message: 'Category found successfuly', data: { category } });
    } catch (error) {
        next(error);
    }
};

module.exports = { addCategory, updateCategory, deleteCategory, searchCategory, getCategory };