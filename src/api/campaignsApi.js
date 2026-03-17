import { apiClient } from './client';
import { apiRequest } from './request';

export const campaignsApi = {
  list: () =>
    apiRequest(
      async () => {
        const response = await apiClient.get('/campaigns');
        return response.data;
      },
      'Failed to load campaigns',
    ),

  get: (campaignId) =>
    apiRequest(
      async () => {
        const response = await apiClient.get(`/campaigns/${campaignId}`);
        return response.data;
      },
      'Failed to load campaign details',
    ),

  listContacts: (campaignId) =>
    apiRequest(
      async () => {
        const response = await apiClient.get(`/campaigns/${campaignId}/contacts`);
        return response.data;
      },
      'Failed to load campaign recipients',
    ),

  create: (payload) =>
    apiRequest(
      async () => {
        const response = await apiClient.post('/campaigns', payload);
        return response.data;
      },
      'Failed to create campaign',
    ),

  update: (campaignId, payload) =>
    apiRequest(
      async () => {
        const response = await apiClient.put(`/campaigns/${campaignId}`, payload);
        return response.data;
      },
      'Failed to update campaign',
    ),

  remove: (campaignId) =>
    apiRequest(
      async () => {
        await apiClient.delete(`/campaigns/${campaignId}`);
        return true;
      },
      'Failed to delete campaign',
      { suppressGlobalError: true },
    ),

  send: (campaignId) =>
    apiRequest(
      async () => {
        const response = await apiClient.post(`/campaigns/${campaignId}/send`);
        return response.data;
      },
      'Failed to send campaign',
      { suppressGlobalLoading: true },
    ),
};
