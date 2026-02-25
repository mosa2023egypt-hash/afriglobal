// Error handling middleware for the application
const errorHandler = (err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    console.error(`[ERROR] Status: ${status}, Message: ${message}`);
    res.status(status).json({ success: false, error: { status: status, message: message } });
};

const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

module.exports = { errorHandler, notFoundHandler };