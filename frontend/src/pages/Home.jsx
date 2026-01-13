import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { readingListAPI, booksAPI } from '../services/api';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
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
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 flex flex-col items-center text-center">
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-6 tracking-tight">
            Discover Your Next <span className="text-primary-600 dark:text-primary-400">Favorite Book</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Explore our vast collection of public domain books. Track your reading journey, connect with other readers, and keep reading.
          </p>
          
          <div className="w-full max-w-2xl mx-auto transform transition-all hover:scale-105 duration-300">
             <SearchBar 
              onSearch={(term) => window.location.href = `/search?q=${encodeURIComponent(term)}`} 
              placeholder="Search for books..." 
              instantSearch={false}
            />
          </div>
        </div>
        
        {/* Decorative background elements can go here if needed, but StarryBackground handles most of it */}
      </section>

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
              <div key={item._id} className="bg-white dark:bg-[#27272A] p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex gap-4 transition-transform hover:-translate-y-1">
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
