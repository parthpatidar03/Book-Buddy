import { Link } from 'react-router-dom';
import defaultCover from '../lib/book title.jpg';

const BookCard = ({ book }) => {
  return (
    <Link 
      to={`/book/${book._id}`} 
      className="card group hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
      <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
        {/* Default Cover Image */}
        <img 
          src={defaultCover} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
      </div>
      <div className="flex-1 p-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
          {book.title}
        </h3>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          by {book.author}
        </p>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
            {book.genre}
          </span>
          {book.publicationYear && (
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {book.publicationYear}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {book.description}
        </p>
      </div>
    </Link>
  );
};

export default BookCard;
