import dotenv from 'dotenv';
import connectDB from './config/db.js';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import readingListRoutes from './routes/readingListRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import customListRoutes from './routes/customListRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';
// Import error handler middleware
import errorHandler from './middleware/errorMiddleware.js';
import passport from './config/passport.js'; // Import passport config

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

const clientOrigin = process.env.CLIENT_ORIGIN || '*';
app.use(cors({
  origin: clientOrigin === '*' ? '*' : [clientOrigin, 'http://localhost:5173', 'http://localhost:5174']
}));
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reading-list', readingListRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/custom-lists', customListRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/summary', summaryRoutes);

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