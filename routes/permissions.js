const express = require('express');
const router = express.Router();

let permissions = [
    { id: 1, name: 'Read', code: 'READ', category: 'General' },
    { id: 2, name: 'Write', code: 'WRITE', category: 'General' },
    { id: 3, name: 'Delete', code: 'DELETE', category: 'General' },
    { id: 4, name: 'Manage Users', code: 'MANAGE_USERS', category: 'User Management' },
    { id: 5, name: 'Manage Roles', code: 'MANAGE_ROLES', category: 'Access Control' },
    { id: 6, name: 'View Reports', code: 'VIEW_REPORTS', category: 'Reports' }
];

router.get('/', (req, res) => {
    res.json({ success: true, data: permissions, count: permissions.length });
});

router.post('/', (req, res) => {
    const { name, code, category, description } = req.body;
    if (!name || !code) {
        return res.status(400).json({ success: false, message: 'Name and code are required' });
    }
    const newPermission = { id: Math.max(...permissions.map(p => p.id), 0) + 1, name, code: code.toUpperCase(), category: category || 'General', description: description || '', isActive: true };
    permissions.push(newPermission);
    res.status(201).json({ success: true, message: 'Permission created', data: newPermission });
});

router.delete('/:id', (req, res) => {
    const index = permissions.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, message: 'Permission not found' });
    permissions.splice(index, 1);
    res.json({ success: true, message: 'Permission deleted' });
});

module.exports = router;