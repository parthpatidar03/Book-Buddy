import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';

dotenv.config();

const runTest = async () => {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    // 1. Check what books we actually have
    const allBooks = await Book.find({}).limit(5);
    console.log('\n--- First 5 Books in DB ---');
    allBooks.forEach(b => console.log(`ID: ${b._id}, Title: "${b.title}", Author: "${b.author}", Genre: "${b.genre}"`));

    if (allBooks.length === 0) {
      console.log('No books found in DB!');
      process.exit(0);
    }

    // 2. Pick a term from the first book to search for
    const targetBook = allBooks[0];
    // Pick the first word of the title (or the whole title if short)
    const searchTerm = targetBook.title.split(' ')[0]; 
    console.log(`\n--- Testing Search for term: "${searchTerm}" ---`);

    // 3. Construct the exact query used in the controller
    const searchRegex = new RegExp(searchTerm.trim(), 'i');
    const query = {
      $or: [
        { title: searchRegex },
        { author: searchRegex },
        { genre: searchRegex }
      ]
    };

    console.log('Generated Query:', JSON.stringify(query, null, 2));

    // 4. Run the query
    const results = await Book.find(query);
    console.log(`\nFound ${results.length} matches.`);
    results.forEach(b => console.log(` - Match: "${b.title}"`));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

runTest();
