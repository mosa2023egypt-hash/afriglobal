const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    role: { type: String, enum: ['admin', 'sales_manager', 'purchasing_manager', 'operations_manager', 'warehouse_manager', 'accountant', 'sales_staff'], default: 'sales_staff' },
    department: String,
    phone: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);