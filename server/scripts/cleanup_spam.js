const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const cleanup = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pdfsaathi';
        console.log(`Debug: Using Mongo URI: ${mongoUri}`);
        console.log(`Connecting to database...`);

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Verify connection with a count before deletion
        // Targets: @potus.com bots, Security Testers, Load Testers, and mass-numeric emails
        const query = {
            $or: [
                { email: { $regex: /@potus\.com$/i } },
                { name: 'Security Tester' },
                { name: 'Load Tester' },
                { email: { $regex: /^0000/ } }
            ]
        };

        const spamCount = await User.countDocuments(query);
        console.log(`Found ${spamCount} junk users (Bots, Load Testers, etc.)`);

        if (spamCount > 0) {
            const result = await User.deleteMany(query);
            console.log(`Successfully deleted ${result.deletedCount} junk users.`);
        } else {
            console.log('No spam users found matching the criteria.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Cleanup failed with error object:', error);
        console.error('Error message:', error.message);
        process.exit(1);
    }
};

cleanup();
