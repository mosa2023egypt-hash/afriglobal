const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    materials: [{ materialId: mongoose.Schema.Types.ObjectId, materialName: String }],
    paymentTerms: { type: String, enum: ['bank_transfer', 'cash_on_delivery', 'credit'], default: 'cash_on_delivery' },
    creditDays: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);