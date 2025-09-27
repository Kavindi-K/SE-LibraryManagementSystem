import React, { useState, useMemo } from 'react';
import './BookList.css';

const BookList = ({ books, onEdit, onDelete, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort books
  const filteredAndSortedBooks = useMemo(() => {
    let filtered = books.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAvailability = 
        filterAvailability === 'all' ||
        (filterAvailability === 'available' && book.availability) ||
        (filterAvailability === 'unavailable' && !book.availability);
      
      return matchesSearch && matchesAvailability;
    });

    // Sort books
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [books, searchTerm, sortField, sortDirection, filterAvailability]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = filteredAndSortedBooks.slice(startIndex, endIndex);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '⬆️' : '⬇️';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && books.length === 0) {
    return (
      <div className="book-list-container">
        <div className="loading-books">
          <div className="spinner"></div>
          <p>Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="book-list-container">
      <div className="list-header">
        <h2>📚 Books Library ({filteredAndSortedBooks.length} books)</h2>
        
        {/* Search and Filters */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search books by title, author, genre, or location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <select
              value={filterAvailability}
              onChange={(e) => {
                setFilterAvailability(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="all">All Books</option>
              <option value="available">Available Only</option>
              <option value="unavailable">Unavailable Only</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAndSortedBooks.length === 0 ? (
        <div className="no-books">
          <div className="no-books-icon">📚</div>
          <h3>No books found</h3>
          <p>
            {searchTerm || filterAvailability !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Start by adding your first book to the library.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="table-container desktop-view">
            <table className="books-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('title')} className="sortable">
                    Title {getSortIcon('title')}
                  </th>
                  <th onClick={() => handleSort('author')} className="sortable">
                    Author {getSortIcon('author')}
                  </th>
                  <th onClick={() => handleSort('genre')} className="sortable">
                    Genre {getSortIcon('genre')}
                  </th>
                  <th onClick={() => handleSort('year')} className="sortable">
                    Year {getSortIcon('year')}
                  </th>
                  <th onClick={() => handleSort('language')} className="sortable">
                    Language {getSortIcon('language')}
                  </th>
                  <th onClick={() => handleSort('availableCopies')} className="sortable">
                    Copies {getSortIcon('availableCopies')}
                  </th>
                  <th onClick={() => handleSort('availability')} className="sortable">
                    Status {getSortIcon('availability')}
                  </th>
                  <th onClick={() => handleSort('location')} className="sortable">
                    Location {getSortIcon('location')}
                  </th>
                  <th className="actions-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBooks.map((book) => (
                  <tr key={book.id} className="book-row">
                    <td className="book-title">
                      <div className="title-cell">
                        {book.image && (
                          <img 
                            src={book.image} 
                            alt={book.title}
                            className="book-thumbnail"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <div className="title-text">{book.title}</div>
                          {book.edition && (
                            <div className="edition-text">({book.edition})</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{book.author}</td>
                    <td>
                      <span className="genre-tag">{book.genre}</span>
                    </td>
                    <td>{book.year}</td>
                    <td>{book.language}</td>
                    <td>
                      <span className="copies-count">{book.availableCopies}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${book.availability ? 'available' : 'unavailable'}`}>
                        {book.availability ? '✅ Available' : '❌ Unavailable'}
                      </span>
                    </td>
                    <td>
                      <span className="location-tag">{book.location}</span>
                    </td>
                    <td className="actions-cell">
                      <button
                        onClick={() => onEdit(book)}
                        className="btn btn-small btn-secondary"
                        title="Edit Book"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(book.id)}
                        className="btn btn-small btn-danger"
                        title="Delete Book"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="cards-container mobile-view">
            {currentBooks.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-card-header">
                  {book.image && (
                    <img 
                      src={book.image} 
                      alt={book.title}
                      className="book-card-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="book-card-info">
                    <h3 className="book-card-title">{book.title}</h3>
                    {book.edition && (
                      <p className="book-card-edition">({book.edition})</p>
                    )}
                    <p className="book-card-author">by {book.author}</p>
                    <span className={`status-badge ${book.availability ? 'available' : 'unavailable'}`}>
                      {book.availability ? '✅ Available' : '❌ Unavailable'}
                    </span>
                  </div>
                </div>
                
                <div className="book-card-details">
                  <div className="detail-item">
                    <span className="detail-label">Genre:</span>
                    <span className="genre-tag">{book.genre}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Year:</span>
                    <span>{book.year}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Language:</span>
                    <span>{book.language}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Copies:</span>
                    <span className="copies-count">{book.availableCopies}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="location-tag">{book.location}</span>
                  </div>
                  {book.description && (
                    <div className="detail-item full-width">
                      <span className="detail-label">Description:</span>
                      <p className="book-description">{book.description}</p>
                    </div>
                  )}
                </div>
                
                <div className="book-card-actions">
                  <button
                    onClick={() => onEdit(book)}
                    className="btn btn-small btn-secondary"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => onDelete(book.id)}
                    className="btn btn-small btn-danger"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-small btn-secondary"
              >
                ⬅️ Previous
              </button>
              
              <div className="page-numbers">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`btn btn-small ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-small btn-secondary"
              >
                Next ➡️
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookList;