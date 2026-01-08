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

  const handleStatusChange = async (itemId, newStatus, newFinishDate, newDropReason) => {
    try {
      const updateData = {};
      if (newStatus) updateData.status = newStatus;
      if (newFinishDate !== undefined) updateData.finishDate = newFinishDate;
      if (newDropReason !== undefined) updateData.dropReason = newDropReason;
      
      await readingListAPI.update(itemId, updateData);
      fetchReadingList();
    } catch (error) {
      console.error('Error updating item:', error);
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
      dropped: [],
    };
    items.forEach((item) => {
      if (item.book && grouped[item.status]) { // Only include items with valid book data and valid status
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
        <div className="text-center py-12 bg-zinc-50 dark:bg-[#27272A] rounded-lg border border-zinc-200 dark:border-zinc-800">
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

          {grouped.dropped.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
                <span className="text-2xl">🚫</span> Dropped Books ({grouped.dropped.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped.dropped.map((item) => (
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
  const [dropReason, setDropReason] = useState(item.dropReason || '');
  
  // Sync state with prop when item.dropReason changes (e.g., after refresh)
  useEffect(() => {
    setDropReason(item.dropReason || '');
  }, [item.dropReason]);
  
  const isDropped = item.status === 'dropped';
  const borderColor = isDropped 
    ? 'border-orange-200 dark:border-orange-700' 
    : 'border-gray-200 dark:border-gray-700';
  
  const handleSaveReason = () => {
    onStatusChange(item._id, item.status, undefined, dropReason);
  };
  
  return (
    <div className={`bg-white dark:bg-[#27272A] rounded-lg shadow-sm border ${borderColor} p-4 flex flex-col h-full transition-all hover:shadow-md`}>
      <div className="flex-1 mb-4">
        <Link to={`/book/${item.book._id}`} className="block group">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1">
            {item.book.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">by {item.book.author}</p>
        </Link>
      </div>
      <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between gap-3">
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
        
        {/* Only show the 'Finished' date input if the book status is 'complete' */}
        {item.status === 'complete' && (
          <div className="flex items-center gap-2 text-sm">
            <label className="text-gray-600 dark:text-gray-400 whitespace-nowrap">Finished:</label>
            <input
              type="date"
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5"
              // Format date to YYYY-MM-DD for the input value using local time
              value={item.finishDate ? (() => {
                const d = new Date(item.finishDate);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
              })() : ''}
              // Update the finish date when changed
              onChange={(e) => onStatusChange(item._id, undefined, e.target.value)}
            />
          </div>
        )}
        
        {/* Only show the 'Drop Reason' textarea if the book status is 'dropped' */}
        {item.status === 'dropped' && (
          <div className="flex flex-col gap-2 text-sm">
            <label className="text-orange-600 dark:text-orange-400 font-medium">Why did you drop this book?</label>
            <textarea
              className="bg-orange-50 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2 resize-none"
              placeholder="Optional: Too slow, didn't like the writing style, etc."
              rows="2"
              value={dropReason}
              onChange={(e) => setDropReason(e.target.value)}
            />
            <button
              onClick={handleSaveReason}
              className="self-end px-4 py-1.5 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Save Reason
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingList;
