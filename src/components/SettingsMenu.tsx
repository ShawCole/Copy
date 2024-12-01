import React, { useState } from 'react';
import { Settings, KeyRound, Users, LogOut } from 'lucide-react';
import { ClientManagement } from './ClientManagement';
import { PasswordReset } from './PasswordReset';

interface SettingsMenuProps {
  role: 'agency' | 'client';
  onLogout: () => void;
  isCollapsed?: boolean;
  isTransitioning?: boolean;
  textTransitionClass?: string;
}

export function SettingsMenu({ 
  role, 
  onLogout, 
  isCollapsed = false, 
  isTransitioning = false,
  textTransitionClass
}: SettingsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'password' | 'clients' | null>(null);

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 w-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md p-2"
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400 shrink-0" />
          <span className={`${textTransitionClass} text-gray-900 dark:text-white`}>
            Settings
          </span>
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
            <button
              onClick={() => {
                setActiveModal('password');
                setIsOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <KeyRound className="w-4 h-4" />
              Reset Password
            </button>

            {role === 'agency' && (
              <button
                onClick={() => {
                  setActiveModal('clients');
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Users className="w-4 h-4" />
                Manage Clients
              </button>
            )}

            <button
              onClick={onLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        )}
      </div>

      {activeModal === 'password' && (
        <PasswordReset onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'clients' && (
        <ClientManagement onClose={() => setActiveModal(null)} />
      )}
    </>
  );
}