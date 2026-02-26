'use strict';
const express = require('express');
const router = express.Router();
const SalesOrder = require('../models/SalesOrder');
const SupplierQuote = require('../models/SupplierQuote');
const { verifyToken, requireRoles } = require('../middleware/auth');

router.get('/kpi', verifyToken, requireRoles('gm', 'sales_manager', 'procurement_manager'), async (req, res) => {
    try {
        const stuckThresholdHours = parseInt(req.query.stuckHours) || 48;
        const stuckThreshold = stuckThresholdHours * 60 * 60 * 1000;
        const now = Date.now();

        const respondedQuotes = await SupplierQuote.find({
            status: { $in: ['responded', 'accepted', 'rejected'] },
            requestedAt: { $exists: true },
            respondedAt: { $exists: true }
        });
        
        const quoteTimes = respondedQuotes.map(q => q.respondedAt - q.requestedAt).filter(t => t > 0);
        const avgQuoteResponseMs = quoteTimes.length ? quoteTimes.reduce((a, b) => a + b, 0) / quoteTimes.length : 0;
        
        const sorted = [...quoteTimes].sort((a, b) => a - b);
        const medianQuoteResponseMs = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;

        const submittedOrders = await SalesOrder.find({
            submittedToProcurementAt: { $exists: true, $ne: null },
            procurementRespondedAt: { $exists: true, $ne: null }
        });
        
        const stageTimes = submittedOrders.map(o => o.procurementRespondedAt - o.submittedToProcurementAt).filter(t => t > 0);
        const avgStageMs = stageTimes.length ? stageTimes.reduce((a, b) => a + b, 0) / stageTimes.length : 0;

        const stuckOrders = await SalesOrder.find({
            status: 'submitted_to_procurement',
            submittedToProcurementAt: { $lte: new Date(now - stuckThreshold) }
        }).select('orderNumber submittedToProcurementAt deliveryCity').lean();

        const pendingQuotes = await SupplierQuote.find({ status: 'requested' })
            .populate('salesOrder', 'orderNumber')
            .populate('supplier', 'nameAr')
            .select('requestedAt salesOrder supplier productNameAr qtyTons')
            .lean();

        stuckOrders.forEach(o => {
            o.elapsedHours = Math.round((now - new Date(o.submittedToProcurementAt).getTime()) / 3600000);
        });
        pendingQuotes.forEach(q => {
            q.elapsedHours = Math.round((now - new Date(q.requestedAt).getTime()) / 3600000);
        });

        const orderCounts = await SalesOrder.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            data: {
                supplierQuote: {
                    totalResponded: quoteTimes.length,
                    avgResponseHours: +(avgQuoteResponseMs / 3600000).toFixed(1),
                    medianResponseHours: +(medianQuoteResponseMs / 3600000).toFixed(1),
                },
                salesProcurementStage: {
                    totalCompleted: stageTimes.length,
                    avgResponseHours: +(avgStageMs / 3600000).toFixed(1),
                },
                stuckOrders,
                pendingQuotes,
                orderStatusCounts: orderCounts,
                stuckThresholdHours,
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// TODO: Implement actual statistics aggregation from SalesOrder/SupplierQuote/User collections
router.get('/statistics', verifyToken, (req, res) => {
    res.json({ success: true, data: { totalUsers: 0, totalSales: 0, totalRevenue: 0 } });
});

module.exports = router;
