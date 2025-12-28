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
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
};

// Reading List API
export const readingListAPI = {
  getAll: () => api.get('/reading-list'),
  add: (data) => api.post('/reading-list', data),
  update: (id, data) => api.put(`/reading-list/${id}`, data),
  delete: (id) => api.delete(`/reading-list/${id}`),
};

// Reviews API
export const reviewsAPI = {
  createOrUpdate: (data) => api.post('/reviews', data),
  getByBook: (bookId) => api.get(`/reviews/book/${bookId}`),
  getUserReviews: () => api.get('/reviews/user'),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Custom Lists API
export const customListsAPI = {
  getAll: () => api.get('/custom-lists'),
  create: (data) => api.post('/custom-lists', data),
  update: (id, data) => api.put(`/custom-lists/${id}`, data),
  delete: (id) => api.delete(`/custom-lists/${id}`),
};

export default api;

