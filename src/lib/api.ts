import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
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
  getSozdikWords: () =>
    api.get('/modules/sozdik/words').then((r) => r.data as { word: string; meanings: string[] }[]),
};

export const progressApi = {
  getAll: () => api.get('/progress').then((r) => r.data),
  update: (moduleSlug: string, completed: number) =>
    api.post(`/progress/${moduleSlug}`, { completed }).then((r) => r.data),
};

export const usersApi = {
  me: () => api.get('/users/me').then((r) => r.data),
  getAll: () => api.get('/users').then((r) => r.data),
  create: (data: { email: string; password: string; name?: string; role?: 'USER' | 'ADMIN' }) =>
    api.post('/users', data).then((r) => r.data),
  update: (id: string, data: { email?: string; name?: string; role?: 'USER' | 'ADMIN'; password?: string }) =>
    api.patch(`/users/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/users/${id}`).then((r) => r.data),
};

export default api;
