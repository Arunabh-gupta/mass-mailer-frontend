import { apiClient } from './client';
import { apiRequest } from './request';

export const contactsApi = {
  list: () =>
    apiRequest(
      async () => {
        const response = await apiClient.get('/contacts');
        return response.data;
      },
      'Failed to load contacts',
    ),
};
