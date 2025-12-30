import Book from '../models/Book.js';
import mongoose from 'mongoose';

// GET /api/books - with search and filters
// GET /api/books - with search and filters
export const getBooks = async (req, res) => {
  try {
    const { genre, year, publicationYear } = req.query;
    const query = {};

    // 1. Filter by Genre
    if (genre) query.genre = genre;
    
    // 2. Filter by Year (handle both 'year' and 'publicationYear' params)
    const y = year ?? publicationYear;
    if (y !== undefined && y !== '') {
      const parsed = parseInt(y, 10);
      if (!Number.isNaN(parsed)) query.publicationYear = parsed;
    }

    // 3. Execute Query: Find books matching filters, sorted by newest first
    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    console.error('Error in getBooks:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/books - Create a new book
export const createBook = async (req, res) => {
  try {
    // 1. Check DB Connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database unavailable' });
    }
    const { title, author, genre, description, publicationYear } = req.body;

    // 2. Validate Input: Ensure required fields are present and valid
    const errors = [];
    
    if (!title || typeof title !== 'string' || !title.trim()) {
      errors.push({ field: 'title', message: 'Title is required' });
    }
    if (!author || typeof author !== 'string' || !author.trim()) {
      errors.push({ field: 'author', message: 'Author is required' });
    }
    if (publicationYear !== undefined && publicationYear !== null && publicationYear !== '') {
      const parsed = parseInt(publicationYear, 10);
      if (Number.isNaN(parsed)) {
        errors.push({ field: 'publicationYear', message: 'Publication year must be a number' });
      }
    }

    if (errors.length) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    // 3. Create Book: Save to MongoDB
    const newBook = await Book.create({
      title: title.trim(),
      author: author.trim(),
      genre: typeof genre === 'string' ? genre.trim() : genre,
      description: typeof description === 'string' ? description.trim() : description,
      publicationYear: (publicationYear === undefined || publicationYear === '') ? undefined : parseInt(publicationYear, 10),
    });

    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/books/:id - Get a single book by ID
export const getBookById = async (req, res) => {
  try {
    // 1. Check DB Connection
    if (mongoose.connection.readyState !== 1) {
      // If DB not connected, try to match from sample (Fallback Mode)
      const id = req.params.id;
      const sample = {
        '1': { _id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', description: 'A classic novel.', publicationYear: 1925 },
        '2': { _id: '2', title: '1984', author: 'George Orwell', genre: 'Dystopian', description: 'Dystopian social science fiction.', publicationYear: 1949 }
      };
      if (sample[id]) return res.json(sample[id]);
      return res.status(404).json({ message: 'Book not found (offline sample)' });
    }
    
    // 2. Find Book: Look up by MongoDB ID
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

