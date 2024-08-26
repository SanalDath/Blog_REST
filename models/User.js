const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: Number, default: 3 }, // role = 1 means superuser, role = 2 means normal admin, role = 3 means normal user
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

module.exports = User;