export default function Campaigns() {
  const campaigns = [
    {
      id: 1,
      name: 'Q1 Software Engineer Outreach',
      template: 'Cold Outreach - Software Engineer',
      status: 'Completed',
      sent: 47,
      total: 50,
      created: '2024-01-15',
    },
    {
      id: 2,
      name: 'Follow-Up Campaign',
      template: 'Follow-Up Email',
      status: 'Sending',
      sent: 23,
      total: 100,
      created: '2024-01-20',
    },
    {
      id: 3,
      name: 'Marketing Manager Outreach',
      template: 'Marketing Template',
      status: 'Draft',
      sent: 0,
      total: 30,
      created: '2024-01-22',
    },
    {
      id: 4,
      name: 'Product Manager Campaign',
      template: 'PM Outreach Template',
      status: 'Failed',
      sent: 5,
      total: 25,
      created: '2024-01-18',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Sending':
        return 'bg-blue-100 text-blue-700';
      case 'Draft':
        return 'bg-gray-100 text-gray-700';
      case 'Failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Create Campaign
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search campaigns..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Campaign Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Template
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Progress
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Created
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {campaign.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {campaign.template}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${getStatusColor(
                        campaign.status
                      )}`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {campaign.sent} / {campaign.total}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {campaign.created}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
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
  );
}
