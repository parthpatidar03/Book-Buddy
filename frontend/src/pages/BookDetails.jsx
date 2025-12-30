import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { booksAPI, readingListAPI, reviewsAPI } from '../services/api';
import RatingStars from '../components/RatingStars';
import ReviewCard from '../components/ReviewCard';
import StatusSelector from '../components/StatusSelector';
import ReadingProgress from '../components/ReadingProgress';
import NotesSection from '../components/NotesSection';

import defaultCover from '../lib/book title.jpg';

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
  const [readingProgress, setReadingProgress] = useState(0);
  const [notes, setNotes] = useState([]);
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
      const item = response.data.find((item) => item.book && item.book._id === id);
      if (item) {
        setReadingStatus(item.status);
        setReadingListId(item._id);
        setReadingProgress(item.progress || 0);
        setNotes(item.notes || []);
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

  const handleProgressUpdate = async (progress) => {
    if (!readingListId) return;
    try {
      await readingListAPI.updateProgress(readingListId, progress);
      setReadingProgress(progress);
      if (progress === 100 && readingStatus !== 'complete') {
        setReadingStatus('complete');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleAddNote = async (note) => {
    if (!readingListId) return;
    try {
      await readingListAPI.addNote(readingListId, note);
      checkReadingList(); 
    } catch (error) {
      console.error('Error adding note:', error);
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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">
        Book not found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover Image */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md">
                <img 
                  src={defaultCover} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Book Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                by {book.author}
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                  {book.genre}
                </span>
                {book.publicationYear && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    Published: {book.publicationYear}
                  </span>
                )}
              </div>

              <div className="prose dark:prose-invert max-w-none mb-8">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {user && (
                <>
                  <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <label className="font-medium text-gray-700 dark:text-gray-300">
                      Reading Status:
                    </label>
                    <StatusSelector
                      value={readingStatus || 'wishlist'}
                      onChange={(status) => handleAddToReadingList(status)}
                    />
                  </div>

                  {readingStatus === 'reading' && (
                    <ReadingProgress
                      bookId={book._id}
                      initialProgress={readingProgress}
                      onProgressUpdate={handleProgressUpdate}
                    />
                  )}

                  {(readingStatus === 'reading' || readingStatus === 'complete') && (
                    <NotesSection
                      notes={notes}
                      onAddNote={handleAddNote}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Reviews
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Review Form */}
            {user && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-fit">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Write a Review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Rating
                    </label>
                    <RatingStars rating={rating} onRate={setRating} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Review
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows="4"
                      className="input resize-none"
                      placeholder="Share your thoughts..."
                    />
                  </div>
                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
                      {error}
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary w-full">
                    Submit Review
                  </button>
                </form>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  No reviews yet. Be the first to review!
                </p>
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
    </div>
  );
};

export default BookDetails;
