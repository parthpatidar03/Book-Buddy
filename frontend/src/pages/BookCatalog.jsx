import { useState, useEffect } from 'react';
import { booksAPI } from '../services/api';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import './BookCatalog.css';

const BookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, [search, selectedGenre, selectedYear]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
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
    return <div className="loading">Loading books...</div>;
  }

  return (
    <div className="container">
      <h1>Book Catalog</h1>
      <SearchBar onSearch={setSearch} />
      <FilterBar
        genres={genres}
        selectedGenre={selectedGenre}
        selectedYear={selectedYear}
        onGenreChange={setSelectedGenre}
        onYearChange={setSelectedYear}
      />
      {books.length === 0 ? (
        <div className="no-results">No books found. Try adjusting your search or filters.</div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookCatalog;
