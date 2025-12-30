import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviewsAPI } from '../services/api';
import RatingStars from '../components/RatingStars';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getUserReviews();
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Delete this review?')) {
      try {
        await reviewsAPI.delete(reviewId);
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Reviews</h1>
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">You haven't reviewed any books yet.</p>
          <Link to="/explore" className="btn btn-primary">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
              <div className="flex-1 mb-4">
                {review.book && review.book._id ? (
                  <Link to={`/book/${review.book._id}`} className="block group mb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {review.book.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">by {review.book.author}</p>
                  </Link>
                ) : (
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-500 italic">Book removed</h3>
                  </div>
                )}
                <div className="mb-3">
                  <RatingStars rating={review.rating} readonly />
                </div>
                {review.reviewText && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-4">
                    {review.reviewText}
                  </p>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(review.updatedAt || review.createdAt).toLocaleDateString()}
                  {review.updatedAt && review.updatedAt !== review.createdAt && ' (edited)'}
                </span>
                <button
                
                  onClick={() => handleDelete(review._id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors"
                >
                  Delete Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
