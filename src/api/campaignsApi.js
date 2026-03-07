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

  listContacts: (campaignId) =>
    apiRequest(
      async () => {
        const response = await apiClient.get(`/campaigns/${campaignId}/contacts`);
        return response.data;
      },
      'Failed to load campaign recipients',
    ),

  send: (campaignId) =>
    apiRequest(
      async () => {
        const response = await apiClient.post(`/campaigns/${campaignId}/send`);
        return response.data;
      },
      'Failed to send campaign',
    ),
};
