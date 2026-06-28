import api from './api';

export const getShelters = async (params) => {
  const response = await api.get('/shelters', { params });
  return response.data;
};

export const registerShelter = async (data) => {
  const response = await api.post('/shelters', data);
  return response.data;
};

export const adjustShelterOccupancy = async (id, intakeCount) => {
  const response = await api.patch(`/shelters/${id}/occupancy`, null, {
    params: { intakeCount }
  });
  return response.data;
};
