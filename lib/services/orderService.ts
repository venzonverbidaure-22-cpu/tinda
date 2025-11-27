import axios from 'axios';

const API_URL = 'http://localhost:3001/api/orders';

export const getVendorOrders = async (params: any) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await axios.get(`${API_URL}/vendor`, {
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
    const response = await axios.get(`${API_URL}/stats`, {
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
    const response = await axios.patch(`${API_URL}/${orderId}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
