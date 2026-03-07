import { useEffect, useMemo, useState } from 'react';

import { templatesApi } from '../api';
import Alert from '../components/Alert';
import { useUiStore } from '../store/uiStore';

const formatDate = (isoDate) => {
  if (!isoDate) {
    return '-';
  }
  return new Date(isoDate).toLocaleString();
};

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [searchText, setSearchText] = useState('');
  const loading = useUiStore((state) => state.loading);
  const error = useUiStore((state) => state.error);
  const clearError = useUiStore((state) => state.clearError);

  useEffect(() => {
    const loadTemplates = async () => {
      const result = await templatesApi.list();
      setTemplates(result.data || []);
    };

    loadTemplates();
  }, []);

  const filteredTemplates = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) {
      return templates;
    }

    return templates.filter(
      (template) =>
        template.name.toLowerCase().includes(query) || template.subject.toLowerCase().includes(query),
    );
  }, [searchText, templates]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
      </div>

      <Alert message={error} onClose={clearError} />

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-6">
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search templates..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <p className="p-6 text-sm text-gray-600">Loading templates...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Body</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.length === 0 ? (
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-500" colSpan={4}>
                      No templates found
                    </td>
                  </tr>
                ) : (
                  filteredTemplates.map((template) => (
                    <tr
                      key={`${template.name}-${template.created_at}`}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">{template.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{template.subject}</td>
                      <td className="max-w-md px-4 py-3 text-sm text-gray-600">{template.body}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(template.updated_at || template.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
