// Dashboard Statistics API Endpoints

const express = require('express');
const router = express.Router();

// Endpoint to get dashboard statistics
router.get('/statistics', (req, res) => {
    // Mock data for demonstration purposes
    const statistics = {
        totalUsers: 100,
        totalSales: 200,
        totalRevenue: 1500,
    };
    res.json(statistics);
});

module.exports = router;
