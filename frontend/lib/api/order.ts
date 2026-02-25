import apiClient from '../api-client';

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  amount: number;
}

export interface Order {
  orderId: number;
  userId: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

export const orderApi = {
  createOrder: async () => {
    const response = await apiClient.post('/orders');
    return response.data.data as Order;
  },

  getOrders: async () => {
    const response = await apiClient.get('/orders');
    return response.data.data as Order[];
  },

  getOrder: async (id: number) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data.data as Order;
  },

  cancelOrder: async (id: number) => {
    const response = await apiClient.post(`/orders/${id}/cancel`);
    return response.data.data;
  },

  // Admin APIs
  getAllOrders: async () => {
    const response = await apiClient.get('/admin/orders');
    return response.data.data as Order[];
  },

  updateOrderStatus: async (
    id: number,
    status: Order['status']
  ) => {
    const response = await apiClient.patch(`/admin/orders/${id}/status`, {
      status,
    });
    return response.data.data;
  },
};
