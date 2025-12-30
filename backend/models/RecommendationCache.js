import mongoose from 'mongoose';

const recommendationCacheSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  recommendations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  lastUpdated: { type: Date, default: Date.now, expires: 86400 } // TTL 24 hours
});

export default mongoose.model('RecommendationCache', recommendationCacheSchema);
