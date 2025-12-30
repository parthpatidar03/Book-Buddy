import { useEffect, useState } from 'react';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } catch (e) { return 'light'; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }, [theme]);

  return (
    <button
      className={`theme-toggle ${theme === 'dark' ? 'dark' : 'light'}`}
      onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle color theme"
      title="Toggle day/night"
    >
      <span className="sun">☀️</span>
      <span className="moon">🌙</span>
    </button>
  );
};

export default ThemeToggle;
