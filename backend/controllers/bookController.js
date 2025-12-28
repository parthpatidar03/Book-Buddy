import Book from '../models/Book.js';

// GET /api/books - with search and filters
export const getBooks = async (req, res) => {
  try {
    const { search, genre, year } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    if (genre) query.genre = genre;
    if (year) query.publicationYear = parseInt(year, 10);
    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/books
export const createBook = async (req, res) => {
  try {
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
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

