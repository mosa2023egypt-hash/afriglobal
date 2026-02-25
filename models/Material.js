const mongoose = require('mongoose');
const materialSchema = new mongoose.Schema({
    name: String,
    description: String,
    unit: String,
    currentMarketPrice: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Material', materialSchema);