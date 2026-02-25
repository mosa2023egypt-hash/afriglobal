// auth.js middleware for JWT token verification, role checking, and permission checking

const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET; // Your secret key for signing tokens

// JWT Token Verification Middleware
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from header
    if (!token) return res.status(403).send('A token is required for authentication');

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).send('Invalid Token');
        req.user = decoded; // Save the decoded user info in request
        next();
    });
}

// Role Checking Middleware
function checkRole(roles) {
    return (req, res, next) => {
        if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
            return res.status(403).send('Access denied: insufficient permissions');
        }
        next();
    };
}

// Permission Checking Middleware
function checkPermission(permission) {
    return (req, res, next) => {
        if (!req.user || !req.user.permissions || !req.user.permissions.includes(permission)) {
            return res.status(403).send('Access denied: insufficient permissions');
        }
        next();
    };
}

module.exports = { verifyToken, checkRole, checkPermission };