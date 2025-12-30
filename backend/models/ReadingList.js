import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  page: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

const readingListSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  status: { type: String, enum: ['wishlist', 'reading', 'complete'], default: 'wishlist' },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  startDate: { type: Date },
  finishDate: { type: Date },
  notes: [noteSchema],
  addedAt: { type: Date, default: Date.now }
});

readingListSchema.index({ user: 1, book: 1 }, { unique: true });

export default mongoose.model('ReadingList', readingListSchema);
