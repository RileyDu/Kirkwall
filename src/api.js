import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://kirkwall-demo.vercel.app/' // Replace with your production URL
    : 'https://kirkwall-demo.vercel.app/',
});

export default api;
