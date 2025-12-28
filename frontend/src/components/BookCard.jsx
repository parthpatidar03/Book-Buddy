import { Link } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ book }) => {
  return (
    <Link to={`/book/${book._id}`} className="book-card">
      <div className="book-card-content">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        <p className="book-genre">{book.genre}</p>
        {book.publicationYear && (
          <p className="book-year">{book.publicationYear}</p>
        )}
        <p className="book-description">
          {book.description?.substring(0, 100)}
          {book.description?.length > 100 ? '...' : ''}
        </p>
      </div>
    </Link>
  );
};

export default BookCard;
