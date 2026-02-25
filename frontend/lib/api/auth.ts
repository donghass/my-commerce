import apiClient from '../api-client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface AuthResponse {
  userId: number;
  email: string;
  name: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data.data;
  },

  signup: async (data: SignupRequest) => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  refresh: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data.data;
  },
};
