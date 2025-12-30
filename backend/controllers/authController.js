import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// SIGNUP: Create a new user account
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // 1. Validate Input: Ensure all fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // 2. Check Duplicates: Ensure email isn't already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already in use' });

    // 3. Hash Password: Encrypt password before saving (Security Best Practice)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User: Save to MongoDB
    const user = await User.create({ name, email, password: hashedPassword });

    // 5. Sanitize Response: Remove password from the response sent back to client
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({ message: 'User registered', user: userResponse });
  } catch (err)   {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
};

// LOGIN: Authenticate existing user
export const login = async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET is not configured' });
    }
    const { email, password } = req.body;
    
    // 1. Validate Input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 2. Find User: Check if email exists
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // 3. Verify Password: Compare input password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // 4. Generate Token: Create JWT for session management (valid for 1 day)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // 5. Sanitize Response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({ token, user: userResponse });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
};

