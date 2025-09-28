import React from 'react';
import './GenreFilter.css';

const GenreFilter = ({ genres, selectedGenre, onGenreChange }) => {
  return (
    <div className="genre-filter">
      <label htmlFor="genre-select" className="genre-filter-label">
        Browse by Genre:
      </label>
      <div className="genre-tabs">
        <button
          className={`genre-tab ${selectedGenre === 'all' ? 'active' : ''}`}
          onClick={() => onGenreChange('all')}
        >
          All Books
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            className={`genre-tab ${selectedGenre === genre ? 'active' : ''}`}
            onClick={() => onGenreChange(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;