import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recommendationsAPI } from '../services/api';

import defaultCover from '../lib/book title.jpg';

const Recommendations = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await recommendationsAPI.get();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (books.length === 0) {
    return null; // Don't show section if no recommendations
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span className="text-2xl">✨</span> Recommended for You
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {books.map((book) => (
          <Link key={book._id} to={`/book/${book._id}`} className="group">
            <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 overflow-hidden shadow-md transition-transform group-hover:-translate-y-1">
              <img 
                src={defaultCover} 
                alt={book.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {book.author}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Recommendations;
