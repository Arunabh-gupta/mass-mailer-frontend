import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { campaignsApi, templatesApi } from '../api';
import Alert from '../components/Alert';
import ConfirmModal from '../components/ConfirmModal';
import { useUiStore } from '../store/uiStore';

const CAMPAIGN_REFRESH_INTERVAL_MS = 4000;

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

const formatDateTime = (isoDate) => {
  if (!isoDate) {
    return '-';
  }
  return new Date(isoDate).toLocaleString();
};

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const getRecipientStatusColor = (status) => {
  switch (status) {
    case 'sent':
      return 'bg-green-100 text-green-700';
    case 'failed':
      return 'bg-red-100 text-red-700';
    case 'pending':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [sendingCampaignId, setSendingCampaignId] = useState(null);
  const [campaignActivity, setCampaignActivity] = useState(null);
  const [campaignActivityRows, setCampaignActivityRows] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState('');
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [deletingCampaignId, setDeletingCampaignId] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const loading = useUiStore((state) => state.loading);
  const error = useUiStore((state) => state.error);
  const clearError = useUiStore((state) => state.clearError);

  const loadCampaigns = async (options = {}) => {
    const { suppressGlobalLoading = false } = options;
    const [campaignsResult, templatesResult] = await Promise.all([
      campaignsApi.list({ suppressGlobalLoading }),
      templatesApi.list({ suppressGlobalLoading }),
    ]);
    const baseCampaigns = campaignsResult.data || [];
    const templates = templatesResult.data || [];
    const templateNameById = new Map(
      templates.map((template) => [String(template.id), template.name]),
    );

    const campaignRows = baseCampaigns.map((campaign) => ({
      ...campaign,
      template_name: templateNameById.get(String(campaign.template_id)) || 'Unknown template',
      sent: campaign.status_summary?.sent_recipients || 0,
      total: campaign.status_summary?.total_recipients || 0,
      failed: campaign.status_summary?.failed_recipients || 0,
      pending: campaign.status_summary?.pending_recipients || 0,
    }));

    setCampaigns(campaignRows);
    return campaignRows;
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    const hasPendingCampaigns = campaigns.some((campaign) => campaign.pending > 0);
    if (!hasPendingCampaigns) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      loadCampaigns({ suppressGlobalLoading: true });
    }, CAMPAIGN_REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [campaigns]);

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
              pending: Math.max(sendResult.data.total_recipients - sendResult.data.sent_recipients, 0),
              failed: 0,
            }
          : campaign,
      ),
    );

    loadCampaigns({ suppressGlobalLoading: true });
  };

  const handleDeleteClick = (campaign) => {
    setDeleteError('');
    setCampaignToDelete(campaign);
  };

  const handleViewActivity = async (campaign) => {
    setCampaignActivity(campaign);
    setCampaignActivityRows([]);
    setActivityError('');
    setActivityLoading(true);

    const result = await campaignsApi.listContacts(campaign.id);

    setActivityLoading(false);

    if (!result.data) {
      setActivityError(
        typeof result.error === 'string' ? result.error : 'Failed to load campaign activity',
      );
      return;
    }

    setCampaignActivityRows(result.data);
  };

  const handleCloseActivity = () => {
    if (activityLoading) {
      return;
    }
    setCampaignActivity(null);
    setCampaignActivityRows([]);
    setActivityError('');
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
                          {campaign.sent} sent / {campaign.total} total
                          {campaign.pending > 0 ? ` / ${campaign.pending} pending` : ''}
                          {campaign.failed > 0 ? ` / ${campaign.failed} failed` : ''}
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
                              disabled={isDeletingCurrent}
                              onClick={() => handleViewActivity(campaign)}
                              className="text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 disabled:cursor-not-allowed disabled:text-gray-300"
                            >
                              View Activity
                            </button>
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

      {campaignActivity ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="flex max-h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Campaign Activity</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {campaignActivity.template_name} · {campaignActivity.sent} sent / {campaignActivity.total} total
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseActivity}
                  disabled={activityLoading}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto px-6 py-5">
              {activityError ? (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {activityError}
                </div>
              ) : null}

              {activityLoading ? (
                <p className="text-sm text-slate-600">Loading recipient activity...</p>
              ) : campaignActivityRows.length === 0 ? (
                <p className="text-sm text-slate-600">No recipient activity found for this campaign.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-3 py-3 text-left text-sm font-semibold text-slate-700">Recipient</th>
                        <th className="px-3 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                        <th className="px-3 py-3 text-left text-sm font-semibold text-slate-700">Processed</th>
                        <th className="px-3 py-3 text-left text-sm font-semibold text-slate-700">Sent At</th>
                        <th className="px-3 py-3 text-left text-sm font-semibold text-slate-700">Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaignActivityRows.map((row) => (
                        <tr key={row.id} className="border-b border-slate-100 align-top">
                          <td className="px-3 py-3 text-sm text-slate-900">
                            <div className="font-medium">{row.contact_name}</div>
                            <div className="text-slate-600">{row.contact_email}</div>
                            <div className="text-slate-500">
                              {row.contact_company}
                              {row.contact_job_title ? ` · ${row.contact_job_title}` : ''}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-sm">
                            <span
                              className={`rounded px-2 py-1 text-xs ${getRecipientStatusColor(row.status)}`}
                            >
                              {capitalize(row.status)}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-sm text-slate-600">
                            {formatDateTime(row.processed_at)}
                          </td>
                          <td className="px-3 py-3 text-sm text-slate-600">
                            {formatDateTime(row.sent_at)}
                          </td>
                          <td className="px-3 py-3 text-sm text-slate-600">
                            {row.error_message || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
