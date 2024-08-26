const undefRoute = (req, res, next) => {
    res.status(404).json({
        code: 404,
        status: false,
        message: "Api is not found"
    });
};

module.exports = undefRoute;