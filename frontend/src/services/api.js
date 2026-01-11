// The "Don't Repeat Yourself" (DRY) Principle
// The "Single Responsibility" (SRP) Principle  
// Single Point of Maintenance
// Global Error Handling

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => { // global error handling
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => { // global error handling 
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

// Books API
export const booksAPI = {
  getAll: (params) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  delete: (id) => api.delete(`/books/${id}`),
};

// Reading List API
export const readingListAPI = {
  getAll: () => api.get('/reading-list'),
  add: (data) => api.post('/reading-list', data),
  update: (id, data) => api.put(`/reading-list/${id}`, data),
  delete: (id) => api.delete(`/reading-list/${id}`),
  updateProgress: (id, progress) => api.put(`/reading-list/${id}/progress`, { progress }),
  addNote: (id, note) => api.post(`/reading-list/${id}/notes`, note),
  export: (format) => api.get('/reading-list/export', { params: { format }, responseType: 'blob' }),
  exportNotes: (id) => api.get(`/reading-list/${id}/notes/export`, { responseType: 'blob' }),
};

// Reviews API
export const reviewsAPI = {
  createOrUpdate: (data) => api.post('/reviews', data),
  getByBook: (bookId) => api.get(`/reviews/book/${bookId}`),
  getUserReviews: () => api.get('/reviews/user'),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  like: (id) => api.post(`/reviews/${id}/like`),
};

// Custom Lists API
export const customListsAPI = {
  getAll: () => api.get('/custom-lists'),
  create: (data) => api.post('/custom-lists', data),
  update: (id, data) => api.put(`/custom-lists/${id}`, data),
  delete: (id) => api.delete(`/custom-lists/${id}`),
};

// Recommendations API
export const recommendationsAPI = {
  get: () => api.get('/recommendations'),
};

// Users API
export const usersAPI = {
  updateGoal: (data) => api.put('/users/goal', data),
  updateProfile: (data) => {
    // If data is FormData, let browser/axios set the Content-Type automatically (it includes boundary)
    // Otherwise it defaults to application/json
    return api.put('/users/profile', data, {
      headers: {
        'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json'
      }
    });
  },
  follow: (id) => api.post(`/users/follow/${id}`),
  unfollow: (id) => api.post(`/users/unfollow/${id}`),
  getProfile: (id) => api.get(`/users/profile/${id}`),
};

// Analytics API
export const analyticsAPI = {
  get: () => api.get('/analytics'),
};

// Summary API
export const summaryAPI = {
  getSummary: (data) => api.post('/summary', data),
};

export default api;

