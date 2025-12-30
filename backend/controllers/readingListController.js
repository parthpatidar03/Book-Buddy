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


// GET /api/reading-list/export (protected)
export const exportReadingList = async (req, res) => {
  try {
    const { format } = req.query;
    const items = await ReadingList.find({ user: req.user._id })
      .populate('book')
      .sort({ addedAt: -1 });

    if (!items || items.length === 0) {
      return res.status(404).json({ message: 'No reading history found' });
    }

    const data = items.map(item => ({
      Title: item.book.title,
      Author: item.book.author,
      Status: item.status,
      Progress: `${item.progress}%`,
      'Start Date': item.startDate ? new Date(item.startDate).toLocaleDateString() : 'Not started',
      'Finish Date': item.finishDate ? new Date(item.finishDate).toLocaleDateString() : 'Not finished',
      'Added At': new Date(item.addedAt).toLocaleDateString()
    }));

    if (format === 'csv') {
      const { Parser } = await import('json2csv');
      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(data);
      
      res.header('Content-Type', 'text/csv');
      res.attachment('reading-history.csv');
      return res.send(csv);
    } else if (format === 'pdf') {
      const PDFDocument = (await import('pdfkit')).default;
      const doc = new PDFDocument({ margin: 50 });

      res.header('Content-Type', 'application/pdf');
      res.attachment('reading-history.pdf');
      
      doc.pipe(res);

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('My Reading History', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).font('Helvetica').text(`Generated on ${new Date().toLocaleDateString()}`, { align: 'center', color: 'grey' });
      doc.moveDown(2);

      // Content
      data.forEach((item, index) => {
        const startX = 50; // Fixed left margin

        // Book Title with Numbering
        doc.fontSize(14).font('Helvetica-Bold').fillColor('black').text(`${index + 1}. ${item.Title}`, startX, doc.y);
        
        // Author
        doc.fontSize(11).font('Helvetica-Oblique').text(`by ${item.Author}`, startX, doc.y);
        doc.moveDown(0.3);

        // Details Line 1: Status & Progress
        const currentY = doc.y;
        
        doc.fontSize(9).font('Helvetica-Bold').text('Status:', startX, currentY);
        doc.font('Helvetica').text(item.Status, startX + 40, currentY);
        
        doc.font('Helvetica-Bold').text('Progress:', startX + 120, currentY);
        doc.font('Helvetica').text(item.Progress, startX + 170, currentY);

        doc.text('', startX, currentY + 12); // Move down manually
        
        // Details Line 2: Dates
        doc.font('Helvetica').fillColor('#555555');
        doc.text(`Added: ${item['Added At']} | Started: ${item['Start Date']} | Finished: ${item['Finish Date']}`, startX, doc.y);
        
        doc.moveDown(0.8);
        
        // Separator
        doc.strokeColor('#e0e0e0').lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.8);
        
        // Reset color
        doc.fillColor('black');
      });

      doc.end();
    } else {
      res.status(400).json({ message: 'Invalid format' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
