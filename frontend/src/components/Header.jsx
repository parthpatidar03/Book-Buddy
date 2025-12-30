import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              className="nav-button"
              onClick={() => navigate(-1)}
              aria-label="Go to previous page"
            >
              ◀ Prev
            </button>
            <Link to="/" className="logo" aria-label="Home">
              📚 Book Buddy
            </Link>
            <button
              className="nav-button"
              onClick={() => navigate('/')}
              aria-label="Go to dashboard"
            >
              Home ▶
            </button>
          </div>
          <nav className="nav">
            <ThemeToggle />
            {user ? (
              <>
                <Link to="/" className="nav-link">
                  <span className="nav-icon" aria-hidden>
                    <img src="https://cdn-icons-png.flaticon.com/128/3145/3145765.png" alt="Books" />
                  </span>
                  Books
                </Link>
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
