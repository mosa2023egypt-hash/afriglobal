const mongoose = require('mongoose');
const permissionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    module: { type: String, required: true },
    actions: [String],
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Permission', permissionSchema);
