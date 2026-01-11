import { Link } from 'react-router-dom';
import { useState } from 'react';
import defaultCover from '../lib/book title.jpg';
import { summaryAPI } from '../services/api';

const BookCard = ({ book }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    
    if (summary) {
      setSummary(null); // Toggle off
      return;
    }

    setLoading(true);
    try {
      const response = await summaryAPI.getSummary({ 
        title: book.title, 
        author: book.author 
      });
      // here, data = { title: "Harry Potter", author: "JK Rowling" }
      
      
      // response.data: This is what your Backend sent back! { summary: "Harry differs..." }
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Failed to summarize', error);
      alert('Failed to get summary. Do you have an OpenAI Key set?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative h-full"> 
      {/* Wrapper div to handle positioning of summary properly */}
      
      <Link 
        to={`/book/${book._id}`} 
        className="card block h-full overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
      >
        <div 
        className="relative aspect-[2/3] overflow-hidden rounded-t-xl bg-gray-100 dark:bg-[#0B1021] group-hover:shadow-2xl transition-all duration-500 ease-out transform group-hover:perspective-[1000px] group-hover:[transform:rotateY(-5deg)_rotateX(2deg)_scale(1.02)]"
        style={{ transformStyle: 'preserve-3d' }}
      >
          {/* Default Cover Image */}
          <img 
            src={defaultCover} 
            alt={book.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          
          {/* AI Button - Positioned absolute on top of the image */}
          <button
            onClick={handleSummarize}
            className="absolute top-2 right-2 bg-white/90 dark:bg-gssoc-card/90 text-primary-600 dark:text-gssoc-primary p-1.5 rounded-full shadow-sm hover:scale-110 transition-transform backdrop-blur-sm z-10 border border-primary-200 dark:border-gssoc-card-border"
            title="AI Summarize"
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-primary-600 rounded-full border-t-transparent" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM6.97 11.03a.75.75 0 111.06 1.06l-1.06-1.06zm0 0a.75.75 0 101.06 1.06l-1.06-1.06z" clipRule="evenodd" />
                <path d="M14.25 4.5a.75.75 0 01.75.75v3.25a.75.75 0 01-1.5 0V5.25a.75.75 0 01.75-.75zM14.25 15a.75.75 0 01.75.75v3.25a.75.75 0 01-1.5 0v-3.25a.75.75 0 01.75-.75zM19.5 9.75a.75.75 0 01.75.75V11a.75.75 0 01-1.5 0v-.5a.75.75 0 01.75-.75zM19.5 16.5a.75.75 0 01.75.75v3.25a.75.75 0 01-1.5 0v-3.25a.75.75 0 01.75-.75z" />
              </svg>
            )}
          </button>
        </div>
        
        <div className="flex-1 p-4 flex flex-col relative">
           {/* Summary Overlay/Disclosure */}
           {summary && (
             <div className="absolute inset-0 bg-white dark:bg-gssoc-card z-20 p-4 text-sm overflow-y-auto animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-primary-600 dark:text-gssoc-primary">AI Summary</h4>
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSummary(null); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-700 dark:text-gssoc-text-secondary whitespace-pre-line">{summary}</p>
            </div>
           )}

          <h3 className="text-xl font-bold text-gray-900 dark:text-gssoc-text-primary mb-1 group-hover:text-primary-600 dark:group-hover:text-gssoc-primary transition-colors line-clamp-1">
            {book.title}
          </h3>
          <p className="text-sm font-medium text-gray-600 dark:text-gssoc-text-secondary mb-2">
            by {book.author}
          </p>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-gssoc-primary/10 dark:text-gssoc-primary">
              {book.genre}
            </span>
            {book.publicationYear && (
              <span className="text-xs text-gray-500 dark:text-gssoc-text-secondary/60">
                {book.publicationYear}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gssoc-text-secondary line-clamp-3">
            {book.description}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;
