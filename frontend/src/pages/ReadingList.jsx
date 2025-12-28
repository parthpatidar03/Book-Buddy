import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { readingListAPI } from '../services/api';
import StatusSelector from '../components/StatusSelector';
import './ReadingList.css';

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
      wishlist: [],
      reading: [],
      complete: [],
    };
    items.forEach((item) => {
      grouped[item.status].push(item);
    });
    return grouped;
  };

  if (loading) {
    return <div className="loading">Loading your reading list...</div>;
  }

  const grouped = groupByStatus();

  return (
    <div className="container">
      <h1>My Reading List</h1>
      {items.length === 0 ? (
        <div className="empty-state">
          <p>Your reading list is empty. Start adding books!</p>
          <Link to="/" className="btn btn-primary">
            Browse Books
          </Link>
        </div>
      ) : (
        <>
          {grouped.wishlist.length > 0 && (
            <section className="status-section">
              <h2>Wishlist ({grouped.wishlist.length})</h2>
              <div className="reading-list-grid">
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

          {grouped.reading.length > 0 && (
            <section className="status-section">
              <h2>Currently Reading ({grouped.reading.length})</h2>
              <div className="reading-list-grid">
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

          {grouped.complete.length > 0 && (
            <section className="status-section">
              <h2>Completed ({grouped.complete.length})</h2>
              <div className="reading-list-grid">
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
        </>
      )}
    </div>
  );
};

const ReadingListItem = ({ item, onStatusChange, onRemove }) => {
  return (
    <div className="reading-list-item">
      <Link to={`/book/${item.book._id}`} className="item-book-link">
        <h3>{item.book.title}</h3>
        <p>by {item.book.author}</p>
      </Link>
      <div className="item-actions">
        <StatusSelector
          value={item.status}
          onChange={(status) => onStatusChange(item._id, status)}
        />
        <button
          onClick={() => onRemove(item._id)}
          className="btn btn-danger btn-sm"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default ReadingList;
