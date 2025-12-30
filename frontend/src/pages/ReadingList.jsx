import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { readingListAPI } from '../services/api';
import StatusSelector from '../components/StatusSelector';

const ReadingList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReadingList();
  }, []);

  const fetchReadingList = async () => {
    try {
      const response = await readingListAPI.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching reading list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await readingListAPI.update(itemId, { status: newStatus });
      fetchReadingList();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleRemove = async (itemId) => {
    if (window.confirm('Remove this book from your reading list?')) {
      try {
        await readingListAPI.delete(itemId);
        fetchReadingList();
      } catch (error) {
        console.error('Error removing book:', error);
      }
    }
  };

  const groupByStatus = () => {
    const grouped = {
      reading: [],
      wishlist: [],
      complete: [],
    };
    items.forEach((item) => {
      if (item.book) { // Only include items with valid book data
        grouped[item.status].push(item);
      }
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const grouped = groupByStatus();

  const handleExport = async (format) => {
    try {
      const response = await readingListAPI.export(format);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reading-history.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      
      console.error('Error exporting reading list:', error);
      alert('Failed to export reading history');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Reading List</h1>
        {items.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('csv')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Export PDF
            </button>
          </div>
        )}
      </div>
      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">Your reading list is empty. Start adding books!</p>
          <Link to="/explore" className="btn btn-primary">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {grouped.reading.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📖</span> Currently Reading ({grouped.reading.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped.reading.map((item) => (
                  <ReadingListItem
                    key={item._id}
                    item={item}
                    onStatusChange={handleStatusChange}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </section>
          )}

          {grouped.wishlist.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🔖</span> Wishlist ({grouped.wishlist.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped.wishlist.map((item) => (
                  <ReadingListItem
                    key={item._id}
                    item={item}
                    onStatusChange={handleStatusChange}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </section>
          )}

          {grouped.complete.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">✅</span> Completed ({grouped.complete.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped.complete.map((item) => (
                  <ReadingListItem
                    key={item._id}
                    item={item}
                    onStatusChange={handleStatusChange}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

const ReadingListItem = ({ item, onStatusChange, onRemove }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col h-full transition-all hover:shadow-md">
      <div className="flex-1 mb-4">
        <Link to={`/book/${item.book._id}`} className="block group">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1">
            {item.book.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">by {item.book.author}</p>
        </Link>
      </div>
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
        <StatusSelector
          value={item.status}
          onChange={(status) => onStatusChange(item._id, status)}
        />
        <button
          onClick={() => onRemove(item._id)}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default ReadingList;
