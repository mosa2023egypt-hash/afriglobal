const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    nameAr: { type: String, required: true },
    nameEn: { type: String },
    phone: { type: String },
    contactPerson: { type: String },
    isCustomer: { type: Boolean, default: false },
    isSupplier: { type: Boolean, default: false },
    city: { type: String },
    address: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
