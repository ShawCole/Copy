import { Campaign } from '../types/email';

const STORAGE_KEY = 'email-campaigns';

export const storage = {
  getCampaigns: (): Campaign[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading campaigns:', error);
      return [];
    }
  },

  getClientCampaigns: (clientId: string): Campaign[] => {
    try {
      const campaigns = storage.getCampaigns();
      return campaigns.filter(campaign => campaign.settings.clientId === clientId);
    } catch (error) {
      console.error('Error loading client campaigns:', error);
      return [];
    }
  },

  saveCampaigns: (campaigns: Campaign[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error saving campaigns:', error);
    }
  },

  saveCampaign: (campaign: Campaign): void => {
    try {
      const campaigns = storage.getCampaigns();
      const index = campaigns.findIndex(c => c.id === campaign.id);
      
      if (index >= 0) {
        campaigns[index] = campaign;
      } else {
        campaigns.push(campaign);
      }
      
      storage.saveCampaigns(campaigns);
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  },

  deleteCampaign: (campaignId: string): void => {
    try {
      const campaigns = storage.getCampaigns();
      const filtered = campaigns.filter(c => c.id !== campaignId);
      storage.saveCampaigns(filtered);
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  }
};