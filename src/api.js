import axios from 'axios';

// כתובת הבקאנד — כל הבקשות ילכו לכאן
const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// הוספת Token אוטומטית לכל בקשה — אם המשתמש מחובר
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;