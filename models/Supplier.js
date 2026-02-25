const mongoose = require('mongoose');
const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { street: String, city: String, state: String, postalCode: String, country: String },
    companyName: String,
    taxId: String,
    paymentTerms: String,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Supplier', supplierSchema);