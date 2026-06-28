import api from './api';

export const getAllPersonnel = async (params) => {
  const response = await api.get('/auth/personnel', { params });
  return response.data;
};

export const deactivatePersonnel = async (id) => {
  const response = await api.delete(`/auth/personnel/${id}`);
  return response.data;
};
