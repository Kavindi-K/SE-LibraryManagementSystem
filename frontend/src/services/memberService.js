import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const memberAPI = axios.create({
  baseURL: `${API_BASE_URL}/members`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to handle errors
memberAPI.interceptors.request.use(
  (config) => {
    console.log('Making API request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
memberAPI.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.status);
    return response;
  },
  (error) => {
    console.error('API error:', error);
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('Backend server is not running or not accessible');
    }
    return Promise.reject(error);
  }
);

export const memberService = {
  // Get all members
  getAllMembers: () => memberAPI.get('/'),

  // Get member by ID
  getMemberById: (id) => memberAPI.get(`/${id}`),

  // Create new member
  createMember: (memberData) => memberAPI.post('/', memberData),

  // Update member
  updateMember: (id, memberData) => memberAPI.put(`/${id}`, memberData),

  // Delete member
  deleteMember: (id) => memberAPI.delete(`/${id}`),

  // Search members
  searchMembers: (searchTerm) => memberAPI.get(`/search?q=${encodeURIComponent(searchTerm)}`),

  // Get members by type
  getMembersByType: (type) => memberAPI.get(`/type/${type}`),

  // Get active members
  getActiveMembers: () => memberAPI.get('/active'),

  // Get membership types
  getMembershipTypes: () => memberAPI.get('/membership-types'),
};
