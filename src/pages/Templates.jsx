import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { templatesApi } from '../api';
import Alert from '../components/Alert';
import ConfirmModal from '../components/ConfirmModal';
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
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState('');
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

  const handleDeleteClick = (template) => {
    clearError();
    setDeleteError('');
    setTemplateToDelete(template);
  };

  const handleDeleteCancel = () => {
    if (deletePending) {
      return;
    }
    setDeleteError('');
    setTemplateToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!templateToDelete?.id) {
      return;
    }

    setDeletePending(true);
    const result = await templatesApi.remove(templateToDelete.id);
    setDeletePending(false);

    if (result.data) {
      setTemplates((current) =>
        current.filter((template) => String(template.id) !== String(templateToDelete.id)),
      );
      setDeleteError('');
      setTemplateToDelete(null);
      return;
    }

    setDeleteError(typeof result.error === 'string' ? result.error : 'Failed to delete template');
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
        <Link
          to="/templates/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Create Resume Template
        </Link>
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
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.length === 0 ? (
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-500" colSpan={5}>
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
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-4">
                          <Link
                            to={`/templates/${template.id ?? template.name}/edit`}
                            state={{ template }}
                            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                          >
                            Edit Template
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(template)}
                            className="text-sm font-medium text-red-600 transition-colors hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(templateToDelete)}
        title="Delete template?"
        message={
          templateToDelete
            ? `This will permanently delete "${templateToDelete.name}". This action cannot be undone.`
            : ''
        }
        errorMessage={deleteError}
        confirmLabel="Delete Template"
        confirmTone="danger"
        busy={deletePending}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
