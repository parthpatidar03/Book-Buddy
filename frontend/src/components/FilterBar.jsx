import './FilterBar.css';
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
    const rect = toggleRef.current.getBoundingClientRect();
    const style = {
      left: `${rect.left}px`,
      top: `${rect.bottom + 6 + window.scrollY}px`,
      minWidth: `${Math.max(minWidth, rect.width)}px`,
    };
    setMenuStyle(style);

    const onResize = () => {
      const r = toggleRef.current.getBoundingClientRect();
      setMenuStyle({ left: `${r.left}px`, top: `${r.bottom + 6 + window.scrollY}px`, minWidth: `${Math.max(minWidth, r.width)}px` });
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [open, minWidth]);

  const filtered = items.filter((it) => it.label.toLowerCase().includes(filter.toLowerCase()));

  useEffect(() => {
    if (!open) return;
    const idx = filtered.findIndex((it) => String(it.value) === String(value));
    setHighlighted(idx >= 0 ? idx : (filtered.length ? 0 : -1));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filter, items]);

  useEffect(() => {
    if (highlighted >= 0 && listRef.current) {
      const el = listRef.current.querySelector(`#${idRef.current}-option-${highlighted}`);
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [highlighted]);

  useEffect(() => {
    if (!open) return;
    // focus the search input without causing scroll jump
    setTimeout(() => {
      try {
        searchRef.current?.focus({ preventScroll: true });
      } catch (e) {
        // fallback for browsers that don't support preventScroll
        searchRef.current?.focus();
      }
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
    } else if (e.key === 'Home') {
      e.preventDefault();
      setHighlighted(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setHighlighted(filtered.length - 1);
    }
  };

  const menu = (
    <div className="genre-menu" style={menuStyle} role="listbox" id={`${idRef.current}-menu`} aria-labelledby={`${idRef.current}-toggle`}>
      <div className="genre-search">
        <input
          id={`${idRef.current}-search`}
          ref={searchRef}
          placeholder={searchPlaceholder}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          onKeyDown={onSearchKeyDown}
          aria-label={searchPlaceholder}
        />
      </div>
      <ul className="genre-list" ref={listRef}>
        {includeAllLabel && (
          <li
            id={`${idRef.current}-option-0`}
            role="option"
            aria-selected={value === ''}
            className={`genre-item ${value === '' ? 'selected' : ''}`}
            onClick={() => {
              onChange('');
              setOpen(false);
              toggleRef.current?.focus();
            }}
          >
            {includeAllLabel}
          </li>
        )}
        {filtered.map((it, idx) => {
          const index = includeAllLabel ? idx + 1 : idx;
          return (
            <li
              id={`${idRef.current}-option-${index}`}
              role="option"
              aria-selected={String(value) === String(it.value)}
              key={it.value}
              className={`genre-item ${String(value) === String(it.value) ? 'selected' : ''} ${highlighted === idx ? 'highlighted' : ''}`}
              onClick={() => {
                onChange(it.value);
                setOpen(false);
                toggleRef.current?.focus();
              }}
              onMouseEnter={() => setHighlighted(idx)}
            >
              {it.label}
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className="genre-dropdown" ref={toggleRef}>
      <button
        id={`${idRef.current}-toggle`}
        type="button"
        className="genre-toggle"
        onClick={() => setOpen((s) => !s)}
        onKeyDown={onToggleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${idRef.current}-menu`}
        role="combobox"
        tabIndex={0}
      >
        {value === '' || value == null ? placeholder : items.find((i) => String(i.value) === String(value))?.label || placeholder}
        <span className="caret">▾</span>
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
    <div className="filter-bar">
      <div className="filter-group">
        <label>Genre:</label>
        <Dropdown
          items={genreItems}
          value={selectedGenre || ''}
          onChange={onGenreChange}
          placeholder="All Genres"
          includeAllLabel="All Genres"
          searchPlaceholder="Search genres..."
          minWidth={220}
        />
      </div>
      <div className="filter-group">
        <label>Year:</label>
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
