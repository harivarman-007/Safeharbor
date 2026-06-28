import api from './api';

export const requestDispatch = async (data) => {
  const response = await api.post('/dispatches/request', data);
  return response.data;
};

export const getDispatches = async (params) => {
  const response = await api.get('/dispatches', { params });
  return response.data;
};

export const fulfillDispatch = async (id) => {
  const response = await api.post(`/dispatches/${id}/fulfill`);
  return response.data;
};
