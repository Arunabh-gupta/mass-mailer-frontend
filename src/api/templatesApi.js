import { apiClient } from './client';
import { apiRequest } from './request';

export const templatesApi = {
  list: (options = {}) =>
    apiRequest(
      async () => {
        const response = await apiClient.get('/email_template');
        return response.data;
      },
      'Failed to load email templates',
      options,
    ),

  get: (templateId) =>
    apiRequest(
      async () => {
        const response = await apiClient.get(`/email_template/${templateId}`);
        return response.data;
      },
      'Failed to load template details',
    ),

  create: (payload) =>
    apiRequest(
      async () => {
        const response = await apiClient.post('/email_template', payload);
        return response.data;
      },
      'Failed to create template',
    ),

  update: (templateId, payload) =>
    apiRequest(
      async () => {
        const response = await apiClient.put(`/email_template/${templateId}`, payload);
        return response.data;
      },
      'Failed to update template',
    ),

  remove: (templateId) =>
    apiRequest(
      async () => {
        await apiClient.delete(`/email_template/${templateId}`);
        return true;
      },
      'Failed to delete template',
      { suppressGlobalError: true },
    ),
};
