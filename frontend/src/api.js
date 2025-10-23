// Production-ready API configuration
const getBaseURL = () => {
  // In production (Vercel), use the environment variable
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL || 'https://your-railway-backend.railway.app/api';
  }
  // In development, use the proxy
  return '/api';
};

const BASE = getBaseURL();

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  // ===== BOOKS API =====
  // Book CRUD operations
  listBooks: () => request('/books'),
  getBook: (id) => request(`/books/${id}`),
  createBook: (data) => request('/books', { method: 'POST', body: JSON.stringify(data) }),
  updateBook: (id, data) => request(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBook: (id) => request(`/books/${id}`, { method: 'DELETE' }),
  
  // Book search and filtering
  searchBooks: (query) => request(`/books/search?query=${encodeURIComponent(query)}`),
  searchBooksByTitle: (title) => request(`/books/search/title?title=${encodeURIComponent(title)}`),
  searchBooksByAuthor: (author) => request(`/books/search/author?author=${encodeURIComponent(author)}`),
  searchBooksByGenre: (genre) => request(`/books/search/genre?genre=${encodeURIComponent(genre)}`),
  
  // Book filtering
  getBooksByAvailability: (availability) => request(`/books/availability/${availability}`),
  getBooksByLanguage: (language) => request(`/books/language/${language}`),
  getBooksByYear: (year) => request(`/books/year/${year}`),
  getBooksByLocation: (location) => request(`/books/location/${location}`),
  getBooksByYearRange: (startYear, endYear) => request(`/books/year-range?startYear=${startYear}&endYear=${endYear}`),
  getBooksWithMinimumCopies: (minCopies) => request(`/books/minimum-copies?minCopies=${minCopies}`),
  getBooksWithAvailableCopies: () => request('/books/available-copies'),
  
  // Book statistics
  getBookStats: () => request('/books/stats'),

  // ===== USERS API =====
  // User CRUD operations
  listUsers: () => request('/users'),
  getUser: (id) => request(`/users/${id}`),
  getUserByUsername: (username) => request(`/users/username/${username}`),
  getUserByEmail: (email) => request(`/users/email/${email}`),
  createUser: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  
  // User authentication
  loginUser: (data) => request('/users/login', { method: 'POST', body: JSON.stringify(data) }),
  changePassword: (id, data) => request(`/users/${id}/change-password`, { method: 'PUT', body: JSON.stringify(data) }),
  forgotPassword: (data) => request('/users/password/forgot', { method: 'POST', body: JSON.stringify(data) }),
  resetPassword: (data) => request('/users/password/reset', { method: 'POST', body: JSON.stringify(data) }),
  
  // User management
  activateUser: (id) => request(`/users/${id}/activate`, { method: 'PUT' }),
  deactivateUser: (id) => request(`/users/${id}/deactivate`, { method: 'PUT' }),
  getUsersByStatus: (status) => request(`/users/status/${status}`),
  searchUsers: (query) => request(`/users/search?query=${encodeURIComponent(query)}`),
  getUserStats: () => request('/users/stats'),

  // ===== MEMBERS API =====
  // Member CRUD operations
  listMembers: () => request('/members'),
  getMember: (id) => request(`/members/${id}`),
  getMemberByMemberId: (memberId) => request(`/members/member-id/${memberId}`),
  getMemberByUserId: (userId) => request(`/members/user/${userId}`),
  createMember: (data) => request('/members', { method: 'POST', body: JSON.stringify(data) }),
  createMemberFromUser: (userId, firstName, lastName, email) => request(`/members/auto-create?userId=${userId}&firstName=${firstName}&lastName=${lastName}&email=${email}`, { method: 'POST' }),
  updateMember: (id, data) => request(`/members/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMember: (id) => request(`/members/${id}`, { method: 'DELETE' }),
  
  // Member management
  suspendMember: (id) => request(`/members/${id}/suspend`, { method: 'PUT' }),
  activateMember: (id) => request(`/members/${id}/activate`, { method: 'PUT' }),
  getMembersByMembershipType: (membershipType) => request(`/members/membership-type/${membershipType}`),
  getMembersByStatus: (status) => request(`/members/status/${status}`),
  searchMembers: (query) => request(`/members/search?query=${encodeURIComponent(query)}`),
  
  // Member statistics
  getTotalMembersCount: () => request('/members/stats/total'),
  getMemberCountByMembershipType: (membershipType) => request(`/members/stats/membership-type/${membershipType}`),
  getMemberCountByStatus: (status) => request(`/members/stats/status/${status}`),
  getMembersExpiringBefore: (date) => request(`/members/expiring?date=${date}`),
  getMembersWithFines: () => request('/members/with-fines'),

  // ===== BORROWINGS API =====
  listBorrowings: (params) => request(`/borrowings${params?.memberId ? `?memberId=${encodeURIComponent(params.memberId)}` : ''}`),
  createBorrowing: (data) => request('/borrowings', { method: 'POST', body: JSON.stringify(data) }),
  updateBorrowing: (id, data) => request(`/borrowings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  returnBorrowing: (id) => request(`/borrowings/${id}/return`, { method: 'POST' }),
  deleteBorrowing: (id) => request(`/borrowings/${id}`, { method: 'DELETE' }),

  // ===== RESERVATIONS API =====
  listReservations: (params) => request(`/reservations${params?.memberId ? `?memberId=${encodeURIComponent(params.memberId)}` : ''}`),
  createReservation: (data) => request('/reservations', { method: 'POST', body: JSON.stringify(data) }),
  updateReservation: (id, data) => request(`/reservations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  receiveReservation: (id) => request(`/reservations/${id}/receive`, { method: 'POST' }),
  deleteReservation: (id) => request(`/reservations/${id}`, { method: 'DELETE' }),
}


