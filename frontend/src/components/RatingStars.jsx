import { useState } from 'react';

const RatingStars = ({ rating, onRate, readonly = false }) => {
  const [hovered, setHovered] = useState(0);

  const handleClick = (value) => {
    if (!readonly && onRate) {
      onRate(value);
    }
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-2xl transition-colors duration-200 ${
            readonly ? 'cursor-default' : 'cursor-pointer'
          } ${
            star <= (hovered || rating)
              ? 'text-yellow-400'
              : 'text-gray-300 dark:text-gray-600'
          }`}
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
