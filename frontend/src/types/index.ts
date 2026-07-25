export type ApplicationStatus = 
  | 'DRAFT'
  | 'APPLIED'
  | 'SCREENING'
  | 'PHONE_SCREEN'
  | 'INTERVIEW_1'
  | 'INTERVIEW_2'
  | 'INTERVIEW_3'
  | 'TECHNICAL_ASSESSMENT'
  | 'OFFER_RECEIVED'
  | 'OFFER_ACCEPTED'
  | 'OFFER_DECLINED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  location?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Recruiter {
  id: string;
  companyId: string;
  name: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  title?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  description?: string;
  employmentType?: string;
  location?: string;
  isRemote: boolean;
  salaryRange?: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  name: string;
  fileUrl: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  companyId: string;
  resumeId?: string;
  status: ApplicationStatus;
  appliedAt?: string;
  notes?: string;
  nextFollowUpAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  isDefault: boolean;
  type: 'INITIAL' | 'FOLLOW_UP_1' | 'FOLLOW_UP_2' | 'THANK_YOU';
  createdAt: string;
  updatedAt: string;
}

export interface EmailHistory {
  id: string;
  applicationId: string;
  recruiterId?: string;
  templateId?: string;
  subject: string;
  body: string;
  sentAt: string;
  status: 'SENT' | 'FAILED' | 'DELIVERED' | 'OPENED' | 'REPLIED';
}

export interface FollowupQueueItem {
  id: string;
  applicationId: string;
  recruiterId: string;
  templateId: string;
  scheduledFor: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationEvent {
  id: string;
  applicationId: string;
  type: 'STATUS_CHANGE' | 'NOTE_ADDED' | 'EMAIL_SENT' | 'MEETING_SCHEDULED';
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
