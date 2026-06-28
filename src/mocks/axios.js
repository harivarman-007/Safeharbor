const mockAxios = {
  create: () => mockAxios,
  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} },
  },
  get: () => Promise.resolve({ data: [] }),
  post: () => Promise.resolve({ data: {} }),
  put: () => Promise.resolve({ data: {} }),
  patch: () => Promise.resolve({ data: {} }),
  delete: () => Promise.resolve({ data: {} }),
};

export default mockAxios;
