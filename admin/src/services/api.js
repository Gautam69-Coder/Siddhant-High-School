import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
export const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shs_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format errors and handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if expired or invalid
      localStorage.removeItem('shs_admin_token');
      if (window.location.pathname !== '/admin/login' && window.location.pathname !== '/login') {
        window.location.href = '/admin/login';
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0] ||
      error.message ||
      'A network error occurred. Please try again.';

    return Promise.reject(new Error(message));
  }
);

/**
 * Helper to build an absolute URL for uploaded files
 * @param {string} relativePath
 * @returns {string}
 */
export const getFileUrl = (relativePath) => {
  if (!relativePath) return '';
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return `${SERVER_BASE_URL}${cleanPath}`;
};

export default api;
