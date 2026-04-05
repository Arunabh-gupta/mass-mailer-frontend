import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { campaignsApi, contactsApi, templatesApi } from '../api';
import Alert from '../components/Alert';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useUiStore } from '../store/uiStore';

const emptyForm = {
  templateId: '',
  contactIds: [],
};

const CONTACT_PAGE_SIZE = 8;
const FILTER_DEBOUNCE_MS = 350;
const PAGE_SIZE_OPTIONS = [8, 16, 32, 64];

const getContactIdentifier = (contact) =>
  contact?.contact_id ?? contact?.id ?? contact?.email ?? contact?.name ?? '';

const mapCampaignToForm = (campaign, recipientIds = []) => ({
  templateId: campaign?.template_id ? String(campaign.template_id) : '',
  contactIds: recipientIds.map((value) => String(value)),
});

export default function CampaignFormPage() {
  const { campaignId } = useParams();
  const isEditMode = Boolean(campaignId);
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyForm);
  const [templates, setTemplates] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [contactSearchText, setContactSearchText] = useState('');
  const [contactPage, setContactPage] = useState(1);
  const [pageSize, setPageSize] = useState(CONTACT_PAGE_SIZE);
  const [hasPreviousContactPage, setHasPreviousContactPage] = useState(false);
  const [hasNextContactPage, setHasNextContactPage] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const error = useUiStore((state) => state.error);
  const clearError = useUiStore((state) => state.clearError);
  const debouncedContactSearchText = useDebouncedValue(contactSearchText, FILTER_DEBOUNCE_MS);

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    let active = true;

    const loadPage = async () => {
      setPageLoading(true);

      const templatesResult = await templatesApi.list();

      if (!active) {
        return;
      }

      setTemplates(templatesResult.data || []);

      if (!isEditMode) {
        setFormData(emptyForm);
        setPageLoading(false);
        return;
      }

      const campaignFromState = location.state?.campaign;

      if (campaignFromState) {
        const contactsForCampaign = await campaignsApi.listContacts(campaignId);

        if (!active) {
          return;
        }

        const recipientIds = (contactsForCampaign.data || []).map(getContactIdentifier).filter(Boolean);
        setFormData(mapCampaignToForm(campaignFromState, recipientIds));
        setPageLoading(false);
        return;
      }

      const [campaignResult, recipientsResult] = await Promise.all([
        campaignsApi.get(campaignId),
        campaignsApi.listContacts(campaignId),
      ]);

      if (!active) {
        return;
      }

      if (campaignResult.data) {
        const recipientIds = (recipientsResult.data || []).map(getContactIdentifier).filter(Boolean);
        setFormData(mapCampaignToForm(campaignResult.data, recipientIds));
      }

      setPageLoading(false);
    };

    loadPage();

    return () => {
      active = false;
    };
  }, [campaignId, clearError, isEditMode, location.state]);

  useEffect(() => {
    let active = true;

    const loadContacts = async () => {
      setContactsLoading(true);

      const result = await contactsApi.list(
        {
          page: contactPage,
          page_size: pageSize,
          query: debouncedContactSearchText.trim() || undefined,
        },
        { suppressGlobalLoading: true },
      );

      if (!active) {
        return;
      }

      if (!result.data) {
        setContacts([]);
        setHasPreviousContactPage(contactPage > 1);
        setHasNextContactPage(false);
        setContactsLoading(false);
        return;
      }

      setContacts(result.data.items || []);
      setHasPreviousContactPage(Boolean(result.data.has_previous));
      setHasNextContactPage(Boolean(result.data.has_next));
      setContactsLoading(false);
    };

    loadContacts();

    return () => {
      active = false;
    };
  }, [
    contactPage,
    debouncedContactSearchText,
    pageSize,
  ]);

  const visibleContactIds = useMemo(
    () => contacts.map((contact) => String(getContactIdentifier(contact))).filter(Boolean),
    [contacts],
  );

  const selectedVisibleCount = useMemo(
    () => visibleContactIds.filter((contactId) => formData.contactIds.includes(contactId)).length,
    [formData.contactIds, visibleContactIds],
  );

  const handleTemplateChange = (event) => {
    const { value } = event.target;
    const selectedTemplate = templates.find((template) => String(template.id) === value);
    setFormData((current) => ({
      ...current,
      templateId: selectedTemplate ? String(selectedTemplate.id) : '',
    }));
  };

  const handleContactToggle = (contactId) => {
    setFormData((current) => ({
      ...current,
      contactIds: current.contactIds.includes(contactId)
        ? current.contactIds.filter((value) => value !== contactId)
        : [...current.contactIds, contactId],
    }));
  };

  const updateVisibleSelection = (shouldSelect) => {
    setFormData((current) => {
      const nextContactIds = new Set(current.contactIds);

      visibleContactIds.forEach((contactId) => {
        if (shouldSelect) {
          nextContactIds.add(contactId);
        } else {
          nextContactIds.delete(contactId);
        }
      });

      return {
        ...current,
        contactIds: Array.from(nextContactIds),
      };
    });
  };

  const handleSearchChange = (event) => {
    setContactSearchText(event.target.value);
    setContactPage(1);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setContactPage(1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    const payload = {
      template_id: formData.templateId,
      contact_ids: formData.contactIds,
    };

    const result = isEditMode
      ? await campaignsApi.update(campaignId, payload)
      : await campaignsApi.create(payload);

    setSubmitting(false);

    if (result.data) {
      navigate('/campaigns');
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
            {isEditMode ? 'Edit Campaign' : 'Create Campaign'}
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Update campaign settings' : 'Create a new outreach campaign'}
          </h1>
        </div>
        <Link
          to="/campaigns"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Back to Campaigns
        </Link>
      </div>

      <Alert message={error} onClose={clearError} />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {pageLoading ? (
          <p className="text-sm text-gray-600">Loading campaign details...</p>
        ) : (
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Resume Template</span>
                <select
                  required
                  name="templateId"
                  value={formData.templateId}
                  onChange={handleTemplateChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={String(template.id)}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="block text-sm font-medium text-gray-700">Recipients</span>
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.contactIds.length} selected across all pages and filters
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateVisibleSelection(true)}
                    disabled={contacts.length === 0 || selectedVisibleCount === contacts.length}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    Select All on Page
                  </button>
                  <button
                    type="button"
                    onClick={() => updateVisibleSelection(false)}
                    disabled={selectedVisibleCount === 0}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    Clear Page
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((current) => ({ ...current, contactIds: [] }))}
                    disabled={formData.contactIds.length === 0}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="mb-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
                <input
                  type="text"
                  value={contactSearchText}
                  onChange={handleSearchChange}
                  placeholder="Search by name, email, company, or job title"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600">
                  <span>Page size</span>
                  <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-gray-900 focus:outline-none focus:ring-0"
                  >
                    {PAGE_SIZE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
                <p>
                  Showing {contacts.length} matching contact{contacts.length === 1 ? '' : 's'} on this page
                </p>
                <p>Page {contactPage}</p>
              </div>

              <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-200">
                {contactsLoading ? (
                  <p className="p-4 text-sm text-gray-600">Loading contacts...</p>
                ) : contacts.length === 0 ? (
                  <p className="p-4 text-sm text-gray-600">
                    No contacts match these filters. Try adjusting the search or add contacts first.
                  </p>
                ) : (
                  contacts.map((contact) => {
                    const contactId = String(getContactIdentifier(contact));
                    const isChecked = formData.contactIds.includes(contactId);

                    return (
                      <label
                        key={contactId}
                        className="flex cursor-pointer items-start gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleContactToggle(contactId)}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                          <p className="text-sm text-gray-600">
                            {contact.email} · {contact.company}
                            {contact.job_title ? ` · ${contact.job_title}` : ''}
                          </p>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setContactPage((page) => Math.max(1, page - 1))}
                  disabled={!hasPreviousContactPage}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">Page {contactPage}</span>
                <button
                  type="button"
                  onClick={() => setContactPage((page) => page + 1)}
                  disabled={!hasNextContactPage}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Link
                to="/campaigns"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {submitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Campaign'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
