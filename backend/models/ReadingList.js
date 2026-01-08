import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  page: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

const readingListSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  status: { type: String, enum: ['wishlist', 'reading', 'complete', 'dropped'], default: 'wishlist' },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  startDate: { type: Date },
  finishDate: { type: Date },
  dropReason: { type: String },
  notes: [noteSchema], 
  addedAt: { type: Date, default: Date.now }
});

readingListSchema.index({ user: 1, book: 1 }, { unique: true });
// Performance Indexes
// Optimizes queries for a user's books filtered by status (e.g., 'currently reading')
readingListSchema.index({ user: 1, status: 1 });

// Optimizes retrieving a user's reading list sorted by the date they were added (descending)
readingListSchema.index({ user: 1, addedAt: -1 });

export default mongoose.model('ReadingList', readingListSchema);
