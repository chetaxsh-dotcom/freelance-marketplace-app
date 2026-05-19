import axios from "axios";

//  SMART: Use localhost in development, render in production
const isDevelopment = import.meta.env.MODE === 'development';

const baseURL = isDevelopment 
  ? 'http://localhost:5000/api'  // ← Development
  : 'https://freelance-marketplace-app.onrender.com/api';  // ← Production

console.log('🌐 API Base URL:', baseURL);

const API = axios.create({
  baseURL: baseURL
});

// AUTO ADD TOKEN
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;