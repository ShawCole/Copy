import React from 'react';
import { Users, UserCheck } from 'lucide-react';
import { ViewMode } from '../types/email';

interface ViewModeToggleProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ mode, onModeChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
      <button
        onClick={() => onModeChange('agency')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          mode === 'agency'
            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
        }`}
      >
        <Users className="w-4 h-4" />
        Agency
      </button>
      <button
        onClick={() => onModeChange('client')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          mode === 'client'
            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
        }`}
      >
        <UserCheck className="w-4 h-4" />
        Client
      </button>
    </div>
  );
}