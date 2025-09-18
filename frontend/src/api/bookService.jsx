import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/books'; // Change API endpoint for books

// Get all books
export const getBooks = () => axios.get(BASE_URL);

// Get book by ID
export const getBookById = (id) => axios.get(`${BASE_URL}/${id}`);

// Create a new book
export const createBook = (book) =>
  axios.post(BASE_URL, book, {
    headers: { 'Content-Type': 'application/json' },
  });

// Update an existing book
export const updateBook = (id, book) =>
  axios.put(`${BASE_URL}/update/${id}`, book, {
    headers: { 'Content-Type': 'application/json' },
  });

// Delete a book
export const deleteBook = (id) => axios.delete(`${BASE_URL}/${id}`);
