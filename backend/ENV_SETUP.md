# Environment Setup Guide

## Required .env File

Create a `.env` file in the `Book Buddy/backend/` directory with the following content:

```env
MONGO_URI=mongodb://127.0.0.1:27017/bookbuddy
JWT_SECRET=your_super_secret_jwt_key
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
```

## Database Setup (Local MongoDB)

1.  **Install MongoDB Compass & Server**: Download and install from [MongoDB Community Server](https://www.mongodb.com/try/download/community).
2.  **Start MongoDB**: Ensure the MongoDB service is running on your machine.
3.  **Connection String**: The default local connection string is `mongodb://127.0.0.1:27017/bookbuddy`. This will automatically create a database named `bookbuddy` when you start saving data.

## Database Setup (Cloud - Optional)

If you prefer to use MongoDB Atlas (Cloud):
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2.  Get your connection string and replace the `MONGO_URI` in `.env`.
    Example:
    ```
    MONGO_URI=mongodb+srv://user:pass@cluster.net/bookbuddy?retryWrites=true&w=majority
    ```

## How to Generate JWT Secret

You can use any long random string. Here are some options:

**Option 1: Use Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Option 2: Use Online Generator**
- Visit: https://randomkeygen.com/
- Copy a "CodeIgniter Encryption Keys" (256-bit)

**Option 3: Use Any Random String**
- At least 32 characters
- Mix of letters, numbers, and symbols

Example:
```
JWT_SECRET=my_super_secret_jwt_key_that_is_very_long_and_secure_123456789
```

## Troubleshooting Login Error

If you're getting a 500 error on login:

1. **Check .env file exists** in `Book Buddy/backend/` directory
2. **Verify JWT_SECRET is set** - server will exit on startup if missing
3. **Check MongoDB connection** - server will exit on startup if MONGO_URI is missing
4. **Restart the server** after creating/updating .env file
5. **Check server console** - errors are now logged with details
6. **Verify user exists** - Make sure you've signed up first before logging in

## After Setting Up .env

1. Restart your server:
   ```bash
   npm run dev
   ```

2. You should see:
   ```
   Successfully connected to MongoDB: ...
   Server running on port 3000
   ```

3. If you see errors about missing environment variables, check your .env file

