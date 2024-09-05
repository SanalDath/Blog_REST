// controller/auth.js
const { User } = require('../models');
const hashPassword = require('../utils/hashing');
const comparePassword = require('../utils/matchPassword');
const genToken = require('../utils/genToken');
const generateCode = require('../utils/genCode');
const sendMail = require('../utils/sendEmail')

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
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.code = 401;
            throw new Error('User is not found');
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            res.code = 401;
            throw new Error('Invalid credentials');
        }

        const token = genToken(user);
        if (!token) {
            res.code = 400;
            throw new Error('Token failed to generate');
        }
        res.status(200)
            .json({
                code: 200,
                status: true,
                message: "User signed in successfuly",
                data: { token },
            });
        
    } catch (error) {
        next(error);
    }
};

const verifyCode = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.code = 404;
            throw new Error('User not found');
        }

        if (user.isVerified) {
            res.code = 400;
            throw new Error('User is already verified');
        }

        const code = generateCode(6);

        user.verificationCode = code;

        await user.save();
        //send email
        await sendMail({
            emailTo: user.email,
            subject: "Email verification code",
            code,
            content: 'Verify your account'
        });
        res.status(200).json({
            code: 200,
            status: true,
            message: 'User verification code send successfuly',
        });
    } catch (error) {
        next(error);
    }
};

const verifyUser = async (req, res, next) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            res.code = 404;
            throw new Error('User is not found');

        } 

        if (user.verificationCode !== code) {
            res.code = 400;
            throw new Error('Code does not match');
        }

        user.isVerified = true;
        user.verificationCode = null;
        await user.save();

        res.status(200).json({ code: 200, status: true, message: 'User verified successfuly' });

    } catch (error) {
        next(error);
        }
}

const forgotPasswordCode = async (req, res, next) => { 
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });

        if (!user) {
            res.code = 404;
            throw new Error('User is not found');
        }

        const code = generateCode(6);
        
        if (!code) {
            res.code = 400;
            throw new Error('Code is not generated');
        }

        user.forgotPasswordCode = code;
        
        await user.save();

        await sendMail({
            emailTo: user.email,
            subject: "Forgot password code",
            code,
            content: "Use this code to reset password"
        });

        res.status(200).json({code: 200, status: true, message: "Forgotten password code sent successfuly"})

    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => { 
    try {
        const { email, code, password } = req.body;

        const user = await User.findOne({ email });

        if(!user) {
            res.code = 404;
            throw new Error('User not found');
        }

        if (user.forgotPasswordCode !== code) {
            res.code = 400;
            throw new Error('Code is not valid or code mismatch');
        }

        const hashedPassword = await hashPassword(password);

        user.password = hashedPassword;
        user.forgotPasswordCode = null;
        await user.save();

        res.status(200).json({ code: 200, status: true, message: 'Password updated sccessfuly' });
    } catch (error) {
        next(error);
    }
};

const modifypassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        const { _id } = req.user;

        const user = await User.findById(_id);

        if (!user) {
            res.code = 401;
            throw new Error('User not found');
        }
        if (oldPassword === newPassword) {
            res.code = 400;
            throw new Error('Old password cant be new password');
        }

        if (newPassword !== confirmPassword) {
             res.code = 400;
             throw new Error('new password is not same as confirm password');
        }

        const match = await comparePassword(oldPassword, user.password);

        if (!match) {
            res.code = 400;
            throw new Error('Old password doesnt match');
        }

        const hashedPassword = await hashPassword(confirmPassword);

        if (!hashPassword) {
             res.code = 400;
             throw new Error('failed to generate hashed password');
        }

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ code: 200, status: true, message: "New password updated successfuly"});

    } catch (error) {
        next(error);
    }
};

const UpdateUser = async (req, res, next) => {
    try {
        const { name, email } = req.body;

        const { _id } = req.user;

        const user = await User.findById(_id)
            .select("-password -verificationCode -forgotPasswordCode"); //select will hide these confidential data

        if (!user) {
            res.code = 404;
            throw new Error('User not found');
        }

        if (email) {
            const isAlreadyUser = await User.findOne({ email });
            if (isAlreadyUser && isAlreadyUser.email === email && String(isAlreadyUser._id) !== String(user.id)) {
                res.code = 400;
                throw new Error('User already exists!!');
            }
        }

        user.name = name ? name : user.name;
        user.email = email ? email : user.email;

        if (email) {
            user.isVerified = false;
        }

        await user.save();

        res.status(200).json({ code: 200, status: true, message: "User updated succcessfuly", data: { user } });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    signup,
    signin,
    verifyCode,
    verifyUser,
    forgotPasswordCode,
    changePassword,
    modifypassword,
    UpdateUser
}; 
