const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    manager: {
        type: String,
        required: true
    },
    staff: {
        type: [String], // Array of staff member IDs
        required: true
    }
});

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;