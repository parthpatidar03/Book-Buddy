import { useState } from 'react';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import { reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ReviewCard = ({ review, onDelete, canDelete = false }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(review.likes || []);
  // Auth controller returns 'id', but raw mongo docs have '_id'. Check both.
  const userId = user?.id || user?._id;
  const isLiked = userId && likes.includes(userId);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!userId || isLiking) return;
    
    setIsLiking(true);
    try {
      // Optimistic UI update
      if (isLiked) {
        setLikes(prev => prev.filter(id => id !== userId));
      } else {
        setLikes(prev => [...prev, userId]);
      }
      // send server response later first we make heart red !
      const response = await reviewsAPI.like(review._id);
      // Sync with server response to be sure
      setLikes(response.data);
    } catch (error) {
      console.error('Error liking review:', error);
      // Revert on error (simple way: just reload or fetch again, but here we just keep optimistic state or could revert)
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#27272A] rounded-lg p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {review.user ? (
              <Link to={`/user/${review.user._id}`} className="hover:text-primary-600 hover:underline">
                {review.user.name}
              </Link>
            ) : (
              'Anonymous'
            )}
          </h4>
          <RatingStars rating={review.rating} readonly />
        </div>
        {canDelete && onDelete && (
          <button
            onClick={() => onDelete(review._id)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors"
          >
            Delete
          </button>
        )}
      </div>
      {review.reviewText && (
        <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm leading-relaxed">
          {review.reviewText}
        </p>
      )}
      
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(review.updatedAt || review.createdAt).toLocaleDateString()}
          {review.updatedAt && review.updatedAt !== review.createdAt && ' (edited)'}
        </p>
        
        <button 
          onClick={handleLike}
          disabled={!user || isLiking}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
            isLiked 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg 
            className={`w-5 h-5 ${isLiked ? 'fill-current' : 'fill-none stroke-current'}`} 
            viewBox="0 0 24 24" 
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{likes.length > 0 ? likes.length : 'Like'}</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
