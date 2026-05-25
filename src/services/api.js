import axios from 'axios';

const API_BASE_URL ='/api';

const api = axios.create({
  baseURL: API_BASE_URL,
   withCredentials: true,
});

// Add token and JSON content type to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers = config.headers || {};
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data && !(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

// Decode UTF-8 responses
api.interceptors.response.use((response) => {
  if (response.data && typeof response.data === 'string') {
    try {
      response.data = JSON.parse(response.data);
    } catch (e) {
      // Not JSON, leave as is
    }
  }
  return response;
});

// Auth Endpoints
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
};

// Patient Endpoints
export const patientAPI = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  update: (id, data) => api.put(`/patients/${id}`, data),
};

// Doctor Endpoints
export const doctorAPI = {
  getAll: () => api.get('/doctors'),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  getById: (id) => api.get(`/doctors/${id}`),
  delete: (id) => api.delete(`/doctors/${id}`),
  testDelete: (id) => api.delete(`/doctors/test-delete/${id}`), // Test endpoint
  deleteViaPost: (id) => api.post(`/doctors/delete/${id}`, {}, {
    headers: { 'X-HTTP-Method-Override': 'DELETE' }
  }), // Alternative delete method
};

// Dental Service Endpoints
export const dentalServiceAPI = {
  getAll: () => api.get('/services'),
  getAdmin: () => api.get('/services/admin'),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
  uploadImage: (data) => api.post('/services/upload', data),
};
// Post Endpoints
export const postAPI ={
  getAllPublished: () => api.get('/posts'),
  getAllActive: () => api.get('/posts/active'),
  getAllPromotion: () => api.get('/posts/promotion'),
  getAllAdmin: () => api.get('/posts/admin'),
  getById: (id) => api.get(`/posts/${id}`),
  uploadImage: (data) => api.post('/posts/upload', data),
  create: (data) => api.post('/posts',data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
};

// Appointment Endpoints
export const appointmentAPI = {
  getAll: () => api.get('/appointments'),
  create: (data) => api.post('/appointments', data),
  createAnonymous: (data) => api.post('/appointments/anonymous', data),
  getById: (id) => api.get(`/appointments/${id}`),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
  checkIn: (id) => api.post(`/appointments/${id}/checkin`),
  confirm: (id, data) => api.post(`/appointments/${id}/confirm`, data),
};

// Receptionist Endpoints
export const receptionistAPI = {
  getAll: () => api.get('/receptionists'),
  create: (data) => api.post('/receptionists', data),
  getById: (id) => api.get(`/receptionists/${id}`),
  update: (id, data) => api.put(`/receptionists/${id}`, data),
  delete: (id) => api.delete(`/receptionists/${id}`),
};

// Visit Endpoints
export const visitAPI = {
  getAll: () => api.get('/visits'),
  create: (data) => api.post('/visits', data),
  getById: (id) => api.get(`/visits/${id}`),
  update: (id, data) => api.put(`/visits/${id}`, data),
  getByDate: (filterDate) => api.get('/visits', { params: { filterDate } }),
};

// Notification Endpoints
export const notificationAPI = {
  send: (appointmentId, channel = 'email', template = 'default') =>
    api.post('/notifications/send', { appointmentId, channel, template }),
};

// Chat Endpoints
export const chatAPI = {
  sendMessage: (message) => api.post('/chat', { message }),
};

export default api;
