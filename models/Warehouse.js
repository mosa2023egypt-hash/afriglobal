const mongoose = require('mongoose');
const warehouseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { street: String, city: String, state: String, country: String },
    capacity: { type: Number, required: true },
    currentStock: { type: Number, default: 0 },
    manager: String,
    phone: String,
    email: String,
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Warehouse', warehouseSchema);