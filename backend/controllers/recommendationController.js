import Book from '../models/Book.js';
import ReadingList from '../models/ReadingList.js';
import RecommendationCache from '../models/RecommendationCache.js';

// Helper: Get user's favorite genres based on reading history
const getFavoriteGenres = async (userId) => {
  // 1. Get everything the user has ever interacted with (Read, Reading, Wishlist)
  const readingList = await ReadingList.find({ user: userId }).populate('book');
  // 2. If they haven't read anything, we can't guess their taste. Return empty.
  if (!readingList.length) return [];
 // 3. Count how many times each genre appears
  const genreCounts = {};
  readingList.forEach(item => {
    if (item.book && item.book.genre) {
       // If genre exists, add 1 to its count. If new, start at 0 + 1.
      genreCounts[item.book.genre] = (genreCounts[item.book.genre] || 0) + 1;
    }
  });

  // 4. Sort genres by count descending
  return Object.entries(genreCounts) // Convert { "Fantasy": 5, "SciFi": 2 } to [["Fantasy", 5], ["SciFi", 2]]
    .sort(([, a], [, b]) => b - a) // Sort by count descending  
    .map(([genre]) => genre) // Extract just the genre names
    .slice(0, 3); // Top 3 genres
};

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    // --- STEP 1: CHECK CACHE ---
    // Check if we have a saved list of recommendations for this user (valid for 24h)
    const cached = await RecommendationCache.findOne({ user: userId }).populate('recommendations');
    if (cached) {
      return res.json(cached.recommendations); // Return cached list immediately (Fast Path)
    }

    // --- STEP 2: CALCULATE FRESH RECOMMENDATIONS ---
    // If no cache or expired, we need to calculate new recommendations.
    
    // A. Analyze User Taste: Find top 3 genres based on reading history
    const favoriteGenres = await getFavoriteGenres(userId);
    
    // B. Exclude Books: Get list of books user has already interacting with (Read/Reading/Wishlist)
    const userBooks = await ReadingList.find({ user: userId }).select('book');
    const excludedBookIds = userBooks.map(item => item.book);

    let recommendations = [];

    // 1. If user has favorite genres, use them to find recommendations
    if (favoriteGenres.length > 0) {
      // SCENARIO A: Content-Based Filtering
      // Find top-rated books matching user's favorite genres, excluding ones they've seen.
      recommendations = await Book.find({
        genre: { $in: favoriteGenres },
        _id: { $nin: excludedBookIds }
      })
      .sort({ averageRating: -1 }) // Prioritize highest rated
      .limit(10);                  // Limit to top 10
    } else {
        // SCENARIO B: Cold Start (New User)
      // If no history, recommend the newest books globally.
      recommendations = await Book.find({
        _id: { $nin: excludedBookIds }
      })
      .sort({ publicationYear: -1 }) // Newest first
      .limit(10);
    }

    // --- STEP 3: SAVE TO CACHE ---
    // Save this list to MongoDB so we don't have to recalculate for 24 hours.
    await RecommendationCache.findOneAndUpdate(
      { user: userId },
      { recommendations: recommendations.map(b => b._id), lastUpdated: Date.now() },
      { upsert: true, new: true }
    );

    res.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
