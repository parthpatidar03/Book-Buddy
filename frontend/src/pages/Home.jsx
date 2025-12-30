import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { readingListAPI, booksAPI } from '../services/api';
import BookCard from '../components/BookCard';
import Recommendations from '../components/Recommendations';
import { useAuth } from '../context/AuthContext';

import defaultCover from '../lib/book title.jpg';

const Home = () => {
  const { user } = useAuth();
  const [readingList, setReadingList] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch trending/new books (just getting first 4 for now)
        const booksResponse = await booksAPI.getAll({ limit: 4 });
        setTrendingBooks(booksResponse.data.slice(0, 4));

        // Fetch reading list if user is logged in
        if (user) {
          const listResponse = await readingListAPI.getAll();
          // Filter for currently reading AND ensure book data exists
          const currentReading = listResponse.data
            .filter(item => item.status === 'reading' && item.book);
          setReadingList(currentReading);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* ... Hero Section ... */}

      {/* Currently Reading Section */}
      {user && readingList.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Currently Reading</h2>
            <Link to="/reading-list" className="text-primary-600 hover:text-primary-700 font-medium">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readingList.map((item) => (
              <div key={item._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex gap-4 transition-transform hover:-translate-y-1">
                <div className="w-20 h-28 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={defaultCover} 
                    alt={item.book?.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1">{item.book?.title || 'Unknown Title'}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">by {item.book?.author || 'Unknown Author'}</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.progress || 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.progress || 0}% Complete</p>
                    <Link to={`/book/${item.book._id}`} className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
                      Resume →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommendations Section */}
      {user && <Recommendations />}

      {/* Trending / New Arrivals */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Books</h2>
          <Link to="/explore" className="text-primary-600 hover:text-primary-700 font-medium">
            Explore All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
