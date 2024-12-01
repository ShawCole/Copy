export type EmailType = 'B2B' | 'B2C';
export type IntentLevel = 'high' | 'low';
export type ViewMode = 'agency' | 'client';
export type ApprovalStatus = 'pending' | 'approved' | 'denied';

export interface EmailTemplate {
  id: string;
  subject: string;
  body: string;
  abTest: boolean;
  abSubject?: string;
  abBody?: string;
  approvalStatus: ApprovalStatus;
  abApprovalStatus?: ApprovalStatus;
}

export interface CampaignSettings {
  emailType: EmailType;
  intentLevel: IntentLevel;
  numberOfEmails: number;
  clientId: string;
  clientName: string;
}

export interface Campaign {
  id: string;
  name: string;
  settings: CampaignSettings;
  emails: EmailTemplate[];
  createdAt: string;
  updatedAt: string;
}