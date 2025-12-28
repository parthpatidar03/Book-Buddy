import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { booksAPI, readingListAPI, reviewsAPI } from '../services/api';
import RatingStars from '../components/RatingStars';
import ReviewCard from '../components/ReviewCard';
import StatusSelector from '../components/StatusSelector';
import './BookDetails.css';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [readingStatus, setReadingStatus] = useState(null);
  const [readingListId, setReadingListId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookDetails();
    fetchReviews();
    if (user) {
      checkReadingList();
    }
  }, [id, user]);

  const fetchBookDetails = async () => {
    try {
      const response = await booksAPI.getById(id);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getByBook(id);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkReadingList = async () => {
    try {
      const response = await readingListAPI.getAll();
      const item = response.data.find((item) => item.book._id === id);
      if (item) {
        setReadingStatus(item.status);
        setReadingListId(item._id);
      }
    } catch (error) {
      console.error('Error checking reading list:', error);
    }
  };

  const handleAddToReadingList = async (status) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (readingListId) {
        await readingListAPI.update(readingListId, { status });
      } else {
        const response = await readingListAPI.add({ book: id, status });
        setReadingListId(response.data._id);
      }
      setReadingStatus(status);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update reading list');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!rating) {
      setError('Please select a rating');
      return;
    }

    try {
      await reviewsAPI.createOrUpdate({ book: id, rating, reviewText });
      setRating(0);
      setReviewText('');
      setError('');
      fetchReviews();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!book) {
    return <div className="container">Book not found</div>;
  }

  return (
    <div className="container">
      <div className="book-details">
        <div className="book-info">
          <h1>{book.title}</h1>
          <p className="book-author">by {book.author}</p>
          <div className="book-meta">
            <span className="genre-badge">{book.genre}</span>
            {book.publicationYear && <span>Published: {book.publicationYear}</span>}
          </div>
          <p className="book-description">{book.description}</p>

          {user && (
            <div className="book-actions">
              <div className="reading-status">
                <label>Reading Status:</label>
                <StatusSelector
                  value={readingStatus || 'wishlist'}
                  onChange={(status) => handleAddToReadingList(status)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="reviews-section">
          <h2>Reviews</h2>
          {user && (
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="form-group">
                <label>Your Rating:</label>
                <RatingStars rating={rating} onRate={setRating} />
              </div>
              <div className="form-group">
                <label>Your Review:</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows="4"
                  placeholder="Write your review..."
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="btn btn-primary">
                Submit Review
              </button>
            </form>
          )}

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p>No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  canDelete={user && review.user?._id === user.id}
                  onDelete={async (reviewId) => {
                    await reviewsAPI.delete(reviewId);
                    fetchReviews();
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
