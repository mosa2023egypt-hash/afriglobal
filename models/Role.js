const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    level: { type: Number, required: true },
    permissions: { type: [String], default: [] },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

roleSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;