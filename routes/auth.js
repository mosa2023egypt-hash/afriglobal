'use strict';
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'afriglobal-secret-key-change-in-production';
const JWT_EXPIRES = '8h';

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'اسم المستخدم وكلمة المرور مطلوبان' });
        }
        const user = await User.findOne({ $or: [{ username }, { email: username }], isActive: true });
        if (!user) {
            return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
        }
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role, fullName: user.fullName },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );
        res.json({ 
            success: true, 
            message: 'تم تسجيل الدخول بنجاح',
            token,
            user: { id: user._id, username: user.username, fullName: user.fullName, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, fullName, phone, role } = req.body;
        if (!username || !email || !password || !fullName || !role) {
            return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
        }
        const validRoles = ['gm', 'sales_manager', 'sales', 'procurement_manager', 'procurement'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: 'الدور غير صالح' });
        }
        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing) {
            return res.status(400).json({ success: false, message: 'اسم المستخدم أو البريد الإلكتروني موجود بالفعل' });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashed, fullName, phone, role });
        await user.save();
        res.status(201).json({ 
            success: true, 
            message: 'تم إنشاء الحساب بنجاح',
            data: { id: user._id, username, email, fullName, role }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/me', require('../middleware/auth').verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
