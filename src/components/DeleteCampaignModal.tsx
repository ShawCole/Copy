import React from 'react';
import { X } from 'lucide-react';

interface DeleteCampaignModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteCampaignModal({ onConfirm, onCancel }: DeleteCampaignModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Delete Campaign?</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this campaign? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}