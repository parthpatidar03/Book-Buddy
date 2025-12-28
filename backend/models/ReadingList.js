import mongoose from 'mongoose';

const readingListSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  status: { type: String, enum: ['wishlist', 'reading', 'complete'], default: 'wishlist' },
  addedAt: { type: Date, default: Date.now }
});

readingListSchema.index({ user: 1, book: 1 }, { unique: true });

export default mongoose.model('ReadingList', readingListSchema);

