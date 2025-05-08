import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const profiles = {
  getMyprofile: () => api.get('profiles/getmyprofiles'),
  getAll: () => api.get('/profiles'),
  create: (profileData) => api.post('/auth/create-profile', profileData),
  update: (id, profileData) => api.patch(`/profiles/${id}`, profileData),
  delete: (id) => api.delete(`/profiles/${id}`),
};

export const movies = {
  getAll: (params) => api.get('/movies', { params }),
  getById: (id) => api.get(`/movies/${id}`),
  create: (movieData) => api.post('/movies', movieData),
  update: (id, movieData) => api.patch(`/movies/${id}`, movieData),
  delete: (id) => api.delete(`/movies/${id}`),
};

export const watchlist = {
  getByProfile: (profileId) => api.get(`/profiles/${profileId}/watchlist`),
  add: (profileId, movieId) => api.post(`/profiles/${profileId}/watchlist`, { movieId }),
  remove: (profileId, movieId) => api.delete(`/profiles/${profileId}/watchlist/${movieId}`),
};

export default api;
