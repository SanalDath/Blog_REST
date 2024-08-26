// controller/auth.js
const { User } = require('../models');
const hashPassword = require('../utils/hashing');
const comparePassword = require('../utils/matchPassword');
const genToken = require('../utils/genToken');

const signup = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const isEmailExist = await User.findOne({ email });
        if (isEmailExist) {
            res.code = 400;
            throw new Error("Email already exists");
        };

        const hashedPassword = await hashPassword(password);

        const newUser = new User({ name, email, password: hashedPassword, role });
        
        await newUser.save();

        res.status(201).json({
            code: 201,
            status: true,
            message: 'The new user was added successfully'
        });
    } catch (error) {
        next(error);
    }
};

const signin = async (req, res, next) => {
    try {
        const {  email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.code = 401;
            throw new Error('User is not found');
        }
        const match = comparePassword(password, user.password);
        if (!match) {
            res.send = 401;
            throw new Error('Invalid credentials');
        }

        const token = genToken(user);
        res.status(200)
            .json({
                code: 200,
                status: true,
                message: "User signed in successfuly",
                data: { token },
            });
        
    } catch (error) {
        next();
    }
}
module.exports = { signup, signin }; 
