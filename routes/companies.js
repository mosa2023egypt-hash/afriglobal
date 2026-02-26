'use strict';
const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { verifyToken, isProcurementManager, isSalesManager, isGM } = require('../middleware/auth');
const { normalizeEgyptianPhone } = require('../utils/phone');

router.get('/', verifyToken, async (req, res) => {
    try {
        const filter = { status: 'approved' };
        if (req.query.isCustomer) filter.isCustomer = true;
        if (req.query.isSupplier) filter.isSupplier = true;
        const companies = await Company.find(filter).populate('createdBy', 'fullName').sort('-createdAt');
        res.json({ success: true, data: companies });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const { nameAr, nameEn, phone, contactPerson, isCustomer, isSupplier, city, address, notes } = req.body;
        if (!nameAr) return res.status(400).json({ success: false, message: 'الاسم بالعربي مطلوب' });
        const normalized = phone ? normalizeEgyptianPhone(phone) : undefined;
        const company = new Company({
            nameAr, nameEn, phone: normalized, contactPerson,
            isCustomer: !!isCustomer, isSupplier: !!isSupplier,
            city, address, notes,
            status: 'pending',
            createdBy: req.user.id
        });
        await company.save();
        res.status(201).json({ success: true, message: 'تم إرسال الشركة للمراجعة', data: company });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const company = await Company.findById(req.params.id).populate('createdBy', 'fullName');
        if (!company) return res.status(404).json({ success: false, message: 'غير موجود' });
        res.json({ success: true, data: company });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { nameAr, nameEn, phone, contactPerson, isCustomer, isSupplier, city, address, notes } = req.body;
        const normalized = phone ? normalizeEgyptianPhone(phone) : undefined;
        const company = await Company.findByIdAndUpdate(req.params.id, {
            nameAr, nameEn, phone: normalized, contactPerson,
            isCustomer: !!isCustomer, isSupplier: !!isSupplier,
            city, address, notes
        }, { new: true });
        if (!company) return res.status(404).json({ success: false, message: 'غير موجود' });
        res.json({ success: true, data: company });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
