import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || '';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('dh_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const API_BASE = `${BASE_URL}/api/drugs`;

export const fetchDrugs = (params = {}) =>
  axios.get(API_BASE, { params }).then((r) => r.data);

export const fetchExpiringDrugs = (days = 30) =>
  axios.get(`${API_BASE}/expiring`, { params: { days } }).then((r) => r.data);

export const fetchDrug = (id) =>
  axios.get(`${API_BASE}/${id}`).then((r) => r.data);

export const createDrug = (data) =>
  axios.post(API_BASE, data).then((r) => r.data);

export const updateDrug = (id, data) =>
  axios.put(`${API_BASE}/${id}`, data).then((r) => r.data);

export const deleteDrug = (id) =>
  axios.delete(`${API_BASE}/${id}`).then((r) => r.data);
