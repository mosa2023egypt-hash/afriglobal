const mongoose = require('mongoose');
const supplierSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    materials: [{ materialId: mongoose.Schema.Types.ObjectId, materialName: String, currentPrice: Number, marketPrice: Number }],
    bankAccount: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Supplier', supplierSchema);