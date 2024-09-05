const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    title: { type: String, required: true },
    desc: String,
    updatedBy: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema); 


module.exports = Category;
