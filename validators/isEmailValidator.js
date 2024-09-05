const isEmailValidator = (email) => {
    const result = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    return result;
};

module.exports = isEmailValidator;