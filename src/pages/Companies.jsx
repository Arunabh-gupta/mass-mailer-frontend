export default function Companies() {
  const companies = [
    {
      id: 1,
      name: 'Google',
      recruiters: '5',
      industry: 'Software Engineer',
      location: 'Mountain View, CA',
    },
    {
      id: 2,
      name: 'Aareawa',
      recruiters: '3',
      industry: 'Marketing Manager',
      location: 'San Francisco, CA',
    },
    {
      id: 3,
      name: 'Microsoft',
      recruiters: '8',
      industry: 'Software Engineer',
      location: 'Redmond, WA',
    },
    {
      id: 4,
      name: 'Amazon',
      recruiters: '12',
      industry: 'Product Manager',
      location: 'Seattle, WA',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + Add Company
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search companies..."
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
                  Recruiters
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Industry
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Location
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr
                  key={company.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {company.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {company.recruiters}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {company.industry}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {company.location}
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
