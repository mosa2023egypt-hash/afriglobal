// auth.js

const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).send('Access denied. No token provided.');
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).send('Invalid token.');
        req.user = decoded;  // Save decoded user info in request
        next();
    });
}

// Middleware to check user role
function checkRole(roles) {
    return (req, res, next) => {
        if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
            return res.status(403).send('Access denied. Insufficient role.');
        }
        next();
    };
}

// Middleware to check permissions
function checkPermission(permission) {
    return (req, res, next) => {
        if (!req.user || !req.user.permissions || !req.user.permissions.includes(permission)) {
            return res.status(403).send('Access denied. Insufficient permissions.');
        }
        next();
    };
}

module.exports = { verifyToken, checkRole, checkPermission };