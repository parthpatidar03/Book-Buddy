import Review from '../models/Review.js';

// POST /api/reviews (create or update, one per user per book)
export const createOrUpdateReview = async (req, res) => {
  try {
    const { book, rating, reviewText } = req.body;
    let review = await Review.findOne({ user: req.user._id, book });
    if (review) {
      review.rating = rating;
      review.reviewText = reviewText;
      review.updatedAt = Date.now();
      await review.save();
      return res.json(review);
    } else {
      review = await Review.create({
        user: req.user._id, book, rating, reviewText
      });
      return res.status(201).json(review);
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/reviews/book/:bookId (all reviews for a book)
export const getReviewsForBook = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId }).populate('user', 'name');
    res.json(reviews);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/reviews/user (all reviews by the authenticated user)
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id }).populate('book');
    res.json(reviews);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/reviews/:id (update review, only by owner)
export const updateReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { rating, reviewText, updatedAt: Date.now() },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/reviews/:id (delete review, only by owner)
export const deleteReview = async (req, res) => {
  try {
    const deleted = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
// POST /api/reviews/:id/like (toggle like)
export const likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Check if user already liked
    const index = review.likes.indexOf(req.user._id);
    if (index === -1) {
      // Like
      review.likes.push(req.user._id);
    } else {
      // Unlike
      review.likes.splice(index, 1);
    }

    await review.save();
    res.json(review.likes);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
