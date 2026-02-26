'use strict';
const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Product = require('../models/Product');
const Origin = require('../models/Origin');
const { verifyToken, requireRoles } = require('../middleware/auth');

router.get('/pending', verifyToken, requireRoles('gm', 'sales_manager', 'procurement_manager'), async (req, res) => {
    try {
        const [companies, products, origins] = await Promise.all([
            Company.find({ status: 'pending' }).populate('createdBy', 'fullName role'),
            Product.find({ status: 'pending' }).populate('createdBy', 'fullName role'),
            Origin.find({ status: 'pending' }).populate('createdBy', 'fullName role'),
        ]);
        res.json({ success: true, data: { companies, products, origins } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/companies/:id', verifyToken, requireRoles('gm', 'sales_manager', 'procurement_manager'), async (req, res) => {
    try {
        const { action } = req.body;
        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({ success: false, message: 'الإجراء غير صالح' });
        }
        const company = await Company.findByIdAndUpdate(req.params.id, {
            status: action === 'approve' ? 'approved' : 'rejected',
            approvedBy: req.user.id
        }, { new: true });
        if (!company) return res.status(404).json({ success: false, message: 'غير موجود' });
        res.json({ success: true, message: action === 'approve' ? 'تمت الموافقة' : 'تم الرفض', data: company });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/products/:id', verifyToken, requireRoles('gm', 'sales_manager', 'procurement_manager'), async (req, res) => {
    try {
        const { action } = req.body;
        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({ success: false, message: 'الإجراء غير صالح' });
        }
        const product = await Product.findByIdAndUpdate(req.params.id, {
            status: action === 'approve' ? 'approved' : 'rejected',
            approvedBy: req.user.id
        }, { new: true });
        if (!product) return res.status(404).json({ success: false, message: 'غير موجود' });
        res.json({ success: true, message: action === 'approve' ? 'تمت الموافقة' : 'تم الرفض', data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/origins/:id', verifyToken, requireRoles('gm', 'sales_manager', 'procurement_manager'), async (req, res) => {
    try {
        const { action } = req.body;
        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({ success: false, message: 'الإجراء غير صالح' });
        }
        const origin = await Origin.findByIdAndUpdate(req.params.id, {
            status: action === 'approve' ? 'approved' : 'rejected',
            approvedBy: req.user.id
        }, { new: true });
        if (!origin) return res.status(404).json({ success: false, message: 'غير موجود' });
        res.json({ success: true, message: action === 'approve' ? 'تمت الموافقة' : 'تم الرفض', data: origin });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/products', verifyToken, async (req, res) => {
    try {
        const products = await Product.find({ status: 'approved' }).sort('nameAr');
        res.json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/products', verifyToken, async (req, res) => {
    try {
        const { nameAr, nameEn, description } = req.body;
        if (!nameAr) return res.status(400).json({ success: false, message: 'الاسم بالعربي مطلوب' });
        const product = new Product({ nameAr, nameEn, description, status: 'pending', createdBy: req.user.id });
        await product.save();
        res.status(201).json({ success: true, message: 'تم إرسال المنتج للمراجعة', data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/origins', verifyToken, async (req, res) => {
    try {
        const origins = await Origin.find({ status: 'approved' }).sort('nameAr');
        res.json({ success: true, data: origins });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/origins', verifyToken, async (req, res) => {
    try {
        const { nameAr, nameEn } = req.body;
        if (!nameAr) return res.status(400).json({ success: false, message: 'الاسم بالعربي مطلوب' });
        const origin = new Origin({ nameAr, nameEn, status: 'pending', createdBy: req.user.id });
        await origin.save();
        res.status(201).json({ success: true, message: 'تم إرسال الأصل للمراجعة', data: origin });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
