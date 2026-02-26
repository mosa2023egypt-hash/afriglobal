const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/afriglobal';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const User = require('../models/User');
        
        const existingGM = await User.findOne({ role: 'gm' });
        if (!existingGM) {
            const password = await bcrypt.hash('Admin@123', 10);
            const gm = new User({
                username: 'admin',
                email: 'admin@afriglobal.com',
                password,
                fullName: 'مدير النظام',
                role: 'gm',
                isActive: true
            });
            await gm.save();
            console.log('Created GM user: admin / Admin@123');
        } else {
            console.log('GM user already exists');
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seed();
