'use strict';

const express = require('express');
const router = express.Router();

// Mock data
let permissions = [];

// Create a new permission
router.post('/permissions', (req, res) => {
  const { name, category } = req.body;
  const newPermission = { id: permissions.length + 1, name, category };
  permissions.push(newPermission);
  res.status(201).json(newPermission);
});

// Read all permissions
router.get('/permissions', (req, res) => {
  res.json(permissions);
});

// Read permissions by category
router.get('/permissions/category/:category', (req, res) => {
  const { category } = req.params;
  const filteredPermissions = permissions.filter(p => p.category === category);
  res.json(filteredPermissions);
});

// Update a permission
router.put('/permissions/:id', (req, res) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const permission = permissions.find(p => p.id === parseInt(id));

  if (!permission) {
    return res.status(404).json({ message: 'Permission not found' });
  }

  permission.name = name || permission.name;
  permission.category = category || permission.category;
  res.json(permission);
});

// Delete a permission
router.delete('/permissions/:id', (req, res) => {
  const { id } = req.params;
  permissions = permissions.filter(p => p.id !== parseInt(id));
  res.status(204).send();
});

module.exports = router;