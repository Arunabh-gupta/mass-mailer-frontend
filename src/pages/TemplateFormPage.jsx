import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { templatesApi } from '../api';
import Alert from '../components/Alert';
import { useUiStore } from '../store/uiStore';

const emptyForm = {
  name: '',
  subject: '',
  body: '',
};

const mapTemplateToForm = (template) => ({
  name: template?.name || '',
  subject: template?.subject || '',
  body: template?.body || '',
});

export default function TemplateFormPage() {
  const { templateId } = useParams();
  const isEditMode = Boolean(templateId);
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => mapTemplateToForm(location.state?.template));
  const [pageLoading, setPageLoading] = useState(isEditMode && !location.state?.template);
  const [submitting, setSubmitting] = useState(false);
  const error = useUiStore((state) => state.error);
  const clearError = useUiStore((state) => state.clearError);

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    let active = true;

    if (!isEditMode) {
      setFormData(emptyForm);
      setPageLoading(false);
      return () => {
        active = false;
      };
    }

    if (location.state?.template) {
      setFormData(mapTemplateToForm(location.state.template));
      setPageLoading(false);
      return () => {
        active = false;
      };
    }

    const loadTemplate = async () => {
      setPageLoading(true);
      const result = await templatesApi.get(templateId);

      if (active && result.data) {
        setFormData(mapTemplateToForm(result.data));
      }

      if (active) {
        setPageLoading(false);
      }
    };

    loadTemplate();

    return () => {
      active = false;
    };
  }, [clearError, isEditMode, location.state, templateId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      subject: formData.subject.trim(),
      body: formData.body.trim(),
    };

    const result = isEditMode
      ? await templatesApi.update(templateId, payload)
      : await templatesApi.create(payload);

    setSubmitting(false);

    if (result.data) {
      navigate('/templates');
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
            {isEditMode ? 'Edit Resume Template' : 'Create Resume Template'}
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Update your resume template' : 'Create a reusable resume template'}
          </h1>
        </div>
        <Link
          to="/templates"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Back to Templates
        </Link>
      </div>

      <Alert message={error} onClose={clearError} />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {pageLoading ? (
          <p className="text-sm text-gray-600">Loading template details...</p>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">Template Name</span>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">Email Subject</span>
              <input
                required
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">Email Body</span>
              <textarea
                required
                rows={12}
                name="body"
                value={formData.body}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <div className="flex items-center justify-end gap-3">
              <Link
                to="/templates"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {submitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Template'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
