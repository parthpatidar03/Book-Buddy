import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  author: { type: String, required: true, index: true },
  genre: { type: String, required: true, index: true },
  description: { type: String, required: true },
  publicationYear: { type: Number },
  coverImage: { type: String },
  // External API Support
  externalId: { type: String, unique: true, sparse: true }, // Store Gutenberg ID here
  source: { type: String, default: 'local' }, // 'local' or 'gutendex'
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
// a compound text index for fast, relevant full-text searches.
// We give higher weight to `title`, then `author`, then `description`.
bookSchema.index({ title: 'text', author: 'text', description: 'text' }, { weights: { title: 5, author: 3, description: 1 } });

export default mongoose.model('Book', bookSchema);

