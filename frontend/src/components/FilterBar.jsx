import './FilterBar.css';

const FilterBar = ({ genres, selectedGenre, selectedYear, onGenreChange, onYearChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Genre:</label>
        <select value={selectedGenre || ''} onChange={(e) => onGenreChange(e.target.value)}>
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label>Year:</label>
        <select value={selectedYear || ''} onChange={(e) => onYearChange(e.target.value)}>
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
