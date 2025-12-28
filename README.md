# Book Buddy - Online Book Discovery & Reading Tracker

A full-stack web application for discovering books, tracking reading progress, writing reviews, and organizing custom reading lists.

## Features

- ✅ User Authentication (Signup/Login with JWT)
- ✅ Book Catalog with Search & Filter
- ✅ Reading List Management (Wishlist, Reading, Complete)
- ✅ Book Reviews & Ratings (1-5 stars)
- ✅ Custom Lists (e.g., Classics, Must Read)
- ✅ Responsive Modern UI

## Tech Stack

### Backend
- Node.js + Express
- MongoDB Atlas (Mongoose)
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React 18
- Vite
- React Router
- Axios
- Context API

## Project Structure

```
Book Buddy/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & error middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── server.js        # Express server
└── frontend/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── context/     # React contexts
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   └── App.jsx      # Main app component
    └── vite.config.js   # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (free tier works)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd "Book Buddy/backend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in `backend/` directory:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bookbuddy?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
   PORT=3000
   CLIENT_ORIGIN=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd "Book Buddy/frontend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in `frontend/` directory (optional):
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

## Usage

1. **Sign Up**: Create a new account
2. **Browse Books**: Search and filter books by title, author, genre, or year
3. **Add to Reading List**: Add books with status (Wishlist, Reading, Complete)
4. **Write Reviews**: Rate books (1-5 stars) and write reviews
5. **Create Custom Lists**: Organize books into custom lists (e.g., "Classics", "Must Read")

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Books
- `GET /api/books` - Get all books (with search/filter params)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (protected)

### Reading List
- `GET /api/reading-list` - Get user's reading list (protected)
- `POST /api/reading-list` - Add book to list (protected)
- `PUT /api/reading-list/:id` - Update reading status (protected)
- `DELETE /api/reading-list/:id` - Remove from list (protected)

### Reviews
- `POST /api/reviews` - Create/update review (protected)
- `GET /api/reviews/book/:bookId` - Get reviews for a book
- `GET /api/reviews/user` - Get user's reviews (protected)
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)

### Custom Lists
- `GET /api/custom-lists` - Get user's custom lists (protected)
- `POST /api/custom-lists` - Create custom list (protected)
- `PUT /api/custom-lists/:id` - Update custom list (protected)
- `DELETE /api/custom-lists/:id` - Delete custom list (protected)

## Environment Variables

### Backend (.env)
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3000)
- `CLIENT_ORIGIN` - Frontend URL for CORS

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:3000/api)

## Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Troubleshooting

### Backend won't start
- Check MongoDB connection string in `.env`
- Verify JWT_SECRET is set
- Make sure MongoDB Atlas IP is whitelisted

### Frontend can't connect to backend
- Verify backend is running on port 3000
- Check CORS settings in backend
- Verify VITE_API_URL in frontend `.env`

### Authentication issues
- Clear localStorage in browser
- Check JWT token expiration (7 days)
- Verify user exists in database

## License

ISC

## Author

Book Buddy Development Team

