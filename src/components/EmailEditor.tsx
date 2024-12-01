import React from 'react';
import { EmailTemplate, ViewMode, ApprovalStatus } from '../types/email';
import { Check, X } from 'lucide-react';

interface EmailEditorProps {
  email: EmailTemplate;
  onChange: (updatedEmail: EmailTemplate) => void;
  onDelete: () => void;
  viewMode: ViewMode;
}

export function EmailEditor({ email, onChange, onDelete, viewMode }: EmailEditorProps) {
  const handleChange = (field: keyof EmailTemplate, value: string | boolean) => {
    onChange({ ...email, [field]: value });
  };

  const handleApproval = (status: ApprovalStatus, isABVersion = false) => {
    if (isABVersion) {
      onChange({ ...email, abApprovalStatus: status });
    } else {
      onChange({ ...email, approvalStatus: status });
    }
  };

  const ApprovalButtons = ({ status, onApprove }: { status: ApprovalStatus; onApprove: (status: ApprovalStatus) => void }) => (
    <div className="flex items-center gap-2 mt-4">
      <button
        onClick={() => onApprove('approved')}
        className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
          status === 'approved'
            ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
            : 'hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-600 dark:text-gray-300'
        }`}
      >
        <Check className="w-4 h-4" />
        Approve
      </button>
      <button
        onClick={() => onApprove('denied')}
        className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
          status === 'denied'
            ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
            : 'hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-300'
        }`}
      >
        <X className="w-4 h-4" />
        Deny
      </button>
    </div>
  );

  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      case 'denied':
        return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const StatusIndicator = ({ status }: { status: ApprovalStatus }) => {
    const getStatusText = (status: ApprovalStatus) => {
      switch (status) {
        case 'approved':
          return 'Approved';
        case 'denied':
          return 'Denied';
        default:
          return 'Pending Review';
      }
    };

    const getStatusClass = (status: ApprovalStatus) => {
      switch (status) {
        case 'approved':
          return 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-800';
        case 'denied':
          return 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 border-red-200 dark:border-red-800';
        default:
          return 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
      }
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(status)}`}>
        {getStatusText(status)}
      </span>
    );
  };

  const getCombinedStatus = (): ApprovalStatus => {
    if (!email.abTest) return email.approvalStatus;
    
    if (email.approvalStatus === 'approved' && email.abApprovalStatus === 'approved') {
      return 'approved';
    }
    if (email.approvalStatus === 'denied' && email.abApprovalStatus === 'denied') {
      return 'denied';
    }
    return 'pending';
  };

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-lg shadow-md border ${getStatusColor(getCombinedStatus())}`}>
        {viewMode === 'agency' && (
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={email.abTest}
                onChange={(e) => handleChange('abTest', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              Enable A/B Testing
            </label>
          </div>
        )}

        <div className="space-y-6">
          {/* Version A */}
          <div className={`p-6 rounded-lg border ${getStatusColor(email.approvalStatus)}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject Line A
                </label>
                <input
                  type="text"
                  value={email.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className="w-full px-4 py-3 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-4 text-gray-900 dark:text-white"
                  disabled={viewMode === 'client'}
                />
              </div>
              {viewMode === 'client' && (
                <div className="ml-4">
                  <StatusIndicator status={email.approvalStatus} />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Body A
              </label>
              <textarea
                value={email.body}
                onChange={(e) => handleChange('body', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-4 text-gray-900 dark:text-white"
                disabled={viewMode === 'client'}
              />
            </div>

            {viewMode === 'client' && (
              <ApprovalButtons
                status={email.approvalStatus}
                onApprove={(status) => handleApproval(status)}
              />
            )}
          </div>

          {/* Version B */}
          {email.abTest && (
            <div className={`p-6 rounded-lg border ${getStatusColor(email.abApprovalStatus || 'pending')}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject Line B
                  </label>
                  <input
                    type="text"
                    value={email.abSubject || ''}
                    onChange={(e) => handleChange('abSubject', e.target.value)}
                    className="w-full px-4 py-3 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-4 text-gray-900 dark:text-white"
                    disabled={viewMode === 'client'}
                  />
                </div>
                {viewMode === 'client' && email.abApprovalStatus && (
                  <div className="ml-4">
                    <StatusIndicator status={email.abApprovalStatus} />
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Body B
                </label>
                <textarea
                  value={email.abBody || ''}
                  onChange={(e) => handleChange('abBody', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-4 text-gray-900 dark:text-white"
                  disabled={viewMode === 'client'}
                />
              </div>

              {viewMode === 'client' && (
                <ApprovalButtons
                  status={email.abApprovalStatus || 'pending'}
                  onApprove={(status) => handleApproval(status, true)}
                />
              )}
            </div>
          )}
        </div>

        {/* Combined Status Indicator */}
        {viewMode === 'client' && email.abTest && (
          <div className="mt-4 flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Overall Status
            </span>
            <StatusIndicator status={getCombinedStatus()} />
          </div>
        )}
      </div>

      {viewMode === 'agency' && (
        <button
          onClick={onDelete}
          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
        >
          Delete Email
        </button>
      )}
    </div>
  );
}