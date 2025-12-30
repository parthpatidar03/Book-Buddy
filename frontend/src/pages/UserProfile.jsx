import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { readingListAPI, reviewsAPI, usersAPI } from '../services/api';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState({
    readCount: 0,
    readingCount: 0,
    wishlistCount: 0,
    reviewCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(user?.readingGoal || 12);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    try {
      const response = await usersAPI.updateGoal({ readingGoal: parseInt(goalInput) });
      const updatedUser = { ...user, readingGoal: response.data.readingGoal };
      updateUser(updatedUser);
      setIsEditingGoal(false);
    } catch (error) {
      console.error('Failed to update goal', error);
    }
  };
  useEffect(() => {
    if (!loading && user?.readingGoal > 0 && stats.readCount >= user.readingGoal) {
      // Small delay to let the UI render first
      const timer = setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFA500', '#FF4500'], // Gold/Orange theme for trophy feel
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, user, stats.readCount]);

  const fetchUserData = async () => {
    try {
      const [listRes, reviewsRes] = await Promise.all([
        readingListAPI.getAll(),
        reviewsAPI.getUserReviews(),
      ]);

      const list = listRes.data;
      const reviews = reviewsRes.data;

      setStats({
        readCount: list.filter((i) => i.status === 'complete').length,
        readingCount: list.filter((i) => i.status === 'reading').length,
        wishlistCount: list.filter((i) => i.status === 'wishlist').length,
        reviewCount: reviews.length,
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Please log in to view your profile.</p>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-8">
        <div className="bg-primary-600 h-32"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-500 dark:text-gray-400">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="mb-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
            <button className="btn btn-outline btn-sm">Edit Profile</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stats.readCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Books Read</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stats.readingCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Reading</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stats.wishlistCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Wishlist</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stats.reviewCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals and Social Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Reading Goals */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reading Goal</h2>
            <button 
              onClick={() => setIsEditingGoal(!isEditingGoal)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {isEditingGoal ? 'Cancel' : 'Edit Goal'}
            </button>
          </div>
          
          {isEditingGoal ? (
            <form onSubmit={handleUpdateGoal} className="flex gap-2">
              <input
                type="number"
                min="1"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="input py-1 px-3"
                placeholder="Books per year"
              />
              <button type="submit" className="btn btn-primary py-1 px-4">Save</button>
            </form>
          ) : (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">
                  {stats.readCount} of {user.readingGoal || 0} books read
                </span>
                <span className="font-bold text-primary-600">
                  {Math.round((stats.readCount / (user.readingGoal || 1)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-primary-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((stats.readCount / (user.readingGoal || 1)) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {user.readingGoal ? 'Keep it up!' : 'Set a goal to track your progress!'}
              </p>
            </div>
          )}
        </div>

        {/* Social Stats */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Community</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.followers?.length || 0}
              </div>
              <div className="text-sm text-gray-500">Followers</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.following?.length || 0}
              </div>
              <div className="text-sm text-gray-500">Following</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
