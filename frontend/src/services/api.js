import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

export const checkHealth = () => API.get('/health');
export const uploadImage = (formData) => API.post('/upload', formData);
export const getWebcamFeed = () => '/api/video_feed';