import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Users ────────────────────────────────────────────────────────────────────
export const getUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// ─── Categories ───────────────────────────────────────────────────────────────
export const getCategories = () => api.get('/categories');
export const getCategoryById = (id) => api.get(`/categories/${id}`);
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// ─── Menu Items ───────────────────────────────────────────────────────────────
export const getMenuItems = () => api.get('/menu-items');
export const getMenuItemById = (id) => api.get(`/menu-items/${id}`);
export const createMenuItem = (data) => api.post('/menu-items', data);
export const updateMenuItem = (id, data) => api.put(`/menu-items/${id}`, data);
export const deleteMenuItem = (id) => api.delete(`/menu-items/${id}`);

// ─── Orders ───────────────────────────────────────────────────────────────────
export const getOrders = () => api.get('/orders');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const createOrder = (data) => api.post('/orders', data);
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

export default api;
