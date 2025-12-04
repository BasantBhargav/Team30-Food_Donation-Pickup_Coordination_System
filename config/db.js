const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ MongoDB Connection Error: ${err.message}`);
        console.log('\n📋 MongoDB Setup Instructions:');
        console.log('================================');
        console.log('Option 1: Local MongoDB');
        console.log('  1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community');
        console.log('  2. Install and start MongoDB service');
        console.log('  3. The default connection string in .env should work');
        console.log('\nOption 2: MongoDB Atlas (Cloud - Free)');
        console.log('  1. Go to https://www.mongodb.com/cloud/atlas');
        console.log('  2. Create a free account and cluster');
        console.log('  3. Get your connection string');
        console.log('  4. Update MONGO_URI in server/.env file');
        console.log('================================\n');
        process.exit(1);
    }
};

module.exports = connectDB;
