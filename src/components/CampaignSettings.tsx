import React, { useState } from 'react';
import { EmailType, IntentLevel } from '../types/email';
import { clients } from '../utils/clients';

interface CampaignSettingsProps {
  onSettingsSubmit: (settings: {
    emailType: EmailType;
    intentLevel: IntentLevel;
    numberOfEmails: number;
    clientId: string;
    clientName: string;
  }) => void;
}

export function CampaignSettings({ onSettingsSubmit }: CampaignSettingsProps) {
  const [emailType, setEmailType] = useState<EmailType>('B2B');
  const [intentLevel, setIntentLevel] = useState<IntentLevel>('high');
  const [numberOfEmails, setNumberOfEmails] = useState<string>('1');
  const [clientId, setClientId] = useState<string>('');
  const clientList = clients.getClients();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numEmails = parseInt(numberOfEmails, 10);
    if (numEmails > 0 && clientId) {
      const selectedClient = clientList.find(c => c.id === clientId);
      if (selectedClient) {
        onSettingsSubmit({
          emailType,
          intentLevel,
          numberOfEmails: numEmails,
          clientId: selectedClient.username,
          clientName: selectedClient.name
        });
      }
    }
  };

  const isValidNumber = numberOfEmails === '' || parseInt(numberOfEmails, 10) > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Select Client
        </label>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select a client</option>
          {clientList.map(client => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Campaign Type
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="B2B"
              checked={emailType === 'B2B'}
              onChange={(e) => setEmailType(e.target.value as EmailType)}
              className="mr-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-gray-700 dark:text-gray-200">B2B</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="B2C"
              checked={emailType === 'B2C'}
              onChange={(e) => setEmailType(e.target.value as EmailType)}
              className="mr-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-gray-700 dark:text-gray-200">B2C</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Intent Level
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="high"
              checked={intentLevel === 'high'}
              onChange={(e) => setIntentLevel(e.target.value as IntentLevel)}
              className="mr-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-gray-700 dark:text-gray-200">High Intent</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="low"
              checked={intentLevel === 'low'}
              onChange={(e) => setIntentLevel(e.target.value as IntentLevel)}
              className="mr-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-gray-700 dark:text-gray-200">Low Intent</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Number of Emails
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={numberOfEmails}
          onChange={(e) => setNumberOfEmails(e.target.value)}
          placeholder="Number of Emails cannot be zero"
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
            isValidNumber
              ? 'border-gray-300 dark:border-gray-600 focus:border-blue-500 bg-white dark:bg-gray-700'
              : 'border-red-300 dark:border-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/50'
          }`}
        />
      </div>

      <button
        type="submit"
        disabled={!isValidNumber || numberOfEmails === '' || parseInt(numberOfEmails, 10) <= 0 || !clientId}
        className={`w-full py-2 px-4 rounded-md transition-colors ${
          !isValidNumber || numberOfEmails === '' || parseInt(numberOfEmails, 10) <= 0 || !clientId
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        Continue
      </button>
    </form>
  );
}