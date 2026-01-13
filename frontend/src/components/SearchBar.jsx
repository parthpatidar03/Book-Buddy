import { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, placeholder = 'Search by title, author, or genre...', instantSearch = true }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce logic: Wait 500ms after user stops typing before triggering search
  // This prevents flooding the backend with requests for every keystroke.
  useEffect(() => {
    if (!instantSearch) return; // Skip debounce if not instant search

    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch, instantSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!instantSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 dark:text-gray-400 text-lg">🔍</span>
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10 h-12 text-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          aria-label="Search books"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-12 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        )}
        {!instantSearch && (
           <button
             type="submit"
             className="absolute inset-y-0 right-0 px-4 flex items-center bg-primary-600 hover:bg-primary-700 text-white rounded-r-lg transition-colors"
           >
             Search
           </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
