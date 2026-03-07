import { useEffect, useMemo, useState } from 'react';

import { contactsApi } from '../api';
import Alert from '../components/Alert';
import { useUiStore } from '../store/uiStore';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
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
      `${contact.name} ${contact.email} ${contact.company} ${contact.role || ''}`
        .toLowerCase()
        .includes(query),
    );
  }, [contacts, searchText]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
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
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-500" colSpan={4}>
                      No contacts found
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr key={contact.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{contact.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{contact.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{contact.company}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{contact.role || '-'}</td>
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
