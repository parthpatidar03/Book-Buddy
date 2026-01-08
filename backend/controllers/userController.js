import User from '../models/User.js';
import ReadingList from '../models/ReadingList.js';

// Update Reading Goal
export const updateReadingGoal = async (req, res) => {
  try {
    const { readingGoal, readingGoalType } = req.body;
    
    if (!readingGoal) {
      return res.status(400).json({ message: 'Reading goal is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        readingGoal, 
        readingGoalType: readingGoalType || 'yearly' 
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Error updating reading goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (req.file) {
      updateData.avatar = `${process.env.API_URL || 'http://localhost:3000'}/uploads/${req.file.filename}`;
    } else if (avatar !== undefined) {
      updateData.avatar = avatar;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Follow a user
export const followUser = async (req, res) => {
  try {
    const userToFollowId = req.params.id;
    const currentUserId = req.user.id;

    if (userToFollowId === currentUserId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const userToFollow = await User.findById(userToFollowId);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already following
    if (currentUser.following.includes(userToFollowId)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Add to following/followers
    currentUser.following.push(userToFollowId);
    userToFollow.followers.push(currentUserId);

    await Promise.all([currentUser.save(), userToFollow.save()]);

    res.json(currentUser.following);
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const userToUnfollowId = req.params.id;
    const currentUserId = req.user.id;

    const userToUnfollow = await User.findById(userToUnfollowId);
    const currentUser = await User.findById(currentUserId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from following/followers
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollowId
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUserId
    );

    await Promise.all([currentUser.save(), userToUnfollow.save()]);

    res.json(currentUser.following);
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Public Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email') // Hide sensitive info
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's reading stats
    const readingList = await ReadingList.find({ user: user._id }).populate('book');
    const readCount = readingList.filter(item => item.status === 'complete').length;
    const readingCount = readingList.filter(item => item.status === 'reading').length;

    res.json({
      user,
      stats: {
        readCount,
        readingCount,
        wishlistCount: readingList.filter(item => item.status === 'wishlist').length,
      },
      recentBooks: readingList
        .filter(item => item.status === 'complete')
        .sort((a, b) => new Date(b.finishDate || b.addedAt) - new Date(a.finishDate || a.addedAt))
        .slice(0, 5) // Last 5 read books
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
