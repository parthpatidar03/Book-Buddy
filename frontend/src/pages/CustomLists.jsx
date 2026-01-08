import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customListsAPI, booksAPI } from '../services/api';

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
      setShowCreateForm(false);
      fetchLists();
    } catch (error) {
      if (error.response?.status === 409) {
        alert(error.response.data.message);
      }
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
      fetchLists();
    } catch (error) {
      if (error.response?.status === 409) {
        alert(error.response.data.message);
      }
      console.error('Error updating list:', error);
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Custom Lists</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn btn-primary"
        >
          {showCreateForm ? 'Cancel' : '+ Create New List'}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white dark:bg-[#27272A] rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create New List</h2>
          <form onSubmit={handleCreateList}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">List Name:</label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="e.g.,Classics, Must Read, etc."
                required
                className="input"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Books:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900/50">
                {books.map((book) => (
                  <label key={book._id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors">
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
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {book.title} <span className="text-gray-500 dark:text-gray-500">by {book.author}</span>
                    </span>
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
        <div className="text-center py-12 bg-zinc-50 dark:bg-[#27272A] rounded-lg border border-zinc-200 dark:border-zinc-800">
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">You haven't created any custom lists yet.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary"
          >
            Create Your First List
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
    <div className="bg-white dark:bg-[#27272A] rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
        {isEditing ? (
          <input
            className="input text-lg font-bold py-1"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        ) : (
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{list.name}</h3>
        )}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => {
              if (!isEditing) {
                setName(list.name);
                setSelectedBooks(list.books.map((b) => b._id));
              }
              setIsEditing(!isEditing);
            }}
            className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 text-sm font-medium"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button
            onClick={() => onDelete(list._id)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="flex-1 flex flex-col">
          <div className="mb-4 flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Books:</label>
            <div className="grid gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900/50">
              {allBooks.map((book) => (
                <label key={book._id} className="flex items-center gap-2 cursor-pointer">
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
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {book.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <button onClick={handleSave} className="btn btn-primary btn-sm w-full">
            Save Changes
          </button>
        </div>
      ) : (
        <div className="flex-1">
          {list.books.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 italic text-sm">No books in this list</p>
          ) : (
            <ul className="space-y-2">
              {list.books.filter(b => b).map((book) => (
                <li key={book._id} className="text-sm">
                  <Link to={`/book/${book._id}`} className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {book.title}
                  </Link>
                  <span className="text-gray-500 dark:text-gray-400"> by {book.author}</span>
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
