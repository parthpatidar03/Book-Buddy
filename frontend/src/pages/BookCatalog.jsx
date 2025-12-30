import { useState, useEffect } from 'react';
import { booksAPI } from '../services/api';
import BookCard from '../components/BookCard';
import FilterBar from '../components/FilterBar';

const BookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, [selectedGenre, selectedYear]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedGenre) params.genre = selectedGenre;
      if (selectedYear) params.year = selectedYear;

      const response = await booksAPI.getAll(params);
      setBooks(response.data);

      // Extract unique genres
      const uniqueGenres = [...new Set(response.data.map((book) => book.genre))];
      setGenres(uniqueGenres.sort());
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Explore Books</h1>
        <div className="space-y-4">
          <FilterBar
            genres={genres}
            selectedGenre={selectedGenre}
            selectedYear={selectedYear}
            onGenreChange={setSelectedGenre}
            onYearChange={setSelectedYear}
          />
        </div>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-lg">
          No books found. Try adjusting your search or filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookCatalog;
