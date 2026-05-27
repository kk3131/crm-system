import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api',
});

export const getMembers      = () => API.get('/members');
export const addMember       = (data) => API.post('/members', data);
export const updateMember    = (id, data) => API.put(`/members/${id}`, data);
export const deleteMember    = (id) => API.delete(`/members/${id}`);
export const getTransactions = () => API.get('/transactions');
export const addTransaction  = (data) => API.post('/transactions', data);
export const getRFM          = () => API.get('/rfm');
export const sendNotify      = (id, data) => API.post(`/notify/${id}`, data);
export const getProducts    = () => API.get('/products');
export const addProduct     = (data) => API.post('/products', data);
export const updateProduct  = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct  = (id) => API.delete(`/products/${id}`);