import { apiClient } from './client';
import { apiRequest } from './request';

export const contactsApi = {
  list: (params = {}, options = {}) =>
    apiRequest(
      async () => {
        const response = await apiClient.get('/contacts', { params });
        return response.data;
      },
      'Failed to load contacts',
      options,
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

  importCsv: (file) =>
    apiRequest(
      async () => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post('/contacts/import', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      },
      'Failed to import contacts',
      { suppressGlobalError: true, suppressGlobalLoading: true },
    ),

  update: (contactId, payload) =>
    apiRequest(
      async () => {
        const response = await apiClient.put(`/contacts/${contactId}`, payload);
        return response.data;
      },
      'Failed to update contact',
    ),

  remove: (contactId) =>
    apiRequest(
      async () => {
        await apiClient.delete(`/contacts/${contactId}`);
        return true;
      },
      'Failed to delete contact',
      { suppressGlobalError: true },
    ),
};
