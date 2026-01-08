import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  readingGoal: { type: Number, default: 0 },
  readingGoalType: { type: String, enum: ['yearly', 'monthly'], default: 'yearly' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
// Notes:
// Self-referencing arrays for followers and following  
