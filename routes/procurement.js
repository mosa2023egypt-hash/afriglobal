'use strict';
const express = require('express');
const router = express.Router();
const SupplierQuote = require('../models/SupplierQuote');
const { verifyToken, isProcurement, isProcurementManager, isGM } = require('../middleware/auth');
const { normalizeEgyptianPhone, whatsappLink } = require('../utils/phone');

router.get('/quotes', verifyToken, isProcurement, async (req, res) => {
    try {
        const filter = {};
        if (req.query.salesOrder) filter.salesOrder = req.query.salesOrder;
        const quotes = await SupplierQuote.find(filter)
            .populate('salesOrder', 'orderNumber deliveryCity status')
            .populate('supplier', 'nameAr nameEn phone contactPerson')
            .populate('product', 'nameAr nameEn')
            .populate('origin', 'nameAr nameEn')
            .populate('requestedBy', 'fullName')
            .sort('-requestedAt');
        
        const data = quotes.map(q => {
            const obj = q.toObject();
            const phone = obj.supplierPhone || (obj.supplier && obj.supplier.phone);
            if (phone) obj.whatsappUrl = whatsappLink(phone);
            return obj;
        });
        
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/quotes', verifyToken, isProcurement, async (req, res) => {
    try {
        const { salesOrder, supplier, product, productNameAr, origin, originNameAr, qtyTons, notes, requestedAt, supplierPhone, supplierContactPerson } = req.body;
        if (!salesOrder || !supplier) {
            return res.status(400).json({ success: false, message: 'طلب المبيعات والمورد مطلوبان' });
        }
        const normalized = supplierPhone ? normalizeEgyptianPhone(supplierPhone) : undefined;
        const quote = new SupplierQuote({
            salesOrder, supplier, product, productNameAr, origin, originNameAr, qtyTons, notes,
            requestedAt: requestedAt ? new Date(requestedAt) : new Date(),
            supplierPhone: normalized,
            supplierContactPerson,
            requestedBy: req.user.id,
            status: 'requested'
        });
        await quote.save();
        res.status(201).json({ success: true, message: 'تم إرسال طلب عرض السعر', data: quote });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put('/quotes/:id', verifyToken, isProcurement, async (req, res) => {
    try {
        const { pricePerTon, notes, respondedAt, status } = req.body;
        const update = {};
        if (pricePerTon !== undefined) update.pricePerTon = pricePerTon;
        if (notes !== undefined) update.notes = notes;
        if (respondedAt) update.respondedAt = new Date(respondedAt);
        if (status) update.status = status;
        if (pricePerTon && !update.respondedAt) update.respondedAt = new Date();
        if (pricePerTon && !update.status) update.status = 'responded';
        
        const quote = await SupplierQuote.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!quote) return res.status(404).json({ success: false, message: 'غير موجود' });
        res.json({ success: true, message: 'تم تحديث عرض السعر', data: quote });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
