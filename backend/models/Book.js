import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  author: { type: String, required: true, index: true },
  genre: { type: String, required: true, index: true },
  description: { type: String, required: true },
  publicationYear: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Book', bookSchema);

