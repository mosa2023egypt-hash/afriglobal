const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
    level: { type: Number, enum: [1, 2, 3], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Role', roleSchema);
