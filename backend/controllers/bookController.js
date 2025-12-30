import Book from '../models/Book.js';
import mongoose from 'mongoose';

// GET /api/books - with search and filters
export const getBooks = async (req, res) => {
  try {
    // If DB not connected, return a small mock dataset so frontend can function
    if (mongoose.connection.readyState !== 1) {
      const sample = [
        { _id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', description: 'A classic novel.', publicationYear: 1925 },
        { _id: '2', title: '1984', author: 'George Orwell', genre: 'Dystopian', description: 'Dystopian social science fiction.', publicationYear: 1949 }
      ];
      return res.json(sample);
    }
    const { search, genre, year, publicationYear } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    if (genre) query.genre = genre;
    const y = year ?? publicationYear;
    if (y !== undefined && y !== '') {
      const parsed = parseInt(y, 10);
      if (!Number.isNaN(parsed)) query.publicationYear = parsed;
    }
    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/books
export const createBook = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database unavailable' });
    }
    const { title, author, genre, description, publicationYear } = req.body;
    const newBook = await Book.create({ title, author, genre, description, publicationYear });
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/books/:id
export const getBookById = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      // If DB not connected, try to match from sample
      const id = req.params.id;
      const sample = {
        '1': { _id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', description: 'A classic novel.', publicationYear: 1925 },
        '2': { _id: '2', title: '1984', author: 'George Orwell', genre: 'Dystopian', description: 'Dystopian social science fiction.', publicationYear: 1949 }
      };
      if (sample[id]) return res.json(sample[id]);
      return res.status(404).json({ message: 'Book not found (offline sample)' });
    }
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

