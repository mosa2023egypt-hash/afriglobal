const mongoose = require('mongoose');

const supplierQuoteSchema = new mongoose.Schema({
    salesOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'SalesOrder', required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productNameAr: { type: String },
    origin: { type: mongoose.Schema.Types.ObjectId, ref: 'Origin' },
    originNameAr: { type: String },
    qtyTons: { type: Number },
    pricePerTon: { type: Number },
    notes: { type: String },
    status: { type: String, enum: ['requested', 'responded', 'accepted', 'rejected'], default: 'requested' },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    requestedAt: { type: Date, default: Date.now },
    respondedAt: { type: Date },
    supplierPhone: { type: String },
    supplierContactPerson: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('SupplierQuote', supplierQuoteSchema);
