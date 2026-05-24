import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || '';
const API_BASE = `${BASE_URL}/api/auth`;

export const login = (data) =>
  axios.post(`${API_BASE}/login`, data).then((r) => r.data);

export const register = (data) =>
  axios.post(`${API_BASE}/register`, data).then((r) => r.data);

export const getMe = (token) =>
  axios
    .get(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${token}` } })
    .then((r) => r.data);
