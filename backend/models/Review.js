import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  reviewText: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
// Ensure that each user can only review a specific book once
reviewSchema.index({ user: 1, book: 1 }, { unique: true });
// Performance Indexes
reviewSchema.index({ book: 1 }); // Get all reviews for a book
reviewSchema.index({ book: 1, createdAt: -1 }); // Get recent reviews for a book

export default mongoose.model('Review', reviewSchema);

