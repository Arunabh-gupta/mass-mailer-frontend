export default function Recruiters() {
  const recruiters = [
    {
      id: 1,
      name: 'Aruralth Gupta',
      email: 'sronabh@opemai.com',
      company: 'Google',
      role: 'Software Engineer',
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane.dee@exempts.com',
      company: 'Drax',
      role: 'Recruiter',
    },
    {
      id: 3,
      name: 'John Smith',
      email: 'john.smith@example.com',
      company: 'Microsoft',
      role: 'HR Manager',
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      company: 'Amazon',
      role: 'Talent Acquisition',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Recruiters</h1>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + Add Recruiter
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Create New Names
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recruiters.map((recruiter) => (
                <tr
                  key={recruiter.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {recruiter.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {recruiter.email}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {recruiter.company}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {recruiter.role}
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
