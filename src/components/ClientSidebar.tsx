import React, { useState } from 'react';
import { Menu, Settings, Mail, ChevronLeft } from 'lucide-react';
import { Campaign } from '../types/email';
import { SettingsMenu } from './SettingsMenu';
import { auth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

interface ClientSidebarProps {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  onSelectCampaign: (campaign: Campaign) => void;
  onMenuCollapse: (collapsed: boolean) => void;
}

export function ClientSidebar({
  campaigns,
  selectedCampaign,
  onSelectCampaign,
  onMenuCollapse
}: ClientSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const user = auth.getStoredUser();
  const navigate = useNavigate();

  const handleToggleCollapse = () => {
    setIsTransitioning(true);
    setIsCollapsed(!isCollapsed);
    onMenuCollapse(!isCollapsed);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleLogout = () => {
    auth.setStoredUser(null);
    navigate('/login');
  };

  const textTransitionClass = `transition-all duration-300 ${
    isCollapsed || isTransitioning ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
  }`;

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.settings.clientId === user?.username
  );

  return (
    <div 
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center relative">
          <button
            onClick={handleToggleCollapse}
            className={`absolute inset-y-0 flex items-center justify-center transition-all duration-300 z-20 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full w-10 h-10 my-auto ${
              isCollapsed ? 'left-1/2 -translate-x-1/2' : 'right-4'
            }`}
          >
            {isCollapsed ? (
              <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            )}
          </button>
          
          <div className="flex items-center gap-2 px-4">
            <Mail className={`w-5 h-5 text-blue-600 dark:text-blue-400 transition-opacity duration-300 ${
              isCollapsed || isTransitioning ? 'opacity-0' : 'opacity-100'
            }`} />
            <span className={`${textTransitionClass} text-gray-900 dark:text-white`}>
              My Campaigns
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredCampaigns.map((campaign) => (
            <button
              key={campaign.id}
              onClick={() => onSelectCampaign(campaign)}
              className={`w-full text-left p-3 rounded-md mb-2 transition-colors ${
                selectedCampaign?.id === campaign.id
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
              }`}
            >
              {isCollapsed ? (
                <Mail className="w-5 h-5 mx-auto" />
              ) : (
                <div className={textTransitionClass}>
                  <div className="font-medium truncate">{campaign.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {new Date(campaign.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
          <SettingsMenu 
            role={user?.role || 'client'} 
            onLogout={handleLogout}
            isCollapsed={isCollapsed}
            isTransitioning={isTransitioning}
            textTransitionClass={textTransitionClass}
          />
        </div>
      </div>
    </div>
  );
}