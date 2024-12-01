import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import App from '../App';
import { auth } from '../utils/auth';

export default function AgencyApp() {
  const navigate = useNavigate();
  const user = auth.getStoredUser();

  const handleSwitchToClient = () => {
    // Preserve the user's authentication when switching to client portal
    navigate('/client');
  };

  return (
    <div className="relative min-h-screen">
      {user?.role === 'agency' && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={handleSwitchToClient}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-md hover:bg-gray-50 transition-colors shadow-lg border border-gray-200"
          >
            <Users className="w-4 h-4" />
            Switch to Client Portal
          </button>
        </div>
      )}
      <App />
    </div>
  );
}