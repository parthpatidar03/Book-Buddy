import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import defaultCover from '../lib/book title.jpg';

const PublicProfile = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  useEffect(() => {
    if (currentUser && profile) {
      setIsFollowing(currentUser.following?.includes(profile.user._id));
    }
  }, [currentUser, profile]);

  const fetchProfile = async () => {
    try {
      const response = await usersAPI.getProfile(id);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await usersAPI.unfollow(id);
        setIsFollowing(false);
        
        // Update global user state
        const updatedUser = { 
          ...currentUser, 
          following: currentUser.following.filter(uid => uid !== id) 
        };
        updateUser(updatedUser);
      } else {
        await usersAPI.follow(id);
        setIsFollowing(true);
        
        // Update global user state
        const updatedUser = { 
          ...currentUser, 
          following: [...(currentUser.following || []), id] 
        };
        updateUser(updatedUser);
      }
      // Refresh profile to update follower count
      fetchProfile();
      
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-12">User not found</div>;
  }

  const { user, stats, recentBooks } = profile;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-8">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 h-32"></div>
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
                <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span><b>{user.followers.length}</b> Followers</span>
                  <span><b>{user.following.length}</b> Following</span>
                </div>
              </div>
            </div>
            {currentUser && currentUser.id !== user._id ? (
              <button 
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`btn ${isFollowing ? 'btn-outline' : 'btn-primary'} min-w-[100px]`}
              >
                {followLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            ) : (
              currentUser && (
                <Link to="/profile" className="btn btn-outline min-w-[100px]">
                  Edit Profile
                </Link>
              )
            )}
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
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {Math.round((stats.readCount / (user.readingGoal || 1)) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Goal Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Books */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recently Read</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentBooks.length > 0 ? (
          recentBooks
            .filter(item => item.book) // Filter out items where book is null
            .map((item) => (
            <Link key={item._id} to={`/book/${item.book._id}`} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex gap-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                <img src={defaultCover} alt={item.book.title} className="w-full h-full object-cover" />
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{item.book.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.book.author}</p>
                <div className="text-xs text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-full inline-block">
                  {item.book.genre}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 italic">No books read yet.</p>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
