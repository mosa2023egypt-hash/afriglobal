const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    roleLevel: { type: Number, required: true },
    roleName: { type: String, required: true },
    permissions: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
},{ timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;