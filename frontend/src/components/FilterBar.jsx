import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const Dropdown = ({
  items = [],
  value,
  onChange,
  placeholder = 'Select',
  includeAllLabel = null,
  searchPlaceholder = 'Search...',
  minWidth = 220,
}) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [highlighted, setHighlighted] = useState(-1);
  const toggleRef = useRef(null);
  const listRef = useRef(null);
  const searchRef = useRef(null);
  
  const idRef = useRef(`dropdown-${Math.random().toString(36).slice(2)}`);
  const [menuStyle, setMenuStyle] = useState({});

  useEffect(() => setFilter(''), [open]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (toggleRef.current && !toggleRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    const updatePosition = () => {
      if (!toggleRef.current) return;
      const rect = toggleRef.current.getBoundingClientRect();
      setMenuStyle({
        left: `${rect.left}px`,
        top: `${rect.bottom + 6 + window.scrollY}px`,
        minWidth: `${Math.max(minWidth, rect.width)}px`,
      });
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, minWidth]);

  const filtered = items.filter((it) => it.label.toLowerCase().includes(filter.toLowerCase()));

  useEffect(() => {
    if (!open) return;
    const idx = filtered.findIndex((it) => String(it.value) === String(value));
    setHighlighted(idx >= 0 ? idx : (filtered.length ? 0 : -1));
  }, [open, filter, items, value]);

  useEffect(() => {
    if (highlighted >= 0 && listRef.current) {
      const el = listRef.current.children[includeAllLabel ? highlighted + 1 : highlighted];
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [highlighted, includeAllLabel]);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => {
      searchRef.current?.focus({ preventScroll: true });
    }, 0);
  }, [open]);

  const selectByIndex = (idx) => {
    if (idx < 0 || idx >= filtered.length) return;
    onChange(filtered[idx].value);
    setOpen(false);
    toggleRef.current?.focus();
  };

  const onToggleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen((s) => !s);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onSearchKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlighted >= 0) selectByIndex(highlighted);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      toggleRef.current?.focus();
    }
  };

  const menu = (
    <div 
      className="absolute z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-64" 
      style={menuStyle}
    >
      <div className="p-2 border-b border-gray-100 dark:border-gray-700">
        <input
          ref={searchRef}
          placeholder={searchPlaceholder}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          onKeyDown={onSearchKeyDown}
          className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <ul className="overflow-y-auto py-1" ref={listRef}>
        {includeAllLabel && (
          <li
            className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
              value === '' 
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => {
              onChange('');
              setOpen(false);
              toggleRef.current?.focus();
            }}
          >
            {includeAllLabel}
          </li>
        )}
        {filtered.map((it, idx) => (
          <li
            key={it.value}
            className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
              String(value) === String(it.value)
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'text-gray-700 dark:text-gray-300'
            } ${
              highlighted === idx ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
            onClick={() => {
              onChange(it.value);
              setOpen(false);
              toggleRef.current?.focus();
            }}
            onMouseEnter={() => setHighlighted(idx)}
          >
            {it.label}
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
            No results found
          </li>
        )}
      </ul>
    </div>
  );

  return (
    <div className="relative inline-block" ref={toggleRef}>
      <button
        type="button"
        className="input flex items-center justify-between gap-2 min-w-[140px] cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"
        onClick={() => setOpen((s) => !s)}
        onKeyDown={onToggleKeyDown}
      >
        <span className="truncate">
          {value === '' || value == null 
            ? placeholder 
            : items.find((i) => String(i.value) === String(value))?.label || placeholder}
        </span>
        <span className="text-gray-400 text-xs">▼</span>
      </button>
      {open && createPortal(menu, document.body)}
    </div>
  );
};

const FilterBar = ({ genres, selectedGenre, selectedYear, onGenreChange, onYearChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const genreItems = genres.map((g) => ({ value: g, label: g }));
  const yearItems = years.map((y) => ({ value: y, label: String(y) }));

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Genre:</label>
        <Dropdown
          items={genreItems}
          value={selectedGenre || ''}
          onChange={onGenreChange}
          placeholder="All Genres"
          includeAllLabel="All Genres"
          searchPlaceholder="Search genres..."
          minWidth={200}
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Year:</label>
        <Dropdown
          items={yearItems}
          value={selectedYear || ''}
          onChange={onYearChange}
          placeholder="All Years"
          includeAllLabel="All Years"
          searchPlaceholder="Search years..."
          minWidth={140}
        />
      </div>
    </div>
  );
};

export default FilterBar;
