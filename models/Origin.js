const mongoose = require('mongoose');

const originSchema = new mongoose.Schema({
    nameAr: { type: String, required: true },
    nameEn: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Origin', originSchema);
