import api from './api';

export const reportIncident = async (data) => {
  const response = await api.post('/incidents', data);
  return response.data;
};

export const getIncidents = async (params) => {
  const response = await api.get('/incidents', { params });
  return response.data;
};

export const updateIncidentStatus = async (id, status) => {
  const response = await api.patch(`/incidents/${id}/status`, null, {
    params: { status }
  });
  return response.data;
};

export const deleteIncident = async (id) => {
  const response = await api.delete(`/incidents/${id}`);
  return response.data;
};

export const updateIncident = async (id, data) => {
  const response = await api.put(`/incidents/${id}`, data);
  return response.data;
};
