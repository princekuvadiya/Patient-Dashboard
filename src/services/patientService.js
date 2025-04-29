import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const createAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { headers: { 'x-auth-token': token } };
};

const patientService = {
  async addWeightEntry(weightData) {
    try {
      const response = await axios.post(
        `${API_URL}/patient/weight`,
        weightData,
        createAuthHeaders()
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add weight'
      };
    }
  },

  async getWeightHistory() {
    try {
      const response = await axios.get(
        `${API_URL}/patient/weight`,
        createAuthHeaders()
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, data: [] };
    }
  },

  async getShipments() {
    try {
      const response = await axios.get(
        `${API_URL}/patient/shipments`,
        createAuthHeaders()
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, data: [] };
    }
  },

  async addShipment(shipmentData) {
    try {
      const response = await axios.post(
        `${API_URL}/patient/shipments`,
        shipmentData,
        createAuthHeaders()
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add shipment'
      };
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await axios.put(
        `${API_URL}/patient/profile`,
        profileData,
        createAuthHeaders()
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Update failed'
      };
    }
  },

  async seedData() {
    try {
      const response = await axios.post(
        `${API_URL}/patient/seed`,
        {},
        createAuthHeaders()
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to seed data'
      };
    }
  }
};

export default patientService;