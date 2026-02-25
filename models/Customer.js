const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { street: String, city: String, state: String, postalCode: String, country: String },
    companyName: String,
    registrationNumber: String,
    creditLimit: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);