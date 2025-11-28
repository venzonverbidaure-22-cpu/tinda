import axios from 'axios';
import { API_BASE_URL } from '../utils';

const API_URL = API_BASE_URL

export const getVendorOrders = async (params: any) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await axios(`${API_URL}/api/orders/vendor`, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    throw error;
  }
};

export const getVendorOrderStats = async (stallId: number) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/orders/stats`, {
      params: { stallId },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching vendor order stats:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await axios.patch(`${API_URL}/api/orders/${orderId}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
