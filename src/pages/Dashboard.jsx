import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { campaignsApi, contactsApi, templatesApi } from '../api';
import Alert from '../components/Alert';
import { useUiStore } from '../store/uiStore';

const formatDate = (isoDate) => {
  if (!isoDate) {
    return '-';
  }
  return new Date(isoDate).toLocaleString();
};

export default function Dashboard() {
  const [contactCount, setContactCount] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const loading = useUiStore((state) => state.loading);
  const error = useUiStore((state) => state.error);
  const clearError = useUiStore((state) => state.clearError);

  useEffect(() => {
    const loadDashboard = async () => {
      const [contactsResult, templatesResult, campaignsResult] = await Promise.all([
        contactsApi.list({ page: 1, page_size: 1, include_totals: true }),
        templatesApi.list(),
        campaignsApi.list(),
      ]);

      setContactCount(contactsResult.data?.total || 0);
      setTemplates(templatesResult.data || []);
      setCampaigns(campaignsResult.data || []);
    };

    loadDashboard();
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Total Contacts', value: contactCount, icon: '📮' },
      { label: 'Email Templates', value: templates.length, icon: '📧' },
      { label: 'Total Campaigns', value: campaigns.length, icon: '📊' },
      {
        label: 'Campaigns Completed',
        value: campaigns.filter((campaign) => campaign.status === 'completed').length,
        icon: '✅',
      },
    ],
    [campaigns, contactCount, templates],
  );

  const recentTemplates = useMemo(() => templates.slice(0, 5), [templates]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/campaigns"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          View Campaigns
        </Link>
      </div>

      <Alert message={error} onClose={clearError} />

      {loading ? (
        <p className="text-sm text-gray-600">Loading dashboard...</p>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <span className="text-3xl">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Email Templates</h2>
              <Link
                to="/templates"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
              >
                View All Templates
              </Link>
            </div>

            <div className="overflow-x-auto p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Updated
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTemplates.length === 0 ? (
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-500" colSpan={3}>
                        No templates available
                      </td>
                    </tr>
                  ) : (
                    recentTemplates.map((template) => (
                      <tr
                        key={`${template.name}-${template.created_at}`}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">{template.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{template.subject}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(template.updated_at || template.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
