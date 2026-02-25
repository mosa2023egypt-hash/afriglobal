const express = require('express');
const router = express.Router();
const Role = require('../models/Role');

router.post('/create-role', async (req, res) => {
    try {
        const { name, description, department, level, permissionIds } = req.body;
        if (!name || level === undefined) {
            return res.status(400).json({ success: false, message: 'الاسم والمستوى مطلوبان' });
        }
        const exist = await Role.findOne({ name });
        if (exist) return res.status(400).json({ success: false, message: 'الدور موجود' });
        const role = new Role({ name, description, department, level, permissions: permissionIds || [] });
        await role.save();
        res.status(201).json({ success: true, message: 'تم إنشاء الدور', data: { id: role._id, name, level } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/all-roles', async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions').populate('department', 'name');
        res.json({ success: true, count: roles.length, data: roles });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/role/:roleId', async (req, res) => {
    try {
        const role = await Role.findById(req.params.roleId).populate('permissions').populate('department');
        if (!role) return res.status(404).json({ success: false, message: 'غير موجود' });
        res.json({ success: true, data: role });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put('/update-role-permissions/:roleId', async (req, res) => {
    try {
        const { permissionIds } = req.body;
        if (!permissionIds || permissionIds.length === 0) {
            return res.status(400).json({ success: false, message: 'الصلاحيات مطلوبة' });
        }
        const role = await Role.findByIdAndUpdate(req.params.roleId, { permissions: permissionIds }, { new: true }).populate('permissions');
        if (!role) return res.status(404).json({ success: false, message: 'غير موجود' });
        res.json({ success: true, message: 'تم تحديث الصلاحيات', data: role });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
