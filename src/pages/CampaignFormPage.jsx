import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { campaignsApi, contactsApi, templatesApi } from '../api';
import Alert from '../components/Alert';
import { useUiStore } from '../store/uiStore';

const emptyForm = {
  templateId: '',
  status: 'draft',
  contactIds: [],
};

const getContactIdentifier = (contact) =>
  contact?.contact_id ?? contact?.id ?? contact?.email ?? contact?.name ?? '';

const mapCampaignToForm = (campaign, recipientIds = []) => ({
  templateId: campaign?.template_id ? String(campaign.template_id) : '',
  status: campaign?.status || 'draft',
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
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const error = useUiStore((state) => state.error);
  const clearError = useUiStore((state) => state.clearError);

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    let active = true;

    const loadPage = async () => {
      setPageLoading(true);

      const [templatesResult, contactsResult] = await Promise.all([
        templatesApi.list(),
        contactsApi.list(),
      ]);

      if (!active) {
        return;
      }

      setTemplates(templatesResult.data || []);
      setContacts(contactsResult.data || []);

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

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleTemplateChange = (event) => {
    const { value } = event.target;
    const selectedTemplate = templates.find((template) => String(template.id) === value);
    console.log('Selected template:', selectedTemplate);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    const payload = {
      template_id: formData.templateId,
      status: formData.status,
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
            <div className="grid gap-6 md:grid-cols-2">
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
                  {templates
                    .map((template) => (
                    <option key={template.id} value={String(template.id)}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Status</span>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFieldChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="sending">Sending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </label>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="block text-sm font-medium text-gray-700">Recipients</span>
                <span className="text-sm text-gray-500">{formData.contactIds.length} selected</span>
              </div>

              <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-200">
                {contacts.length === 0 ? (
                  <p className="p-4 text-sm text-gray-600">No contacts available. Add contacts first.</p>
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
                          </p>
                        </div>
                      </label>
                    );
                  })
                )}
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
