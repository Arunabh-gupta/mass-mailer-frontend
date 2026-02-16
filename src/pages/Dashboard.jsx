import { Link } from 'react-router-dom';

export default function Dashboard() {
  const stats = [
    { label: 'Total Recruiters', value: '12', icon: '💼' },
    { label: 'Email Templates', value: '7', icon: '📧' },
    { label: 'Total Campaigns', value: '23', icon: '📁' },
    { label: 'Campaigns Sent', value: '47', icon: '🚀' },
  ];

  const templates = [
    {
      id: 1,
      name: 'Cold Outreach - Software Engineer Resume',
      subject: "Hi [recruiter_name]. I hope you're...",
      lastUpdated: '3 minutes ago',
    },
    {
      id: 2,
      name: 'Follow-Up Email',
      subject: "how you're concived in p-past an che...",
      lastUpdated: '10 minutes ago',
    },
    {
      id: 3,
      name: 'Template 3',
      subject: 'Subject line here',
      lastUpdated: 'Today 12:30 PM',
    },
    {
      id: 4,
      name: 'Template 4',
      subject: 'Another subject',
      lastUpdated: 'Yesterday',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/campaigns/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Campaign
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Email Templates
          </h2>
          <Link
            to="/templates/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Create New Template
          </Link>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search recruiters..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Template Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Subject
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Last Updated
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template) => (
                  <tr
                    key={template.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {template.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {template.subject}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {template.lastUpdated}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Delete
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                          Duplicate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">1-4 of 4 results</p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
