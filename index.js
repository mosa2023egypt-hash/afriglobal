const express = require('express');
const path = require('path');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

connectDB();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
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

// Demo authentication endpoint (mock users for testing)
const DEMO_USERS = [
    { username: '1111', password: '1234', role: 'admin',               name: 'المدير العام' },
    { username: '2222', password: '1234', role: 'sales',               name: 'مبيعات 1' },
    { username: '3333', password: '1234', role: 'sales',               name: 'مبيعات 2' },
    { username: '4444', password: '1234', role: 'procurement',         name: 'مشتريات 1' },
    { username: '5555', password: '1234', role: 'procurement',         name: 'مشتريات 2' },
    { username: '6666', password: '1234', role: 'procurement_manager', name: 'مدير المشتريات' },
    { username: '7777', password: '1234', role: 'gm',                  name: 'م. عام 1' },
    { username: '8888', password: '1234', role: 'gm',                  name: 'م. عام 2' },
    { username: '9999', password: '1234', role: 'gm',                  name: 'م. عام 3' },
];

// NOTE: Demo-only endpoint – passwords stored in plain text for testing purposes.
// In production, use hashed passwords and the existing /api/auth routes instead.
app.post('/api/demo-auth/login', (req, res) => {
    const { username, password } = req.body || {};
    const user = DEMO_USERS.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
    res.json({ success: true, user: { username: user.username, name: user.name, role: user.role } });
});

// Return today's date from server
app.get('/api/time/today', (req, res) => {
    res.json({ date: new Date().toISOString().slice(0, 10) });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'حدث خطأ في السيرفر', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`السيرفر يعمل على المنفذ ${PORT}`);
});

module.exports = app;