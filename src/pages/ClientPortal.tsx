import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Campaign, EmailTemplate } from '../types/email';
import { storage } from '../utils/storage';
import { EmailEditor } from '../components/EmailEditor';
import { Mail, ArrowLeft } from 'lucide-react';
import { auth } from '../utils/auth';
import { ClientSidebar } from '../components/ClientSidebar';
import { ThemeToggle } from '../components/ThemeToggle';

export default function ClientPortal() {
  const navigate = useNavigate();
  const user = auth.getStoredUser();
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => storage.getCampaigns());
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setCampaigns(storage.getCampaigns());
      if (selectedCampaign) {
        const updatedCampaign = storage.getCampaigns().find(c => c.id === selectedCampaign.id);
        setSelectedCampaign(updatedCampaign || null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [selectedCampaign]);

  const handleEmailChange = (campaignId: string, emailIndex: number, updatedEmail: EmailTemplate) => {
    setCampaigns(prevCampaigns => {
      const newCampaigns = prevCampaigns.map(campaign => {
        if (campaign.id === campaignId) {
          const newEmails = [...campaign.emails];
          newEmails[emailIndex] = updatedEmail;
          return { 
            ...campaign, 
            emails: newEmails,
            updatedAt: new Date().toISOString()
          };
        }
        return campaign;
      });
      
      if (selectedCampaign?.id === campaignId) {
        const updatedCampaign = newCampaigns.find(c => c.id === campaignId);
        setSelectedCampaign(updatedCampaign || null);
      }
      
      storage.saveCampaigns(newCampaigns);
      return newCampaigns;
    });
  };

  const handleBackToAgency = () => {
    navigate('/agency');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <ThemeToggle />
      <ClientSidebar
        campaigns={campaigns}
        selectedCampaign={selectedCampaign}
        onSelectCampaign={setSelectedCampaign}
        onMenuCollapse={setIsMenuCollapsed}
      />

      <div className={`flex-1 transition-all duration-300 ${isMenuCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="max-w-5xl mx-auto py-8 px-6">
          <div className="flex items-center gap-4 mb-8">
            <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Please approve or deny the following campaigns
            </h1>
          </div>

          {!selectedCampaign ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Select a campaign to review
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Choose a campaign from the sidebar to start reviewing emails.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Campaign Details</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Type: {selectedCampaign.settings.emailType} • 
                  Intent Level: {selectedCampaign.settings.intentLevel} • 
                  Number of Emails: {selectedCampaign.settings.numberOfEmails}
                </p>
              </div>

              <div className="space-y-6">
                {selectedCampaign.emails.map((email, index) => (
                  <div key={email.id}>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Email {index + 1}
                    </h3>
                    <EmailEditor
                      email={email}
                      onChange={(updatedEmail) => handleEmailChange(selectedCampaign.id, index, updatedEmail)}
                      onDelete={() => {}}
                      viewMode="client"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {user?.role === 'agency' && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={handleBackToAgency}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Agency Portal
          </button>
        </div>
      )}
    </div>
  );
}