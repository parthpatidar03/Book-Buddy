import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookCatalog from './pages/BookCatalog';
import BookDetails from './pages/BookDetails';
import ReadingList from './pages/ReadingList';
import MyReviews from './pages/MyReviews';
import CustomLists from './pages/CustomLists';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<BookCatalog />} />
              <Route path="/book/:id" element={<BookDetails />} />
              <Route
                path="/reading-list"
                element={
                  <ProtectedRoute>
                    <ReadingList />
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
