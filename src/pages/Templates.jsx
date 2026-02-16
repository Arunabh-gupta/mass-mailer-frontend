import { Link } from 'react-router-dom';

export default function Templates() {
  const templates = [
    {
      id: 1,
      name: 'Cold Outreach - Software Eng.',
      email: 'sronabh@ppenai.com',
      company: 'Google',
      role: 'Software Engineer',
      status: 'Draft',
    },
    {
      id: 2,
      name: 'Follow-Up Email',
      email: 'jane.deo@exempte.com',
      company: 'Facebook',
      role: 'Recruiter',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Template 3',
      email: 'template3@example.com',
      company: 'Microsoft',
      role: 'HR Manager',
      status: 'Draft',
    },
    {
      id: 4,
      name: 'Template 4',
      email: 'template4@example.com',
      company: 'Amazon',
      role: 'Talent Acquisition',
      status: 'Active',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
        <Link
          to="/templates/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Template
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search templates..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Company
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Status
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
                    {template.email}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {template.company}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {template.role}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        template.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {template.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
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
