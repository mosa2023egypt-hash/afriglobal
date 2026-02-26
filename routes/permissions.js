'use strict';
const express = require('express');
const router = express.Router();

let permissions = [];

router.post('/permissions', (req, res) => {
    const { name, category } = req.body;
    const newPermission = { id: permissions.length + 1, name, category };
    permissions.push(newPermission);
    res.status(201).json(newPermission);
});

router.get('/permissions', (req, res) => {
    res.json(permissions);
});

module.exports = router;
