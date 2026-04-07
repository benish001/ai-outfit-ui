import axios from 'axios';

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8001/api/v1'
  : 'https://skintoneai-api.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if 401 error and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          // Use a clean axios call for refresh to avoid interceptor recursion
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refresh_token: refreshToken });
          const { access_token, refresh_token: newRefreshToken, ...userData } = res.data;
          
          localStorage.setItem('token', access_token);
          localStorage.setItem('refresh_token', newRefreshToken);
          localStorage.setItem('user', JSON.stringify(userData));
          
          processQueue(null, access_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          localStorage.clear();
          window.location.reload();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
