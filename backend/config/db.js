import mongoose from 'mongoose';

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.warn('MONGO_URI not set — skipping MongoDB connection (dev fallback)');
        return;
    }
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Successfully connected to MongoDB: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Do not exit here to allow frontend development even when DB is unavailable
    }
};

export default connectDB;


//exit(0): For success (rare in servers, more for one-time scripts).
//exit(1): For fatal errors (like DB failures, missing config).
// exit() == Kill Switch
// The process.exit(1) line ensures that if the connection to MongoDB fails,
// the application will not continue running in an unstable state.
// The non-zero exit code (1) indicates that the process ended due to an error,
// providing a clear
//way to stop the entire application (the Node.js process) immediately.
