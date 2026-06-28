import api from './api';

export const getInventory = async (params) => {
  const response = await api.get('/inventory', { params });
  return response.data;
};

export const addInventoryItem = async (data) => {
  const response = await api.post('/inventory', data);
  return response.data;
};

export const updateInventoryStock = async (id, quantity) => {
  const response = await api.patch(`/inventory/${id}/stock`, null, {
    params: { quantity }
  });
  return response.data;
};
