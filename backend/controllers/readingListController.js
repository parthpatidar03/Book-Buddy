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

// PUT /api/reading-list/:id/progress (protected)
export const updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    let update = { progress };
    
    // Auto-complete if progress is 100
    if (progress === 100) {
      update.status = 'complete';
      update.finishDate = Date.now();
    }

    // Set start date if progress > 0 and not set
    const currentItem = await ReadingList.findOne({ _id: req.params.id, user: req.user._id });
    if (currentItem && progress > 0 && !currentItem.startDate) {
      update.startDate = Date.now();
      if (currentItem.status === 'wishlist') {
        update.status = 'reading';
      }
    }

    const item = await ReadingList.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      update,
      { new: true }
    ).populate('book');

    if (!item) return res.status(404).json({ message: 'Reading list item not found' });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/reading-list/:id/notes (protected)
export const addNote = async (req, res) => {
  try {
    const { text, page } = req.body;
    const item = await ReadingList.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $push: { notes: { text, page } } },
      { new: true }
    ).populate('book');

    if (!item) return res.status(404).json({ message: 'Reading list item not found' });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

