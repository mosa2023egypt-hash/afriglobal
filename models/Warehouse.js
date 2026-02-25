const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

warehouseSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;