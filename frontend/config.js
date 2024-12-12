export const API_URL = import.meta.env.MODE === 'production'
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:3000/api';
