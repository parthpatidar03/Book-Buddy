import mongoose from 'mongoose';

const customListSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true ,unique: true},
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('CustomList', customListSchema);

