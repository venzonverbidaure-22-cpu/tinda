import axios from 'axios';

const API_URL = 'http://localhost:3001/api/orders';

export const getVendorOrders = async (params: any) => {
  try {
    const response = await axios.get(`${API_URL}/vendor`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    throw error;
  }
};

export const getVendorOrderStats = async (stallId: number) => {
  try {
    const response = await axios.get(`${API_URL}/stats`, { params: { stallId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching vendor order stats:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  try {
    const response = await axios.patch(`${API_URL}/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
