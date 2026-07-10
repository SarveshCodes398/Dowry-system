import axios from 'axios';

// Create axios instance with base URL
// For production: Set REACT_APP_API_URL in Vercel environment variables
// For development: Uses localhost:5000
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return Promise.reject(error.response.data || { message: 'Server error' });
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('No response received from server'));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(new Error(error.message));
    }
  }
);

// API endpoints
export const API_ENDPOINTS = {
  UPLOAD: '/api/upload',
  PREDICT: '/api/predict',
  HISTORY: '/api/history',
  STATS: '/api/stats',
  HEALTH: '/',
};

// Upload image for dowry prediction
export const uploadImage = async (imageFile, gender, name = '') => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('gender', gender);
    if (name) {
      formData.append('name', name);
    }

    const response = await api.post(API_ENDPOINTS.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get dowry prediction directly
export const getPrediction = async (appearanceScore, gender, name = '') => {
  try {
    const response = await api.post(API_ENDPOINTS.PREDICT, {
      appearanceScore,
      gender,
      name,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get prediction history
export const getHistory = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.HISTORY);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get statistics
export const getStats = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.STATS);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Check API health
export const checkHealth = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.HEALTH);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
