import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://kirkwall-demo.vercel.app/' // Replace with your production URL
    : 'http://localhost:3000', // Replace with your development URL
});

export default api;
