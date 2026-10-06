import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Redux store reference — injected from main.jsx after the store is created.
// This avoids circular imports while still letting the interceptor dispatch actions.
let _store = null;
export const injectStore = (store) => {
  _store = store;
};

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
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const requestUrl = error.config ? error.config.url || '' : '';
      const isAuthCall =
        requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

      if (!isAuthCall) {
        localStorage.removeItem('safeharbor_user');
        localStorage.removeItem('safeharbor_jwt_token');

        if (_store) {
          // Import the action dynamically to avoid circular dependency at module load time
          import('../store/slices/authSlice').then(({ logout }) => {
            _store.dispatch(logout());
          }).catch(() => {
            window.location.href = '/login';
          });
        } else {
          if (
            window.location.pathname !== '/login' &&
            window.location.pathname !== '/register'
          ) {
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;