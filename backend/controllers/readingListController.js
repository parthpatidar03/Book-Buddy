import ReadingList from '../models/ReadingList.js';

// GET /api/reading-list (protected)
export const getReadingList = async (req, res) => {
  try {
    const items = await ReadingList.find({ user: req.user._id })
      .populate('book')
      .sort({ addedAt: -1 });
    res.json(items);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/reading-list (protected)
export const addToReadingList = async (req, res) => {
  try {
    const { book, status } = req.body;
    const item = await ReadingList.create({ user: req.user._id, book, status });
    await item.populate('book');
    res.status(201).json(item);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Book already in your list' });
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/reading-list/:id (protected)
export const updateReadingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await ReadingList.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status },
      { new: true }
    ).populate('book');
    if (!item) return res.status(404).json({ message: 'Reading list item not found' });
    res.json(item);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/reading-list/:id (protected)
export const removeFromReadingList = async (req, res) => {
  try {
    const removed = await ReadingList.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!removed) return res.status(404).json({ message: 'Reading list item not found' });
    res.json({ message: 'Removed from reading list' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

