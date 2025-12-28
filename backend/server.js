import dotenv from 'dotenv';
import connectDB from './config/db.js';
import express from 'express';
import cors from 'cors';
// Import routes
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import readingListRoutes from './routes/readingListRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import customListRoutes from './routes/customListRoutes.js';
// Import error handler middleware
import errorHandler from './middleware/errorMiddleware.js';

dotenv.config();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET is not set in .env file');
  console.error('Please create a .env file with JWT_SECRET and MONGO_URI');
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error('ERROR: MONGO_URI is not set in .env file');
  console.error('Please create a .env file with MONGO_URI');
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reading-list', readingListRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/custom-lists', customListRoutes);

app.get('/', (req, res) => {
  res.send('Book Buddy backend');
});

// Error handler (At last)
app.use(errorHandler);

const start = async () => {
  await connectDB(); // connect to MongoDB first
  app.listen(port, () => console.log(`Server running on port ${port}`));
};

start();
