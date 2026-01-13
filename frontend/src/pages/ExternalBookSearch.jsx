import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { booksAPI } from '../services/api';
import SearchBar from '../components/SearchBar';
import defaultCover from '../lib/book title.jpg';

const ExternalBookSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  // Derived state from URL - explicit is better than implicit sync
  const query = searchParams.get('q') || '';

  // Effect: Triggers fetch ONLY when the URL query parameter changes
  useEffect(() => {
    if (query) {
      fetchBooks(query);
    }
  }, [query]);

  const fetchBooks = async (searchTerm) => {
    setLoading(true); // 1. Start loading spinner
    try {
      const response = await booksAPI.searchExternal({ search: searchTerm });
      setBooks(response.data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally { // code that will ALWAYS run, no matter what happened before it.
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;
    // Only update the URL. The useEffect above will handle the fetching.
    setSearchParams({ q: searchTerm });
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Search the Global Library
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-2xl">
          Find books from the public domain using our external catalog search.
        </p>
        <SearchBar onSearch={handleSearch} placeholder="Search by title or author..." instantSearch={true} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white dark:bg-[#0B1021] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-zinc-800 overflow-hidden group">
              <div className="aspect-[2/3] overflow-hidden relative bg-gray-100 dark:bg-zinc-900">
                <img
                  src={book.formats['image/jpeg'] || defaultCover}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                  {book.authors.map(a => a.name).join(', ') || 'Unknown Author'}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {book.subjects && book.subjects.slice(0, 2).map((subject, idx) => (
                    <span key={idx} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300">
                      {subject.split(' -- ')[0]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && books.length === 0 && query && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 dark:text-gray-400">No books found for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default ExternalBookSearch;
