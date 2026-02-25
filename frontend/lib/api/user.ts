import apiClient from '../api-client';

export interface UpdateProfileRequest {
  name: string;
  phone: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export const userApi = {
  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await apiClient.put('/users/profile', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest) => {
    const response = await apiClient.put('/users/password', data);
    return response.data;
  },
};
