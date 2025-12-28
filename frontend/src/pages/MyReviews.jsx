import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviewsAPI } from '../services/api';
import RatingStars from '../components/RatingStars';
import './MyReviews.css';

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
    return <div className="loading">Loading your reviews...</div>;
  }

  return (
    <div className="container">
      <h1>My Reviews</h1>
      {reviews.length === 0 ? (
        <div className="empty-state">
          <p>You haven't reviewed any books yet.</p>
          <Link to="/" className="btn btn-primary">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="reviews-container">
          {reviews.map((review) => (
            <div key={review._id} className="my-review-card">
              <Link to={`/book/${review.book._id}`} className="review-book-link">
                <h3>{review.book.title}</h3>
                <p>by {review.book.author}</p>
              </Link>
              <div className="review-content">
                <RatingStars rating={review.rating} readonly />
                {review.reviewText && (
                  <p className="review-text">{review.reviewText}</p>
                )}
                <p className="review-date">
                  Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(review._id)}
                className="btn btn-danger btn-sm"
              >
                Delete Review
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
