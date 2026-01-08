# Recommendation System Architecture

This document details the implementation of the recommendation system in Book Buddy, specifically focusing on the caching strategy used to optimize performance and ensure relevant content delivery.

## 1. Overview: The "Cache-First" Strategy

Calculating recommendations can be resource-intensive. It involves:
1.  Fetching a user's entire reading history.
2.  Aggregating and counting genres to determine "taste".
3.  Querying the entire book database for matches.
4.  Filtering out books the user has already seen.
5.  Sorting by rating or date.

To avoid running this heavy logic on every page load, we use a **Cache-First Strategy**. We calculate the result once, store it, and reuse it for 24 hours.

## 2. Database Schema (The "Memory")

We use a dedicated MongoDB collection `RecommendationCache` to store the pre-calculated lists.

**File:** `backend/models/RecommendationCache.js`

```javascript
const recommendationCacheSchema = new mongoose.Schema({
  // Link to the specific user
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  // The list of recommended Book IDs
  recommendations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  
  // TTL (Time-To-Live) Index
  // MongoDB automatically deletes this document 24 hours (86400 seconds) after this time.
  lastUpdated: { type: Date, default: Date.now, expires: 86400 } 
});
```

### Key Feature: TTL Index
The `expires: 86400` option is critical. It offloads "cache invalidation" to the database engine. We don't need a cron job to clean up old data; MongoDB does it automatically.

## 3. Logic Flow (The "Brain")

The logic is encapsulated in `backend/controllers/recommendationController.js`.

### Step A: Check Cache (Fast Path)
When a request comes in, we first check if a valid cache entry exists.

```javascript
const cached = await RecommendationCache.findOne({ user: userId }).populate('recommendations');
if (cached) {
  return res.json(cached.recommendations); // <--- RETURN IMMEDIATELY
}
```

### Step B: Calculate Fresh Recommendations (Slow Path)
If the cache is missing (first visit) or expired (deleted by TTL), we calculate fresh data.

#### 1. Analyze User Taste
We look at the user's `ReadingList` to identify their top 3 genres.

```javascript
const getFavoriteGenres = async (userId) => {
  const readingList = await ReadingList.find({ user: userId }).populate('book');
  // ... count genres ...
  // Returns e.g., ["Fantasy", "Sci-Fi", "Mystery"]
};
```

#### 2. Select Strategy
*   **Scenario A (Active User):** If they have favorite genres, we find top-rated books in those genres, excluding books they have already interacted with.
*   **Scenario B (Cold Start):** If they are a new user (no history), we recommend the newest books globally.

```javascript
if (favoriteGenres.length > 0) {
  // Content-Based Filtering
  recommendations = await Book.find({
    genre: { $in: favoriteGenres },
    _id: { $nin: excludedBookIds } // Exclude read books
  }).sort({ averageRating: -1 });
} else {
  // Cold Start
  recommendations = await Book.find({
    _id: { $nin: excludedBookIds }
  }).sort({ publicationYear: -1 });
}
```

### Step C: Save to Cache
Before sending the response, we save the result to MongoDB so the *next* request uses the Fast Path.

```javascript
await RecommendationCache.findOneAndUpdate(
  { user: userId },
  { recommendations: recommendations.map(b => b._id), lastUpdated: Date.now() },
  { upsert: true, new: true }
);
```

## 4. Summary of Benefits

| Feature | Benefit |
| :--- | :--- |
| **Performance** | Heavy calculations happen only once per day per user. Dashboard loads instantly. |
| **Self-Cleaning** | No stale data accumulates. The database cleans itself automatically. |
| **Resilience** | If the cache fails, the system transparently falls back to calculating fresh data. |
| **Personalization** | Recommendations evolve as the user reads more books (updated every 24h). |
