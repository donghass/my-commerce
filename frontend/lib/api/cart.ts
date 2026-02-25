import apiClient from '../api-client';

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
}

export const cartApi = {
  getCart: async () => {
    const response = await apiClient.get('/carts');
    return response.data.data as Cart;
  },

  addToCart: async (productId: number, quantity: number = 1) => {
    const response = await apiClient.post('/carts/items', {
      productId,
      quantity,
    });
    return response.data.data as Cart;
  },

  updateCartItem: async (itemId: number, quantity: number) => {
    const response = await apiClient.patch(`/carts/items/${itemId}?quantity=${quantity}`);
    return response.data.data;
  },

  removeFromCart: async (itemId: number) => {
    const response = await apiClient.delete(`/carts/items/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await apiClient.delete('/carts');
    return response.data;
  },
};
