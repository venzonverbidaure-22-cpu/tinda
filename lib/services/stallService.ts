import axios from 'axios';

const API_URL = 'http://localhost:3001/api/stalls';

export const getStallsByVendor = async (vendorId: number) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await axios.get(`${API_URL}/vendor/${vendorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching vendor stalls:', error);
    throw error;
  }
};

export const getStallById = async (stallId: number) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await axios.get(`${API_URL}/${stallId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stall:', error);
    throw error;
  }
};

export const updateStallStatus = async (stallId: number, status: 'active' | 'inactive') => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await axios.patch(
      `${API_URL}/${stallId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating stall status:', error);
    throw error;
  }
};
