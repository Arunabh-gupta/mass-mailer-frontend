import { useEffect, useMemo, useState } from 'react';
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
  const loading = useUiStore((state) => state.loading);
  const error = useUiStore((state) => state.error);
  const clearError = useUiStore((state) => state.clearError);

  useEffect(() => {
    const loadContacts = async () => {
      const result = await contactsApi.list();
      setContacts(result.data || []);
    };

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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
        <Link
          to="/contacts/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Create Contact
        </Link>
      </div>

      <Alert message={error} onClose={clearError} />

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
