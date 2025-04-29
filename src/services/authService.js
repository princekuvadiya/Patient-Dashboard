// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const authService = {
//   async login(email, password) {
//     const response = await axios.post(`${API_URL}/auth/login`, { email, password });
//     return response.data;
//   },

//   async register(userData) {
//     const response = await axios.post(`${API_URL}/auth/register`, userData);
//     return response.data;
//   },

//   async getCurrentUser() {
//     const token = localStorage.getItem('token');
//     const response = await axios.get(`${API_URL}/auth/me`, {
//       headers: {
//         'x-auth-token': token
//       }
//     });
//     return response.data;
//   }
// };

// export default authService;

// authService.js
// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const authService = {
//   async login(email, password) {
//     try {
//       const response = await axios.post(`${API_URL}/auth/login`, { email, password });
//       return { success: true, data: response.data };
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Login failed' 
//       };
//     }
//   },

//   async register(userData) {
//     try {
//       const response = await axios.post(`${API_URL}/auth/register`, userData);
//       return { success: true, data: response.data };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Registration failed'
//       };
//     }
//   },

//   async getCurrentUser() {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${API_URL}/auth/me`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       return { success: true, data: response.data };
//     } catch (error) {
//       return { success: false, message: 'Session expired' };
//     }
//   }
// };

// export default authService;

import axios from 'axios';

const API_URL ='http://localhost:5000/api';

const handleResponse = (response) => {
  if (response.data.token) {
    return {
      success: true,
      data: {
        token: response.data.token,
        user: response.data.user
      }
    };
  }
  return { success: false, message: response.data.message };
};

const handleError = (error) => ({
  success: false,
  message: error.response?.data?.message || 'An unexpected error occurred'
});

const authService = {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { success: false };
      
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { 'x-auth-token': token }
      });
      
      return { 
        success: true,
        data: {
          ...response.data,
          bmi: response.data.bmi,
          progressPercentage: response.data.progressPercentage
        }
      };
    } catch (error) {
      return handleError(error);
    }
  }
};

export default authService;