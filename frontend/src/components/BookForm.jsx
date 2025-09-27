import React, { useState, useEffect } from 'react';
import './BookForm.css';

const BookForm = ({ book, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    author: '',
    genre: '',
    year: new Date().getFullYear(),
    edition: '',
    description: '',
    language: '',
    availability: true,
    availableCopies: 1,
    location: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        image: book.image || '',
        author: book.author || '',
        genre: book.genre || '',
        year: book.year || new Date().getFullYear(),
        edition: book.edition || '',
        description: book.description || '',
        language: book.language || '',
        availability: book.availability !== undefined ? book.availability : true,
        availableCopies: book.availableCopies || 1,
        location: book.location || ''
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    if (!formData.genre.trim()) {
      newErrors.genre = 'Genre is required';
    }
    
    if (!formData.year || formData.year < 1000 || formData.year > new Date().getFullYear() + 10) {
      newErrors.year = 'Please enter a valid year';
    }
    
    if (!formData.language.trim()) {
      newErrors.language = 'Language is required';
    }
    
    if (!formData.availableCopies || formData.availableCopies < 0) {
      newErrors.availableCopies = 'Available copies must be 0 or greater';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        year: parseInt(formData.year),
        availableCopies: parseInt(formData.availableCopies)
      });
    }
  };

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Thriller', 'Science Fiction',
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Technology', 'Business',
    'Health', 'Travel', 'Children', 'Young Adult', 'Poetry', 'Drama', 'Other'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian', 'Other'
  ];

  return (
    <div className="book-form">
      <div className="form-header">
        <h2>{book ? '📝 Edit Book' : '➕ Add New Book'}</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Enter book title"
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          {/* Author */}
          <div className="form-group">
            <label htmlFor="author" className="form-label">
              Author <span className="required">*</span>
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={`form-input ${errors.author ? 'error' : ''}`}
              placeholder="Enter author name"
            />
            {errors.author && <span className="error-text">{errors.author}</span>}
          </div>

          {/* Genre */}
          <div className="form-group">
            <label htmlFor="genre" className="form-label">
              Genre <span className="required">*</span>
            </label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className={`form-input ${errors.genre ? 'error' : ''}`}
            >
              <option value="">Select a genre</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            {errors.genre && <span className="error-text">{errors.genre}</span>}
          </div>

          {/* Year */}
          <div className="form-group">
            <label htmlFor="year" className="form-label">
              Year <span className="required">*</span>
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`form-input ${errors.year ? 'error' : ''}`}
              min="1000"
              max={new Date().getFullYear() + 10}
            />
            {errors.year && <span className="error-text">{errors.year}</span>}
          </div>

          {/* Edition */}
          <div className="form-group">
            <label htmlFor="edition" className="form-label">Edition</label>
            <input
              type="text"
              id="edition"
              name="edition"
              value={formData.edition}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., 1st, 2nd, Revised"
            />
          </div>

          {/* Language */}
          <div className="form-group">
            <label htmlFor="language" className="form-label">
              Language <span className="required">*</span>
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className={`form-input ${errors.language ? 'error' : ''}`}
            >
              <option value="">Select a language</option>
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
            {errors.language && <span className="error-text">{errors.language}</span>}
          </div>

          {/* Available Copies */}
          <div className="form-group">
            <label htmlFor="availableCopies" className="form-label">
              Available Copies <span className="required">*</span>
            </label>
            <input
              type="number"
              id="availableCopies"
              name="availableCopies"
              value={formData.availableCopies}
              onChange={handleChange}
              className={`form-input ${errors.availableCopies ? 'error' : ''}`}
              min="0"
            />
            {errors.availableCopies && <span className="error-text">{errors.availableCopies}</span>}
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Location <span className="required">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`form-input ${errors.location ? 'error' : ''}`}
              placeholder="e.g., A1-B2, Section-Shelf"
            />
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>
        </div>

        {/* Image URL */}
        <div className="form-group full-width">
          <label htmlFor="image" className="form-label">Image URL</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="form-input"
            placeholder="https://example.com/book-cover.jpg"
          />
        </div>

        {/* Description */}
        <div className="form-group full-width">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            rows="4"
            placeholder="Brief description of the book"
          />
        </div>

        {/* Availability */}
        <div className="form-group full-width">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="availability"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
              className="form-checkbox"
            />
            <label htmlFor="availability" className="checkbox-label">
              📚 Book is currently available for borrowing
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            ❌ Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? '⏳ Saving...' : (book ? '💾 Update Book' : '➕ Add Book')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;