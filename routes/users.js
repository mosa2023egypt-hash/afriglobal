const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Department = require('../models/Department');
const Role = require('../models/Role');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/create-user', async (req, res) => {
    try {
        const { username, email, password, fullName, phone, roleId, departmentId } = req.body;
        if (!username || !email || !password || !roleId || !departmentId) {
            return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
        }
        const dept = await Department.findById(departmentId);
        if (!dept) return res.status(404).json({ success: false, message: 'القسم غير موجود' });
        const role = await Role.findById(roleId).populate('permissions');
        if (!role) return res.status(404).json({ success: false, message: 'الدور غير موجود' });
        const exist = await User.findOne({ $or: [{ username }, { email }] });
        if (exist) return res.status(400).json({ success: false, message: 'المستخدم موجود' });
        const newUser = new User({
            username,
            email,
            password,
            fullName: fullName || username,
            phone: phone || '',
            role: roleId,
            department: departmentId,
            customPermissions: role.permissions.map(p => p._id),
            isActive: true
        });
        await newUser.save();
        if (role.level === 2) dept.manager = newUser._id;
        else if (role.level === 3) dept.staff.push(newUser._id);
        await dept.save();
        res.status(201).json({ success: true, message: 'تم إنشاء المستخدم - الصلاحيات تحددت تلقائياً', data: { id: newUser._id, username, email, role: role.name, department: dept.name, permissions: role.permissions } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ success: false, message: 'البيانات مطلوبة' });
        const user = await User.findOne({ username }).populate('department').populate('role').populate('customPermissions');
        if (!user) return res.status(401).json({ success: false, message: 'خطأ' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ success: false, message: 'خطأ' });
        const token = jwt.sign({ userId: user._id, username, roleId: user.role._id, dept: user.department._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({ success: true, token, user: { id: user._id, username, fullName: user.fullName, role: user.role.name, department: user.department.name, permissions: user.customPermissions } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put('/update-user-permissions/:userId', async (req, res) => {
    try {
        const { permissionIds } = req.body;
        if (!permissionIds || permissionIds.length === 0) {
            return res.status(400).json({ success: false, message: 'الصلاحيات مطلوبة' });
        }
        const user = await User.findByIdAndUpdate(req.params.userId, { customPermissions: permissionIds }, { new: true }).populate('customPermissions').populate('role').populate('department');
        if (!user) return res.status(404).json({ success: false, message: 'غير موجود' });
        res.json({ success: true, message: 'تم تحديث الصلاحيات', data: { id: user._id, username: user.username, role: user.role.name, permissions: user.customPermissions } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put('/update-user-role/:userId', async (req, res) => {
    try {
        const { roleId } = req.body;
        if (!roleId) return res.status(400).json({ success: false, message: 'الدور مطلوب' });
        const role = await Role.findById(roleId).populate('permissions');
        if (!role) return res.status(404).json({ success: false, message: 'الدور غير موجود' });
        const user = await User.findByIdAndUpdate(req.params.userId, { role: roleId, customPermissions: role.permissions.map(p => p._id) }, { new: true }).populate('customPermissions').populate('role').populate('department');
        if (!user) return res.status(404).json({ success: false, message: 'غير موجود' });
        res.json({ success: true, message: 'تم تحديث الدور والصلاحيات تلقائياً', data: { id: user._id, username: user.username, role: user.role.name, department: user.department.name, permissions: user.customPermissions } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('department', 'name').populate('role', 'name level').populate('customPermissions');
        if (!user) return res.status(404).json({ success: false, message: 'غير موجود' });
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/all-users', async (req, res) => {
    try {
        const users = await User.find().populate('department', 'name').populate('role', 'name level').populate('customPermissions');
        res.json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
