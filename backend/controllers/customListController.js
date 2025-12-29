import CustomList from '../models/CustomList.js';
import Book from '../models/Book.js';

// GET /api/custom-lists (all lists for user)
export const getCustomLists = async (req, res) => {
  try {
    const lists = await CustomList.find({ user: req.user._id })
      .populate('books')
      .sort({ createdAt: -1 });
    res.json(lists);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/custom-lists (create)
export const createCustomList = async (req, res) => {
  try {
    const { name, books } = req.body;
    const list = await CustomList.create({ user: req.user._id, name, books });
    await list.populate('books');
    res.status(201).json(list);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/custom-lists/:id (update: name, books)
export const updateCustomList = async (req, res) => {
  try {
    /**
     * Extracts the custom list name and associated books from the request body.
     *  CustomListRequestBody
     *  name - The name of the custom list.
     *  books - The array of books to be included in the custom list.
     */
    const { name, books } = req.body;
    const list = await CustomList.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, books, updatedAt: Date.now() },
      { new: true }
    ).populate('books');
    if (!list) return res.status(404).json({ message: 'Custom list not found' });
    res.json(list);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/custom-lists/:id
export const deleteCustomList = async (req, res) => {
  try {
    const deleted = await CustomList.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Custom list not found' });
    res.json({ message: 'Custom list deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
