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
  
  // Goal State
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(user?.readingGoal || 12);
  const [goalType, setGoalType] = useState(user?.readingGoalType || 'yearly');

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    avatarFile: null
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
      setProfileForm({
        name: user.name || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        avatarFile: null
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', profileForm.name);
      formData.append('bio', profileForm.bio);
      if (profileForm.avatarFile) {
        formData.append('avatar', profileForm.avatarFile);
      } else {
        // preserve existing URL if no new file
        formData.append('avatar', profileForm.avatar);
      }

      const response = await usersAPI.updateProfile(formData);
      updateUser(response.data);
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile');
    }
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    try {
      const response = await usersAPI.updateGoal({ 
        readingGoal: parseInt(goalInput),
        readingGoalType: goalType
      });
      const updatedUser = { 
        ...user, 
        readingGoal: response.data.readingGoal,
        readingGoalType: response.data.readingGoalType
      };
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
      <div className="bg-white dark:bg-[#27272A] rounded-xl shadow-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 mb-8">
        <div className="bg-primary-600 h-32"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end gap-4 w-full">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-[#27272A] p-1 shadow-sm shrink-0">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-500 dark:text-gray-400">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="mb-1 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{user.email}</p>
                {user.bio && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1 max-w-xl">{user.bio}</p>
                )}
              </div>
            </div>
            <button 
              onClick={() => setIsEditingProfile(true)}
              className="btn btn-outline btn-sm shrink-0"
            >
              Edit Profile
            </button>
          </div>

          {/* Edit Profile Modal */}
          {isEditingProfile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-[#27272A] rounded-xl shadow-sm w-full max-w-md p-6 border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Profile</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avatar Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileForm({...profileForm, avatarFile: e.target.files[0]})}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to keep current avatar.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                      className="input min-h-[100px] resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button 
                      type="button" 
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

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
        <div className="bg-white dark:bg-[#27272A] p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
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
            <form onSubmit={handleUpdateGoal} className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  className="input py-1 px-3 w-24"
                  placeholder="Count"
                />
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value)}
                  className="input py-1 px-3 flex-1"
                >
                  <option value="yearly">Books per Year</option>
                  <option value="monthly">Books per Month</option>
                </select>
                <button type="submit" className="btn btn-primary py-1 px-4">Save</button>
              </div>
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
                {user.readingGoal ? `Keep it up! (${user.readingGoal} books per ${user.readingGoalType === 'monthly' ? 'month' : 'year'})` : 'Set a goal to track your progress!'}
              </p>
            </div>
          )}
        </div>

        {/* Social Stats */}
        <div className="bg-white dark:bg-[#27272A] p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
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
