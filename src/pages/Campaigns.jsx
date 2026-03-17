import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { campaignsApi, templatesApi } from '../api';
import Alert from '../components/Alert';
import ConfirmModal from '../components/ConfirmModal';
import { useUiStore } from '../store/uiStore';

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'sending':
      return 'bg-blue-100 text-blue-700';
    case 'draft':
      return 'bg-gray-100 text-gray-700';
    case 'failed':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const formatDate = (isoDate) => {
  if (!isoDate) {
    return '-';
  }
  return new Date(isoDate).toLocaleDateString();
};

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [sendingCampaignId, setSendingCampaignId] = useState(null);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [deletingCampaignId, setDeletingCampaignId] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const loading = useUiStore((state) => state.loading);
  const error = useUiStore((state) => state.error);
  const clearError = useUiStore((state) => state.clearError);

  useEffect(() => {
    const loadCampaigns = async () => {
      const [campaignsResult, templatesResult] = await Promise.all([
        campaignsApi.list(),
        templatesApi.list(),
      ]);
      const baseCampaigns = campaignsResult.data || [];
      const templates = templatesResult.data || [];
      const templateNameById = new Map(
        templates.map((template) => [String(template.id), template.name]),
      );
      const contactsResults = await Promise.all(
        baseCampaigns.map((campaign) => campaignsApi.listContacts(campaign.id)),
      );

      const campaignRows = baseCampaigns.map((campaign, index) => {
        const campaignContacts = contactsResults[index].data || [];
        const sentCount = campaignContacts.filter((item) => item.status === 'sent').length;
        return {
          ...campaign,
          template_name: templateNameById.get(String(campaign.template_id)) || 'Unknown template',
          sent: sentCount,
          total: campaignContacts.length,
        };
      });

      setCampaigns(campaignRows);
    };

    loadCampaigns();
  }, []);

  const filteredCampaigns = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) {
      return campaigns;
    }

    return campaigns.filter((campaign) =>
      `${campaign.id} ${campaign.template_name} ${campaign.status}`.toLowerCase().includes(query),
    );
  }, [campaigns, searchText]);

  const handleSendCampaign = async (campaignId) => {
    setSendingCampaignId(campaignId);
    setCampaigns((previous) =>
      previous.map((campaign) =>
        campaign.id === campaignId
          ? {
              ...campaign,
              status: 'sending',
            }
          : campaign,
      ),
    );

    const sendResult = await campaignsApi.send(campaignId);
    setSendingCampaignId(null);

    if (!sendResult.data) {
      setCampaigns((previous) =>
        previous.map((campaign) =>
          campaign.id === campaignId
            ? {
                ...campaign,
                status: 'draft',
              }
            : campaign,
        ),
      );
      return;
    }

    setCampaigns((previous) =>
      previous.map((campaign) =>
        campaign.id === campaignId
          ? {
              ...campaign,
              status: sendResult.data.status,
              sent: sendResult.data.sent_recipients,
              total: sendResult.data.total_recipients,
            }
          : campaign,
      ),
    );
  };

  const handleDeleteClick = (campaign) => {
    setDeleteError('');
    setCampaignToDelete(campaign);
  };

  const handleDeleteCancel = () => {
    if (deletingCampaignId) {
      return;
    }
    setDeleteError('');
    setCampaignToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!campaignToDelete?.id) {
      return;
    }

    setDeletingCampaignId(campaignToDelete.id);
    const result = await campaignsApi.remove(campaignToDelete.id);
    setDeletingCampaignId(null);

    if (result.data) {
      setCampaigns((previous) =>
        previous.filter((campaign) => String(campaign.id) !== String(campaignToDelete.id)),
      );
      setDeleteError('');
      setCampaignToDelete(null);
      return;
    }

    setDeleteError(typeof result.error === 'string' ? result.error : 'Failed to delete campaign');
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        <Link
          to="/campaigns/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Create Campaign
        </Link>
      </div>

      <Alert message={error} onClose={clearError} />

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-6">
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search campaigns..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <p className="p-6 text-sm text-gray-600">Loading campaigns...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Campaign ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Template</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Progress</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-500" colSpan={6}>
                      No campaigns found
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((campaign) => {
                    const canDelete = campaign.status !== 'sending';
                    const canSend = campaign.status === 'draft';
                    const isSendingCurrent = sendingCampaignId === campaign.id;
                    const isDeletingCurrent = deletingCampaignId === campaign.id;

                    return (
                      <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{campaign.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{campaign.template_name}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded px-2 py-1 text-xs ${getStatusColor(campaign.status)}`}
                          >
                            {capitalize(campaign.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {campaign.sent} / {campaign.total}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(campaign.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/campaigns/${campaign.id}/edit`}
                              state={{ campaign }}
                              className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                            >
                              Edit Campaign
                            </Link>
                            <button
                              type="button"
                              disabled={!canDelete || isSendingCurrent || isDeletingCurrent}
                              onClick={() => handleDeleteClick(campaign)}
                              className="text-sm font-medium text-red-600 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:text-gray-300"
                            >
                              {isDeletingCurrent ? 'Deleting...' : 'Delete'}
                            </button>
                            <button
                              type="button"
                              disabled={!canSend || isSendingCurrent || isDeletingCurrent}
                              onClick={() => handleSendCampaign(campaign.id)}
                              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                              {isSendingCurrent ? 'Sending...' : 'Send'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(campaignToDelete)}
        title="Delete campaign?"
        message={
          campaignToDelete
            ? `This will permanently delete campaign "${campaignToDelete.id}" and its recipient progress. Sending campaigns cannot be deleted.`
            : ''
        }
        errorMessage={deleteError}
        confirmLabel="Delete Campaign"
        confirmTone="danger"
        busy={Boolean(deletingCampaignId)}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
