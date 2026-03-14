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

  get: (contactId) =>
    apiRequest(
      async () => {
        const response = await apiClient.get(`/contacts/${contactId}`);
        return response.data;
      },
      'Failed to load contact details',
    ),

  create: (payload) =>
    apiRequest(
      async () => {
        const response = await apiClient.post('/contacts', payload);
        return response.data;
      },
      'Failed to create contact',
    ),

  update: (contactId, payload) =>
    apiRequest(
      async () => {
        const response = await apiClient.put(`/contacts/${contactId}`, payload);
        return response.data;
      },
      'Failed to update contact',
    ),
};
