import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
      const userStr = localStorage.getItem('safeharbor_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user && user.accessToken) {
            config.headers['Authorization'] = `Bearer ${user.accessToken}`;
          }
        } catch (e) {
          console.error('Error parsing user from localStorage', e);
        }
      } else {
        const token = localStorage.getItem('safeharbor_jwt_token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('safeharbor_user');
      localStorage.removeItem('safeharbor_jwt_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
