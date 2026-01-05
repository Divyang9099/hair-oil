const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://divyang:divyanggujarati@cluster0.ykivylh.mongodb.net/?retryWrites=true&w=majority');
        console.log(`Connected to MongoDB Host: ${conn.connection.host}`);
        console.log(`Connected to Database: ${conn.connection.name}`);
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
