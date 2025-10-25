import React, { useState, useMemo } from 'react';
import './AdminTheme.css';

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
        book.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.bookNo.toLowerCase().includes(searchTerm.toLowerCase());
      
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

  const getSortIcon = () => '';

  if (loading && books.length === 0) {
    return (
      <div style={{ maxWidth: '1400px', margin: '20px auto', padding: '0 15px' }}>
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          Loading books...
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '20px auto', padding: '0 15px' }}>
      <div className="admin-form-header">
        <h2>Books Library ({filteredAndSortedBooks.length} books)</h2>
      </div>
      
      {/* Search and Filters */}
      <div className="admin-filters">
        <div className="admin-search-box">
          <input
            type="text"
            placeholder="Search books by title, author, genre, book no, or location..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="admin-search-input"
          />
        </div>
        
        <select
          value={filterAvailability}
          onChange={(e) => {
            setFilterAvailability(e.target.value);
            setCurrentPage(1);
          }}
          className="admin-filter-select"
        >
          <option value="all">All Books</option>
          <option value="available">Available Only</option>
          <option value="unavailable">Unavailable Only</option>
        </select>
      </div>

      {filteredAndSortedBooks.length === 0 ? (
        <div className="admin-text-center" style={{ padding: '60px 20px', color: 'var(--admin-gray-500)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--admin-gray-700)' }}>No books found</h3>
          <p style={{ margin: 0 }}>
            {searchTerm || filterAvailability !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Start by adding your first book to the library.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('bookNo')} style={{ cursor: 'pointer' }}>
                    Book No
                  </th>
                  <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                    Title
                  </th>
                  <th onClick={() => handleSort('author')} style={{ cursor: 'pointer' }}>
                    Author
                  </th>
                  <th onClick={() => handleSort('genre')} style={{ cursor: 'pointer' }}>
                    Genre
                  </th>
                  <th onClick={() => handleSort('year')} style={{ cursor: 'pointer' }}>
                    Year
                  </th>
                  <th onClick={() => handleSort('language')} style={{ cursor: 'pointer' }}>
                    Language
                  </th>
                  <th onClick={() => handleSort('availableCopies')} style={{ cursor: 'pointer' }}>
                    Copies
                  </th>
                  <th onClick={() => handleSort('availability')} style={{ cursor: 'pointer' }}>
                    Status
                  </th>
                  <th onClick={() => handleSort('location')} style={{ cursor: 'pointer' }}>
                    Location
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBooks.map((book) => (
                  <tr key={book.id}>
                    <td>
                      <span className="admin-badge admin-badge-primary">{book.bookNo}</span>
                    </td>
                    <td>
                      <div className="admin-flex admin-items-center admin-gap-md">
                        {book.image && (
                          <img 
                            src={book.image} 
                            alt={book.title}
                            style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: '600' }}>{book.title}</div>
                          {book.edition && (
                            <div style={{ fontSize: '12px', color: 'var(--admin-gray-500)' }}>({book.edition})</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{book.author}</td>
                    <td>
                      <span className="admin-badge admin-badge-info">{book.genre}</span>
                    </td>
                    <td>{book.year}</td>
                    <td>{book.language}</td>
                    <td>
                      <span style={{ fontWeight: '600', color: 'var(--admin-primary)' }}>{book.availableCopies}</span>
                    </td>
                    <td>
                      <span className={`admin-badge ${book.availability ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                        {book.availability ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge-secondary">{book.location}</span>
                    </td>
                    <td>
                      <div className="admin-flex admin-gap-sm">
                        <button
                          onClick={() => onEdit(book)}
                          className="admin-btn admin-btn-sm admin-btn-secondary"
                          title="Edit Book"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(book.id)}
                          className="admin-btn admin-btn-sm admin-btn-danger"
                          title="Delete Book"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin-flex admin-items-center admin-justify-between" style={{ marginTop: '30px' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="admin-btn admin-btn-sm admin-btn-secondary"
              >
                Previous
              </button>
              
              <div className="admin-flex admin-gap-sm">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`admin-btn admin-btn-sm ${currentPage === page ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="admin-btn admin-btn-sm admin-btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookList;