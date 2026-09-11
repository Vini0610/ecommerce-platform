const errorHandler = (err, req, res, next) => {
    console.error(err);

    const statusCode = err.statusCode || 500;
    
    res.status( statusCode).json({
        message: err.message || "Internal server error"
    });
};

module.exports = errorHandler;