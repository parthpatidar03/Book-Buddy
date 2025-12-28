import RatingStars from './RatingStars';
import './ReviewCard.css';

const ReviewCard = ({ review, onDelete, canDelete = false }) => {
  return (
    <div className="review-card">
      <div className="review-header">
        <div>
          <h4 className="review-author">{review.user?.name || 'Anonymous'}</h4>
          <RatingStars rating={review.rating} readonly />
        </div>
        {canDelete && onDelete && (
          <button onClick={() => onDelete(review._id)} className="btn btn-danger btn-sm">
            Delete
          </button>
        )}
      </div>
      {review.reviewText && (
        <p className="review-text">{review.reviewText}</p>
      )}
      <p className="review-date">
        {new Date(review.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ReviewCard;
