import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
};

export const modulesApi = {
  getAll: () => api.get('/modules').then((r) => r.data),
  getQuestions: (slug: string, lang: string) =>
    api.get(`/modules/${slug}/questions`, { params: { lang } }).then((r) => r.data),
};

export const progressApi = {
  getAll: () => api.get('/progress').then((r) => r.data),
  update: (moduleSlug: string, completed: number) =>
    api.post(`/progress/${moduleSlug}`, { completed }).then((r) => r.data),
};

export const usersApi = {
  me: () => api.get('/users/me').then((r) => r.data),
};

export default api;
