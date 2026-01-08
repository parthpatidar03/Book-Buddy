import { useState, useEffect } from 'react';
import { shootFireworks } from '../utils/confetti';

const ReadingProgress = ({ bookId, initialProgress, onProgressUpdate }) => {
  const [progress, setProgress] = useState(initialProgress || 0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setProgress(initialProgress || 0);
  }, [initialProgress]);

  const handleProgressChange = (e) => {
    setProgress(parseInt(e.target.value, 10));
  };

  const handleProgressCommit = async () => {
    if (progress === initialProgress) return;
    
    setIsUpdating(true);
    try {
      await onProgressUpdate(progress);
      if (progress === 100) {
        shootFireworks();
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      setProgress(initialProgress);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#27272A] p-4 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 mt-4 max-w-md">
      <div className="flex justify-between items-center mb-3">
        <label htmlFor="progress-slider" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Reading Progress
        </label>
        <span className="text-sm font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded">
          {progress}%
        </span>
      </div>
      
      <div className="relative h-6 flex items-center">
        <input
          id="progress-slider"
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          onMouseUp={handleProgressCommit}
          onTouchEnd={handleProgressCommit}
          disabled={isUpdating}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary-600
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 
            [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full 
            [&::-moz-range-thumb]:bg-primary-600 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-md"
        />
      </div>
      
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
        {progress === 100 ? '🎉 Completed!' : isUpdating ? 'Saving...' : 'Drag to update'}
      </div>
    </div>
  );
};

export default ReadingProgress;
