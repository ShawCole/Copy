import React, { useState } from 'react';
import { Save } from 'lucide-react';

interface SaveCampaignButtonProps {
  onSave: (name?: string) => void;
  showNamePrompt: boolean;
  className?: string;
}

export function SaveCampaignButton({ onSave, showNamePrompt, className = '' }: SaveCampaignButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaignName, setCampaignName] = useState('');

  const handleSave = () => {
    if (showNamePrompt) {
      setIsModalOpen(true);
    } else {
      onSave();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (campaignName.trim()) {
      onSave(campaignName.trim());
      setIsModalOpen(false);
      setCampaignName('');
    }
  };

  return (
    <>
      <button
        onClick={handleSave}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ${className}`}
      >
        <Save className="w-4 h-4" />
        Save Campaign
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Save Campaign</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Campaign Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!campaignName.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}