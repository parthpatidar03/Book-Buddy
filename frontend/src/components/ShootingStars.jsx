import React from 'react';

const ShootingStars = () => {
  // Create an array of 4 stars (max visible at once)
  const stars = Array.from({ length: 3 });

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden hidden dark:block">
      {stars.map((_, index) => {
        const top = Math.floor(Math.random() * 50) + '%'; // Top half of screen
        const left = Math.floor(Math.random() * 100) + '%';
        const delay = Math.random() * 10 + 's'; // Spread start times
        const duration = Math.random() * 10 + 15 + 's'; // Ultra slow (15-25s)

        return (
          <span
            key={index}
            className="shooting-star"
            style={{
              top,
              left,
              animationDelay: delay,
              animationDuration: duration,
            }}
          />
        );
      })}
    </div>
  );
};

export default ShootingStars;
