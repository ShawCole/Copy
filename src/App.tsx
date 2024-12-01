import React, { useState, useEffect } from 'react';
import { CampaignSettings } from './components/CampaignSettings';
import { EmailEditor } from './components/EmailEditor';
import { SaveCampaignButton } from './components/SaveCampaignButton';
import { Sidebar } from './components/Sidebar';
import { EditableCampaignName } from './components/EditableCampaignName';
import { ViewModeToggle } from './components/ViewModeToggle';
import { DeleteCampaignModal } from './components/DeleteCampaignModal';
import { ThemeToggle } from './components/ThemeToggle';
import { EmailTemplate, CampaignSettings as Settings, Campaign, ViewMode, ApprovalStatus } from './types/email';
import { storage } from './utils/storage';
import { Mail, Trash2 } from 'lucide-react';

function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => storage.getCampaigns());
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [emails, setEmails] = useState<EmailTemplate[]>([]);
  const [campaignName, setCampaignName] = useState<string>('');
  const [hasEditedName, setHasEditedName] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('agency');
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    storage.saveCampaigns(campaigns);
  }, [campaigns]);

  useEffect(() => {
    if (selectedCampaign) {
      setCampaignName(selectedCampaign.name);
      setHasEditedName(true);
    } else {
      setCampaignName('');
      setHasEditedName(false);
    }
  }, [selectedCampaign]);

  const handleSettingsSubmit = (newSettings: Settings) => {
    setSettings(newSettings);
    const newEmails = Array.from({ length: newSettings.numberOfEmails }, (_, index) => ({
      id: `email-${index}`,
      subject: '',
      body: '',
      abTest: false,
      approvalStatus: 'pending' as ApprovalStatus,
    }));
    setEmails(newEmails);
  };

  const handleEmailChange = (index: number, updatedEmail: EmailTemplate) => {
    const newEmails = [...emails];
    newEmails[index] = updatedEmail;
    setEmails(newEmails);
  };

  const handleEmailDelete = (index: number) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
    if (settings) {
      setSettings({ ...settings, numberOfEmails: settings.numberOfEmails - 1 });
    }
  };

  const handleSaveCampaign = (providedName?: string) => {
    if (!settings) return;

    const now = new Date().toISOString();
    const finalName = hasEditedName ? campaignName : (providedName || 'Untitled Campaign');
    
    const campaign: Campaign = {
      id: selectedCampaign?.id || `campaign-${Date.now()}`,
      name: finalName,
      settings,
      emails,
      createdAt: selectedCampaign?.createdAt || now,
      updatedAt: now,
    };

    setCampaigns((prev) => {
      const index = prev.findIndex((c) => c.id === campaign.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = campaign;
        return updated;
      }
      return [...prev, campaign];
    });
    setSelectedCampaign(campaign);
    setCampaignName(finalName);
    setHasEditedName(true);
    storage.saveCampaign(campaign);
  };

  const handleNewCampaign = () => {
    setSelectedCampaign(null);
    setSettings(null);
    setEmails([]);
    setCampaignName('');
    setHasEditedName(false);
  };

  const handleSelectCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setSettings(campaign.settings);
    setEmails(campaign.emails);
    setCampaignName(campaign.name);
    setHasEditedName(true);
  };

  const handleDeleteCampaign = () => {
    if (selectedCampaign) {
      storage.deleteCampaign(selectedCampaign.id);
      setCampaigns(prev => prev.filter(c => c.id !== selectedCampaign.id));
      handleNewCampaign();
      setShowDeleteModal(false);
    }
  };

  const handleNameChange = (newName: string) => {
    setCampaignName(newName);
    setHasEditedName(true);
    if (settings) {
      handleSaveCampaign();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <ThemeToggle />
      <Sidebar
        campaigns={campaigns}
        selectedCampaign={selectedCampaign}
        onSelectCampaign={handleSelectCampaign}
        onNewCampaign={handleNewCampaign}
        onDeleteCampaign={handleDeleteCampaign}
        onMenuCollapse={setIsMenuCollapsed}
      />

      <div className={`flex-1 transition-all duration-300 ${isMenuCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="max-w-5xl mx-auto py-8 px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Mail className="w-8 h-8 text-blue-600" />
              <EditableCampaignName
                name={campaignName}
                onChange={handleNameChange}
              />
            </div>
            <div className="flex items-center gap-4">
              <ViewModeToggle mode={viewMode} onModeChange={setViewMode} />
              {settings && viewMode === 'agency' && (
                <SaveCampaignButton 
                  onSave={handleSaveCampaign} 
                  showNamePrompt={!hasEditedName}
                />
              )}
            </div>
          </div>

          {!settings ? (
            viewMode === 'agency' ? (
              <CampaignSettings onSettingsSubmit={handleSettingsSubmit} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No campaign selected</p>
              </div>
            )
          ) : (
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Campaign Settings</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Type: {settings.emailType} | Intent Level: {settings.intentLevel} |
                      Number of Emails: {settings.numberOfEmails}
                    </p>
                  </div>
                  {viewMode === 'agency' && (
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {emails.map((email, index) => (
                  <div key={email.id}>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Email {index + 1}
                    </h3>
                    <EmailEditor
                      email={email}
                      onChange={(updatedEmail) => handleEmailChange(index, updatedEmail)}
                      onDelete={() => handleEmailDelete(index)}
                      viewMode={viewMode}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <DeleteCampaignModal
          onConfirm={handleDeleteCampaign}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}

export default App;