const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['admin', 'sales_manager', 'sales_staff', 'purchasing_manager', 'purchasing_staff', 'operations_manager', 'operations_staff', 'warehouse_manager', 'warehouse_staff', 'accountant'], required: true },
    department: { type: String, enum: ['sales', 'purchasing', 'operations', 'warehouse', 'accounting'], },
    warehouse_location: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);