import ReadingList from '../models/ReadingList.js';
import Review from '../models/Review.js';
import mongoose from 'mongoose';

// GET /api/analytics (protected)
export const getAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // 1. Books Read per Month (Last 12 months)
    // We use the aggregation pipeline to group completed books by their finish date.
    const booksPerMonth = await ReadingList.aggregate([
      {
        $match: {
          user: userId,
          status: 'complete',
          finishDate: { $exists: true, $ne: null } // Only include books with a valid finish date
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$finishDate" },   // Extract year from finishDate
            month: { $month: "$finishDate" }  // Extract month (1-12) from finishDate
          },
          count: { $sum: 1 } // Count number of books in this group
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } } // Sort chronologically
    ]);

    // 2. Genre Distribution
    // Since 'genre' is in the Book model, we need to join (lookup) with the books collection.
    const genreDistribution = await ReadingList.aggregate([
      {
        $match: {
          user: userId,
          status: 'complete'
        }
      },
      {
        $lookup: {
          from: 'books',          // The collection to join with
          localField: 'book',     // The field in ReadingList
          foreignField: '_id',    // The field in Books
          as: 'bookData'          // The output array field name
        }
      },
      { $unwind: '$bookData' }, // Deconstruct the array to process each book individually
      {
        $group: {
          _id: '$bookData.genre', // Group by the genre from the joined book data
          count: { $sum: 1 }      // Count books per genre
        }
      }
    ]);

    // 3. Average Rating
    // Calculate the average rating from the user's reviews.
    const ratingStats = await Review.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null, // Group all documents together
          averageRating: { $avg: "$rating" }, // Calculate average of 'rating' field
          totalReviews: { $sum: 1 }           // Count total reviews
        }
      }
    ]);

    // 4. Total Books Read
    const totalRead = await ReadingList.countDocuments({
      user: userId,
      status: 'complete'
    });

    // 5. Reading Behavior Stats
    const behaviorStats = await ReadingList.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalStarted: {
            $sum: {
              $cond: [{ $in: ["$status", ["reading", "complete", "dropped"]] }, 1, 0]
            }
          },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "complete"] }, 1, 0] }
          },
          dropped: {
            $sum: { $cond: [{ $eq: ["$status", "dropped"] }, 1, 0] }
          },
          totalDuration: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$status", "complete"] }, { $ne: ["$startDate", null] }, { $ne: ["$finishDate", null] }] },
                { $subtract: ["$finishDate", "$startDate"] },
                0
              ]
            }
          },
          durationCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$status", "complete"] }, { $ne: ["$startDate", null] }, { $ne: ["$finishDate", null] }] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const stats = behaviorStats[0] || { totalStarted: 0, completed: 0, dropped: 0, totalDuration: 0, durationCount: 0 };
    
    // Calculate rates
    const completionRate = stats.totalStarted ? Math.round((stats.completed / stats.totalStarted) * 100) : 0;
    const dropOffRate = stats.totalStarted ? Math.round((stats.dropped / stats.totalStarted) * 100) : 0;
    
    // Calculate average days (convert ms to days)
    const msPerDay = 1000 * 60 * 60 * 24;
    const avgDaysToFinish = stats.durationCount ? Math.round((stats.totalDuration / stats.durationCount) / msPerDay) : 0;

    res.json({
      booksPerMonth: formatBooksPerMonth(booksPerMonth),
      genreDistribution: genreDistribution.map(g => ({ name: g._id, value: g.count })),
      averageRating: ratingStats[0]?.averageRating || 0,
      totalReviews: ratingStats[0]?.totalReviews || 0,
      totalRead,
      avgDaysToFinish,
      completionRate,
      dropOffRate
    });

  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
};

// Helper to format month data for charts (ensure all months are present or just return sorted)
const formatBooksPerMonth = (data) => {
  // For simplicity, just mapping to readable format. 
  // Ideally, we'd fill in missing months with 0.
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return data.map(item => ({
    name: `${months[item._id.month - 1]} ${item._id.year}`,
    count: item.count
  }));
};
