const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, unique: true },
    category: String,
    price: Number,
    cost: Number,
    description: String,
    stock: Number,
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);