import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            📚 Book Buddy
          </Link>
          <nav className="nav">
            {user ? (
              <>
                <Link to="/" className="nav-link">Books</Link>
                <Link to="/reading-list" className="nav-link">Reading List</Link>
                <Link to="/my-reviews" className="nav-link">My Reviews</Link>
                <Link to="/custom-lists" className="nav-link">Custom Lists</Link>
                <span className="user-name">Hello, {user.name}</span>
                <button onClick={handleLogout} className="btn btn-primary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
