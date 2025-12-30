# Book Buddy 📚

Book Buddy is a comprehensive personal library management application designed to help book lovers track their reading journey. Built with the MERN stack (MongoDB, Express, React, Node.js), it offers a rich set of features for managing books, tracking progress, and analyzing reading habits.

## 🌟 Key Features

### 📖 Book Management
*   **Browse & Discover**: Explore a vast collection of books with detailed information including covers, authors, genres, and descriptions.
*   **Search & Filter**: Easily find books by title, author, or genre.
*   **Book Details**: View comprehensive details for each book.

### 📝 Reading List & Tracking
*   **Status Tracking**: Categorize books into **Reading**, **Wishlist**, or **Completed**.
*   **Progress Tracking**: Update your reading progress (percentage) for books currently being read.
*   **Auto-Date Completion**: Automatically records the finish date when a book is marked as "Complete".
*   **Manual Date Entry**: Edit the finish date directly from the Book Details page using a convenient date picker.

### ✍️ Notes & Highlights
*   **Add Notes**: Save favorite quotes, thoughts, and highlights for each book, including page numbers.
*   **Export Notes**: Download your notes for a specific book as a beautifully formatted PDF.

### 📊 Analytics Dashboard
*   **Visual Insights**: View interactive charts visualizing your reading habits.
*   **Books per Month**: Bar chart showing the number of books read each month.
*   **Genre Distribution**: Pie chart displaying your most read genres.
*   **Key Metrics**: Summary cards for Total Books Read, Average Rating, and Total Reviews.

### 📤 Export & Data Portability
*   **Export Reading History**: Download your entire reading history as a **CSV** or **PDF** file.
*   **PDF Formatting**: The exported PDF is compact, numbered, and professionally formatted for easy printing or sharing.

### ⭐ Reviews & Community
*   **Rate & Review**: Give star ratings and write reviews for books you've read.
*   **Community Reviews**: See what others are saying about books.

### 📋 Custom Lists
*   **Create Lists**: Organize books into custom lists (e.g., "Summer Reading", "Favorites").
*   **Manage Lists**: Add or remove books from your custom lists.

## 🛠️ Technology Stack

*   **Frontend**: React.js, Tailwind CSS, Recharts (for analytics), Lucide React (icons).
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (with Mongoose).
*   **Authentication**: JWT (JSON Web Tokens).
*   **PDF Generation**: PDFKit.
*   **CSV Generation**: json2csv.

## 🚀 Getting Started

### Prerequisites
*   Node.js installed
*   MongoDB installed or a MongoDB Atlas connection string

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd book-buddy
    ```

2.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Environment Setup**
    *   Create a `.env` file in the `backend` directory.
    *   Add the following variables:
        ```env
        PORT=5000
        MONGODB_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret_key
        ```

5.  **Run the Application**
    *   Start the backend server:
        ```bash
        cd backend
        npm run dev
        ```
    *   Start the frontend development server:
        ```bash
        cd frontend
        npm run dev
        ```

6.  **Access the App**
    *   Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## 📄 License

This project is licensed under the MIT License.
