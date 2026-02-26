const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'afriglobal-secret-key-change-in-production';

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'مطلوب تسجيل الدخول' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'جلسة غير صالحة، يرجى تسجيل الدخول مجدداً' });
    }
}

function requireRoles(...roles) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ success: false, message: 'مطلوب تسجيل الدخول' });
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'ليس لديك صلاحية للوصول إلى هذه الصفحة' });
        }
        next();
    };
}

const isGM = requireRoles('gm');
const isManager = requireRoles('gm', 'sales_manager', 'procurement_manager');
const isSales = requireRoles('gm', 'sales_manager', 'sales');
const isProcurement = requireRoles('gm', 'procurement_manager', 'procurement');
const isProcurementManager = requireRoles('gm', 'procurement_manager');
const isSalesManager = requireRoles('gm', 'sales_manager');

function checkRole(roles) { return requireRoles(...roles); }
function checkPermission(permission) {
    return (req, res, next) => next();
}

module.exports = { verifyToken, requireRoles, checkRole, checkPermission, isGM, isManager, isSales, isProcurement, isProcurementManager, isSalesManager };
