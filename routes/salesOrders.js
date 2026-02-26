'use strict';
const express = require('express');
const router = express.Router();
const SalesOrder = require('../models/SalesOrder');
const { verifyToken, isSales, isProcurement, isProcurementManager, isGM, requireRoles } = require('../middleware/auth');
const { normalizeEgyptianPhone, whatsappLink } = require('../utils/phone');

router.get('/', verifyToken, async (req, res) => {
    try {
        let orders;
        const role = req.user.role;
        
        if (role === 'procurement') {
            orders = await SalesOrder.find({ status: { $ne: 'draft' } })
                .select('orderNumber deliveryCity items status submittedToProcurementAt procurementRespondedAt createdAt')
                .populate('items.product', 'nameAr nameEn')
                .populate('items.origin', 'nameAr nameEn')
                .sort('-createdAt');
        } else if (role === 'procurement_manager') {
            const fullOrders = await SalesOrder.find({ status: { $ne: 'draft' } })
                .select('orderNumber deliveryCity items status submittedToProcurementAt procurementRespondedAt createdAt customer contactPerson')
                .populate('customer', 'nameAr nameEn city')
                .populate('items.product', 'nameAr nameEn')
                .populate('items.origin', 'nameAr nameEn')
                .sort('-createdAt');
            orders = fullOrders.map(o => {
                const obj = o.toObject();
                obj.customerNote = o.customer ? `العميل: ${o.customer.nameAr}` : '';
                delete obj.customer;
                delete obj.contactPerson;
                delete obj.phone;
                return obj;
            });
        } else {
            const rawOrders = await SalesOrder.find()
                .populate('customer', 'nameAr nameEn phone city')
                .populate('items.product', 'nameAr nameEn')
                .populate('items.origin', 'nameAr nameEn')
                .populate('createdBy', 'fullName')
                .sort('-createdAt');
            orders = rawOrders.map(o => {
                const obj = o.toObject();
                if (obj.phone) obj.whatsappUrl = whatsappLink(obj.phone);
                if (obj.customer && obj.customer.phone) obj.customer.whatsappUrl = whatsappLink(obj.customer.phone);
                return obj;
            });
        }
        
        res.json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/', verifyToken, requireRoles('gm', 'sales_manager', 'sales'), async (req, res) => {
    try {
        const { customer, contactPerson, phone, deliveryCity, warehouseText, items, contactMethod, customerReply, notes, importantNotes } = req.body;
        if (!customer) return res.status(400).json({ success: false, message: 'العميل مطلوب' });
        const normalized = phone ? normalizeEgyptianPhone(phone) : undefined;
        const order = new SalesOrder({
            customer, contactPerson, phone: normalized,
            deliveryCity, warehouseText, items: items || [],
            contactMethod, customerReply, notes, importantNotes,
            status: 'draft',
            createdBy: req.user.id
        });
        await order.save();
        res.status(201).json({ success: true, message: 'تم إنشاء الطلب', data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const role = req.user.role;
        let order;
        if (role === 'procurement') {
            order = await SalesOrder.findById(req.params.id)
                .select('orderNumber deliveryCity items status submittedToProcurementAt procurementRespondedAt')
                .populate('items.product', 'nameAr nameEn')
                .populate('items.origin', 'nameAr nameEn');
        } else if (role === 'procurement_manager') {
            order = await SalesOrder.findById(req.params.id)
                .select('orderNumber deliveryCity items status submittedToProcurementAt procurementRespondedAt customer contactPerson')
                .populate('customer', 'nameAr nameEn')
                .populate('items.product', 'nameAr nameEn')
                .populate('items.origin', 'nameAr nameEn');
            if (order) {
                const obj = order.toObject();
                if (obj.customer) obj.customerNote = `العميل: ${obj.customer.nameAr}`;
                delete obj.customer;
                delete obj.contactPerson;
                return res.json({ success: true, data: obj });
            }
        } else {
            order = await SalesOrder.findById(req.params.id)
                .populate('customer', 'nameAr nameEn phone city')
                .populate('items.product', 'nameAr nameEn')
                .populate('items.origin', 'nameAr nameEn')
                .populate('createdBy', 'fullName');
            if (order) {
                const obj = order.toObject();
                if (obj.phone) obj.whatsappUrl = whatsappLink(obj.phone);
                if (obj.customer && obj.customer.phone) obj.customer.whatsappUrl = whatsappLink(obj.customer.phone);
                return res.json({ success: true, data: obj });
            }
        }
        if (!order) return res.status(404).json({ success: false, message: 'غير موجود' });
        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/:id/submit-to-procurement', verifyToken, requireRoles('gm', 'sales_manager', 'sales'), async (req, res) => {
    try {
        const order = await SalesOrder.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'غير موجود' });
        if (order.status !== 'draft') {
            return res.status(400).json({ success: false, message: 'الطلب تم إرساله مسبقاً' });
        }
        order.status = 'submitted_to_procurement';
        order.submittedToProcurementAt = new Date();
        await order.save();
        res.json({ success: true, message: 'تم إرسال الطلب للمشتريات', data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/:id/procurement-responded', verifyToken, requireRoles('gm', 'procurement_manager', 'procurement'), async (req, res) => {
    try {
        const order = await SalesOrder.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'غير موجود' });
        order.status = 'procurement_responded';
        order.procurementRespondedAt = new Date();
        await order.save();
        res.json({ success: true, message: 'تم تسجيل رد المشتريات', data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
