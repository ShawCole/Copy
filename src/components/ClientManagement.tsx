import React, { useState } from 'react';
import { Plus, X, Trash2, KeyRound } from 'lucide-react';
import { clients } from '../utils/clients';
import { Client } from '../types/client';

interface ClientManagementProps {
  onClose: () => void;
}

export function ClientManagement({ onClose }: ClientManagementProps) {
  const [clientList, setClientList] = useState<Client[]>(clients.getClients());
  const [newClient, setNewClient] = useState({
    name: '',
    username: '',
    password: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [resetPasswordClient, setResetPasswordClient] = useState<Client | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.addClient(newClient);
    setClientList([...clientList, client]);
    setNewClient({ name: '', username: '', password: '' });
    setShowAddForm(false);
  };

  const handleDeleteClient = (clientId: string) => {
    clients.deleteClient(clientId);
    setClientList(clientList.filter(c => c.id !== clientId));
  };

  const handleResetPassword = (client: Client) => {
    setResetPasswordClient(client);
    setNewPassword('');
  };

  const handlePasswordResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetPasswordClient && newPassword.trim()) {
      const updatedClient = {
        ...resetPasswordClient,
        password: newPassword.trim()
      };
      clients.updateClient(updatedClient);
      setClientList(clientList.map(c => 
        c.id === updatedClient.id ? updatedClient : c
      ));
      setResetPasswordClient(null);
      setNewPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[32rem] max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Manage Clients</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {clientList.map(client => (
            <div
              key={client.id}
              className="p-4 border rounded-lg flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium">{client.name}</h3>
                <p className="text-sm text-gray-500">{client.username}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleResetPassword(client)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Reset Password"
                >
                  <KeyRound className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteClient(client.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Client"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add New Client
          </button>
        ) : (
          <form onSubmit={handleAddClient} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Client Name
              </label>
              <input
                type="text"
                value={newClient.name}
                onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username (Email)
              </label>
              <input
                type="email"
                value={newClient.username}
                onChange={e => setNewClient({ ...newClient, username: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="text"
                value={newClient.password}
                onChange={e => setNewClient({ ...newClient, password: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Client
              </button>
            </div>
          </form>
        )}

        {resetPasswordClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-medium mb-4">
                Reset Password for {resetPasswordClient.name}
              </h3>
              <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setResetPasswordClient(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}