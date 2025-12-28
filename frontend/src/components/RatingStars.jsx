import { useState } from 'react';
import './RatingStars.css';

const RatingStars = ({ rating, onRate, readonly = false }) => {
  const [hovered, setHovered] = useState(0);

  const handleClick = (value) => {
    if (!readonly && onRate) {
      onRate(value);
    }
  };

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hovered || rating) ? 'filled' : ''} ${readonly ? 'readonly' : 'clickable'}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingStars;
