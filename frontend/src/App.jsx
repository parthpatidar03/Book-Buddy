import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import BookCatalog from './pages/BookCatalog';
import BookDetails from './pages/BookDetails';
import ReadingList from './pages/ReadingList';
import MyReviews from './pages/MyReviews';
import CustomLists from './pages/CustomLists';
import UserProfile from './pages/UserProfile';
import PublicProfile from './pages/PublicProfile';
import Analytics from './pages/Analytics';
import AdminDashboard from './pages/AdminDashboard';
import ShootingStars from './components/ShootingStars';


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-transparent text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
            <ShootingStars />
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<BookCatalog />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/book/:id" element={<BookDetails />} />
                <Route
                  path="/reading-list"
                  element={
                    <ProtectedRoute>
                      <ReadingList />{/* This is the "children" */}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-reviews"
                  element={
                    <ProtectedRoute>
                      <MyReviews />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/custom-lists"
                  element={
                    <ProtectedRoute>
                      <CustomLists />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/user/:id" element={<PublicProfile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
