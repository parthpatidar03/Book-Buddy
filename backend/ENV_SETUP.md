# Environment Setup Guide

## Required .env File

Create a `.env` file in the `Book Buddy/backend/` directory with the following content:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_make_it_long_and_random_at_least_32_characters
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
```

## How to Get MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create an account
3. Create a new cluster (or use existing)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string
7. Replace `<password>` with your database password
8. Replace `<dbname>` with your database name (e.g., `bookbuddy`)

Example:
```
MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/bookbuddy?retryWrites=true&w=majority
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

