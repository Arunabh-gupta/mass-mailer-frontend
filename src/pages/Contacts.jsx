import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { contactsApi } from '../api';
import Alert from '../components/Alert';
import ConfirmModal from '../components/ConfirmModal';
import { useUiStore } from '../store/uiStore';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [contactToDelete, setContactToDelete] = useState(null);
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [importPending, setImportPending] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSummary, setImportSummary] = useState(null);
  const fileInputRef = useRef(null);
  const loading = useUiStore((state) => state.loading);
  const error = useUiStore((state) => state.error);
  const clearError = useUiStore((state) => state.clearError);

  const loadContacts = async () => {
    const result = await contactsApi.list();
    setContacts(result.data || []);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) {
      return contacts;
    }

    return contacts.filter((contact) =>
      `${contact.name} ${contact.email} ${contact.company} ${contact.job_title || ''}`
        .toLowerCase()
        .includes(query),
    );
  }, [contacts, searchText]);

  const handleDeleteClick = (contact) => {
    setDeleteError('');
    setContactToDelete(contact);
  };

  const handleDeleteCancel = () => {
    if (deletePending) {
      return;
    }
    setDeleteError('');
    setContactToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!contactToDelete?.id) {
      return;
    }

    setDeletePending(true);
    const result = await contactsApi.remove(contactToDelete.id);
    setDeletePending(false);

    if (result.data) {
      setContacts((current) =>
        current.filter((contact) => String(contact.id) !== String(contactToDelete.id)),
      );
      setDeleteError('');
      setContactToDelete(null);
      return;
    }

    setDeleteError(typeof result.error === 'string' ? result.error : 'Failed to delete contact');
  };

  const handleImportButtonClick = () => {
    setImportError('');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setImportPending(true);
    setImportError('');
    setImportSummary(null);

    const result = await contactsApi.importCsv(file);

    setImportPending(false);

    if (!result.data) {
      setImportError(typeof result.error === 'string' ? result.error : 'Failed to import contacts');
      return;
    }

    setImportSummary(result.data);
    await loadContacts();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={handleImportButtonClick}
            disabled={importPending}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            {importPending ? 'Importing...' : 'Import CSV'}
          </button>
          <Link
            to="/contacts/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Create Contact
          </Link>
        </div>
      </div>

      <Alert message={error} onClose={clearError} />

      {importError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {importError}
        </div>
      ) : null}

      {importSummary ? (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900">
          <p className="font-medium">
            Import finished. Imported {importSummary.imported_count} of {importSummary.total_rows} row(s).
          </p>
          <p className="mt-1 text-emerald-800">
            Skipped {importSummary.skipped_count} row(s).
          </p>
          {importSummary.errors.length > 0 ? (
            <div className="mt-3 rounded-md bg-white/70 px-3 py-3 text-emerald-950">
              <p className="font-medium">Import issues</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {importSummary.errors.slice(0, 5).map((item) => (
                  <li key={`${item.row}-${item.message}-${item.email || 'no-email'}`}>
                    Row {item.row}: {item.message}
                    {item.email ? ` (${item.email})` : ''}
                  </li>
                ))}
              </ul>
              {importSummary.errors.length > 5 ? (
                <p className="mt-2 text-xs text-emerald-800">
                  Showing first 5 issues out of {importSummary.errors.length}.
                </p>
              ) : null}
            </div>
          ) : null}
          <p className="mt-3 text-xs text-emerald-800">
            CSV must contain exactly these columns: name, email, job_title, company. Column order does not matter.
          </p>
        </div>
      ) : null}

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-6">
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search contacts..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <p className="p-6 text-sm text-gray-600">Loading contacts...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Job Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-500" colSpan={5}>
                      No contacts found
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr key={contact.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{contact.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{contact.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{contact.company}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{contact.job_title || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-4">
                          <Link
                            to={`/contacts/${contact.id}/edit`}
                            state={{ contact }}
                            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                          >
                            Edit Contact
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(contact)}
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
        open={Boolean(contactToDelete)}
        title="Delete contact?"
        message={
          contactToDelete
            ? `This will permanently delete "${contactToDelete.name}" from your contacts. This action cannot be undone.`
            : ''
        }
        errorMessage={deleteError}
        confirmLabel="Delete Contact"
        confirmTone="danger"
        busy={deletePending}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
