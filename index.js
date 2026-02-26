const express = require('express');
const path = require('path');
const connectDB = require('./config/database');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'طلبات كثيرة جداً، يرجى المحاولة لاحقاً' }
});
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'عدد كبير من محاولات الدخول، يرجى الانتظار' }
});

// API routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/companies', apiLimiter, require('./routes/companies'));
app.use('/api/sales-orders', apiLimiter, require('./routes/salesOrders'));
app.use('/api/procurement', apiLimiter, require('./routes/procurement'));
app.use('/api/approvals', apiLimiter, require('./routes/approvals'));
app.use('/api/dashboard', apiLimiter, require('./routes/dashboard'));
app.use('/api/products', apiLimiter, require('./routes/products'));
app.use('/api/orders', apiLimiter, require('./routes/orders'));
app.use('/api/customers', apiLimiter, require('./routes/customers'));
app.use('/api/suppliers', apiLimiter, require('./routes/suppliers'));
app.use('/api/warehouse', apiLimiter, require('./routes/warehouse'));
app.use('/api/accounting', apiLimiter, require('./routes/accounting'));
app.use('/api/reports', apiLimiter, require('./routes/reports'));
app.use('/api/users', apiLimiter, require('./routes/users'));
app.use('/api/departments', apiLimiter, require('./routes/departments'));
app.use('/api/permissions', apiLimiter, require('./routes/permissions'));
app.use('/api/roles', apiLimiter, require('./routes/roles'));

// HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/sales', (req, res) => res.sendFile(path.join(__dirname, 'public', 'sales.html')));
app.get('/procurement', (req, res) => res.sendFile(path.join(__dirname, 'public', 'procurement.html')));
app.get('/approvals', (req, res) => res.sendFile(path.join(__dirname, 'public', 'approvals.html')));
app.get('/gm-dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'gm-dashboard.html')));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'حدث خطأ في السيرفر', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`السيرفر يعمل على المنفذ ${PORT}`);
});

module.exports = app;
