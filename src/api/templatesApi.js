import { apiClient } from './client';
import { apiRequest } from './request';

export const templatesApi = {
  list: () =>
    apiRequest(
      async () => {
        const response = await apiClient.get('/email_template');
        return response.data;
      },
      'Failed to load email templates',
    ),
};
