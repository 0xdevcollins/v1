export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  password_confirmation: string;
}

export interface UserTypes {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  avatar: string;
  language: string;
}

export interface CampaignTypes {
  title: string;
  email_template_id: number;
  scheduled_at?: string;
  send_now: boolean;
}

export interface ContactTypes {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_id: string;
  groups: string[];
  contactDate: string;
  address: string;
}

export interface TemplateTypes {
  id?: any;
  name: string;
  content: string;
  html: string;
  category?: string;
}
export interface RateInfo {
  value: number;
  change: string;
}

export interface EmailPerformance {
  emailsSent: number;
  openRate: RateInfo;
  clickRate: RateInfo;
}

export interface AudiencePerformance {
  name: string;
  emailsSent: number;
  openRate: string;
  clickRate: string;
}

export interface CampaignStatData {
  label: any;
  value: any;
  month: string;
  openRate: number;
  ctr: number;
  bounceRate: number;
}

export interface CampaignStats {
  timeFrame: string;
  data: CampaignStatData[];
}

export interface DashboardTypes {
  emailPerformance: EmailPerformance;
  audiencePerformance: AudiencePerformance[];
  campaignStats: CampaignStats;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface DNSRecordTypes {
  type: string;
  hostname: string;
  value: string;
}

export interface DomainTypes {
  id: string;
  user_id: string;
  domain: string;
  default_email: string | null;
  verification_token: string;
  is_verified: number;
  created_at: string;
  updated_at: string;
  spf_record: string;
  dkim_record: string;
  dmarc_record: string;
  status?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  features: any;
  description: string[];
}
