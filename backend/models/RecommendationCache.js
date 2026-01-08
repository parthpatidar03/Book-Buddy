import mongoose from 'mongoose';

const recommendationCacheSchema = new mongoose.Schema({
  // Link to the specific user
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  // The list of recommended Book IDs
  recommendations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  
  // TTL (Time-To-Live) Index
  // MongoDB automatically deletes this document 24 hours (86400 seconds) after this time.
  lastUpdated: { type: Date, default: Date.now, expires: 86400 } 
});

export default mongoose.model('RecommendationCache', recommendationCacheSchema);
