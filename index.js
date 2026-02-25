const express = require('express');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

// الاتصال بقاعدة البيانات
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/warehouse', require('./routes/warehouse'));
app.use('/api/accounting', require('./routes/accounting'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/permissions', require('./routes/permissions'));
app.use('/api/roles', require('./routes/roles'));

// Error Handler Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'حدث خطأ في السيرفر', error: err.message });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`السيرفر يعمل على المنفذ ${PORT}`);
});

module.exports = app;
