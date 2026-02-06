const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdminUser = require('./models/AdminUser');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB URI:', process.env.MONGO_URI ? 'URI Provided' : 'URI Missing');
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pdfsaathi');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Create default admin if not exists
    const adminExists = await AdminUser.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await AdminUser.create({
        username: 'admin',
        password_hash: hashedPassword
      });
      console.log('Default admin user created: admin/admin123');
    }

  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Server will continue running without database features.');
    // process.exit(1); 
  }
};

module.exports = connectDB;
