import apiClient from '../api-client';

export interface Category {
  id: number;
  name: string;
  createdAt: string;
}

export const categoryApi = {
  getCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data.data as Category[];
  },

  getCategory: async (id: number) => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data.data as Category;
  },

  createCategory: async (name: string) => {
    const response = await apiClient.post('/admin/categories', { name });
    return response.data.data;
  },

  updateCategory: async (id: number, name: string) => {
    const response = await apiClient.put(`/admin/categories/${id}`, { name });
    return response.data.data;
  },

  deleteCategory: async (id: number) => {
    const response = await apiClient.delete(`/admin/categories/${id}`);
    return response.data;
  },
};
