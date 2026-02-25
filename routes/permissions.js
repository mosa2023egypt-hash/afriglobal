const express = require('express');
const router = express.Router();
const Permission = require('../models/Permission');

// إنشاء صلاحية جديدة
router.post('/create-permission', async (req, res) => {
    try {
        const { name, description, module, actions } = req.body;
        if (!name || !module || !actions || actions.length === 0) {
            return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
        }
        const exist = await Permission.findOne({ name });
        if (exist) return res.status(400).json({ success: false, message: 'الصلاحية موجودة' });
        const permission = new Permission({ name, description, module, actions });
        await permission.save();
        res.status(201).json({ success: true, message: 'تم إنشاء الصلاحية', data: { id: permission._id, name, module, actions } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// جلب جميع الصلاحيات
router.get('/all-permissions', async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.json({ success: true, count: permissions.length, data: permissions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// جلب صلاحيات حسب القسم
router.get('/permissions-by-module/:module', async (req, res) => {
    try {
        const permissions = await Permission.find({ module: req.params.module });
        res.json({ success: true, count: permissions.length, data: permissions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
