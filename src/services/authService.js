import api from './api';

export const registerPersonnel = async (userData) => {
  const response = await api.post('/auth/register', userData);
  // Persist if it returns credentials, but usually registration might not automatically log in.
  // We'll persist if there's an accessToken or user info in the response.
  if (response.data && response.data.accessToken) {
    localStorage.setItem('safeharbor_user', JSON.stringify(response.data));
    localStorage.setItem('safeharbor_jwt_token', response.data.accessToken);
  }
  return response.data;
};

export const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data) {
    localStorage.setItem('safeharbor_user', JSON.stringify(response.data));
    if (response.data.accessToken) {
      localStorage.setItem('safeharbor_jwt_token', response.data.accessToken);
    }
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('safeharbor_user');
  localStorage.removeItem('safeharbor_jwt_token');
};
