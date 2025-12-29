import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customListsAPI, booksAPI } from '../services/api';
import './CustomLists.css';

const CustomLists = () => {
  const [lists, setLists] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);

  useEffect(() => {
    fetchLists();
    fetchBooks();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await customListsAPI.getAll();
      setLists(response.data);
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await booksAPI.getAll();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      await customListsAPI.create({
        name: newListName,
        books: selectedBooks,
      });
      setNewListName('');
      setSelectedBooks([]);
      setShowCreateForm(false);
      fetchLists();
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const handleDeleteList = async (listId) => {
    if (window.confirm('Delete this custom list?')) {
      try {
        await customListsAPI.delete(listId);
        fetchLists();
      } catch (error) {
        console.error('Error deleting list:', error);
      }
    }
  };

  const handleUpdateList = async (listId, updatedName, updatedBooks) => {
    try {
      await customListsAPI.update(listId, {
        name: updatedName,
        books: updatedBooks,
      });
      fetchLists();
    } catch (error) {
      console.error('Error updating list:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading custom lists...</div>;
  }

  return (
    <div className="container">
      <div className="custom-lists-header">
        <h1>Custom Lists</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn btn-primary"
        >
          {showCreateForm ? 'Cancel' : '+ Create New List'}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-list-form card">
          <h2>Create New List</h2>
          <form onSubmit={handleCreateList}>
            <div className="form-group">
              <label>List Name:</label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="e.g., Classics, Must Read, etc."
                required
              />
            </div>
            <div className="form-group">
              <label>Select Books:</label>
              <div className="books-checkboxes">
                {books.map((book) => (
                  <label key={book._id} className="book-checkbox">
                    <input
                      type="checkbox"
                      value={book._id}
                      checked={selectedBooks.includes(book._id)}
                      onChange={(e) => {
                        const id = book._id;
                        setSelectedBooks((prev) =>
                          e.target.checked ? [...prev, id] : prev.filter((x) => x !== id)
                        );
                      }}
                    />
                    {book.title} by {book.author}
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Create List
            </button>
          </form>
        </div>
      )}

      {lists.length === 0 ? (
        <div className="empty-state">
          <p>You haven't created any custom lists yet.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary"
          >
            Create Your First List
          </button>
        </div>
      ) : (
        <div className="lists-grid">
          {lists.map((list) => (
            <CustomListCard
              key={list._id}
              list={list}
              allBooks={books}
              onDelete={handleDeleteList}
              onUpdate={handleUpdateList}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CustomListCard = ({ list, allBooks, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState(
    list.books.map((book) => book._id)
  );
  const [name, setName] = useState(list.name);

  const handleSave = () => {
    onUpdate(list._id, name, selectedBooks);
    setIsEditing(false);
  };

  return (
    <div className="custom-list-card card">
      <div className="list-header">
        {isEditing ? (
          <input
            className="inline-list-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        ) : (
          <h3>{list.name}</h3>
        )}
        <div className="list-actions">
          <button
            onClick={() => {
              if (!isEditing) {
                setName(list.name);
                setSelectedBooks(list.books.map((b) => b._id));
              }
              setIsEditing(!isEditing);
            }}
            className="btn btn-sm"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button
            onClick={() => onDelete(list._id)}
            className="btn btn-danger btn-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="edit-mode">
          <div className="form-group">
            <label>Select Books:</label>
            <div className="books-checkboxes">
              {allBooks.map((book) => (
                <label key={book._id} className="book-checkbox">
                  <input
                    type="checkbox"
                    value={book._id}
                    checked={selectedBooks.includes(book._id)}
                    onChange={(e) => {
                      const id = book._id;
                      setSelectedBooks((prev) =>
                        e.target.checked ? [...prev, id] : prev.filter((x) => x !== id)
                      );
                    }}
                  />
                  {book.title} by {book.author}
                </label>
              ))}
            </div>
          </div>
          <button onClick={handleSave} className="btn btn-primary btn-sm">
            Save Changes
          </button>
        </div>
      ) : (
        <div className="list-books">
          {list.books.length === 0 ? (
            <p className="no-books">No books in this list</p>
          ) : (
            <ul>
              {list.books.map((book) => (
                <li key={book._id}>
                  <Link to={`/book/${book._id}`}>{book.title}</Link>
                  <span className="book-author"> by {book.author}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomLists;

