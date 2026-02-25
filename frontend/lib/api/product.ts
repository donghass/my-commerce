import apiClient from '../api-client';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: number;
  categoryName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductSearchParams {
  keyword?: string;
  categoryId?: number;
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const productApi = {
  getProducts: async (params?: ProductSearchParams) => {
    const response = await apiClient.get('/products', { params });
    return response.data.data as PageResponse<Product>;
  },

  getProduct: async (id: number) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data.data as Product;
  },

  searchProducts: async (keyword: string, params?: ProductSearchParams) => {
    const response = await apiClient.get('/products/search', {
      params: { keyword, ...params },
    });
    return response.data.data as PageResponse<Product>;
  },

  createProduct: async (data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
    categoryId: number;
  }) => {
    const response = await apiClient.post('/admin/products', data);
    return response.data.data;
  },

  updateProduct: async (id: number, data: Partial<Product>) => {
    const response = await apiClient.put(`/admin/products/${id}`, data);
    return response.data.data;
  },

  deleteProduct: async (id: number) => {
    const response = await apiClient.delete(`/admin/products/${id}`);
    return response.data;
  },
};
