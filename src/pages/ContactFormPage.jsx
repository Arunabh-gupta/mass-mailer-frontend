import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { contactsApi } from '../api';
import Alert from '../components/Alert';
import { useUiStore } from '../store/uiStore';

const emptyForm = {
  name: '',
  email: '',
  company: '',
  job_title: '',
};

const mapContactToForm = (contact) => ({
  name: contact?.name || '',
  email: contact?.email || '',
  company: contact?.company || '',
  job_title: contact?.job_title || '',
});

export default function ContactFormPage() {
  const { contactId } = useParams();
  const isEditMode = Boolean(contactId);
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => mapContactToForm(location.state?.contact));
  const [pageLoading, setPageLoading] = useState(isEditMode && !location.state?.contact);
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

    if (location.state?.contact) {
      setFormData(mapContactToForm(location.state.contact));
      setPageLoading(false);
      return () => {
        active = false;
      };
    }

    const loadContact = async () => {
      setPageLoading(true);
      const result = await contactsApi.get(contactId);

      if (active && result.data) {
        setFormData(mapContactToForm(result.data));
      }

      if (active) {
        setPageLoading(false);
      }
    };

    loadContact();

    return () => {
      active = false;
    };
  }, [clearError, contactId, isEditMode, location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      company: formData.company.trim(),
      job_title: formData.job_title.trim(),
    };

    const result = isEditMode
      ? await contactsApi.update(contactId, payload)
      : await contactsApi.create(payload);

    setSubmitting(false);

    if (result.data) {
      navigate('/contacts');
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
            {isEditMode ? 'Edit Contact' : 'Create Contact'}
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Update contact details' : 'Add a new contact'}
          </h1>
        </div>
        <Link
          to="/contacts"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Back to Contacts
        </Link>
      </div>

      <Alert message={error} onClose={clearError} />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {pageLoading ? (
          <p className="text-sm text-gray-600">Loading contact details...</p>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Name</span>
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
                <span className="mb-2 block text-sm font-medium text-gray-700">Email</span>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Company</span>
                <input
                  required
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Job Title</span>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Link
                to="/contacts"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {submitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Contact'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
