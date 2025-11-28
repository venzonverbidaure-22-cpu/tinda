import axios from 'axios';
import { API_BASE_URL } from '../utils';

const API_URL = API_BASE_URL

export const getStallsByVendor = async (vendorId: number) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/stalls/vendor/${vendorId}`, {
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
    const response = await axios.get(`${API_URL}/api/stalls/${stallId}`, {
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
      `${API_URL}/api/stalls/${stallId}`,
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
