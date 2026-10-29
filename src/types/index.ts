export type ConsentScope = 'ACCOUNT_DETAILS' | 'ACCOUNT_BALANCES' | 'TRANSACTION_HISTORY';

export interface ScopeDefinition {
  id: ConsentScope;
  name: string;
  description: string;
  category: string;
  whatItExposes: string;
  sensitivity: 'Low' | 'Medium' | 'High';
}

export type ConsentStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'DENIED' | 'PENDING';

export interface User {
  id: string;
  name: string;
  email: string;
  maskedCustomerId: string;
  phone: string;
  panMasked: string;
  kycStatus: 'VERIFIED' | 'PENDING';
}

export interface BankAccount {
  id: string;
  customerId: string;
  bankName: string;
  bankCode: string;
  accountType: 'Savings' | 'Current' | 'Salary';
  maskedAccountNumber: string;
  balance: number;
  currency: string;
  status: 'ACTIVE' | 'FROZEN' | 'DORMANT';
  ifscCode: string;
  branch: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  customerId: string;
  description: string;
  merchantName: string;
  category: 'Food & Dining' | 'Shopping' | 'Salary & Income' | 'Utilities & Bills' | 'Travel & Fuel' | 'Investment' | 'Transfer';
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  timestamp: string; // ISO 8601
  referenceNumber: string;
}

export interface ThirdPartyApplication {
  id: string;
  name: string;
  clientId: string;
  description: string;
  purpose: string;
  icon: string; // Lucide icon identifier
  category: string;
  developer: string;
  website: string;
  registeredRedirectUri: string;
  requestedDefaultScopes: ConsentScope[];
}

export interface Consent {
  id: string;
  customerId: string;
  applicationId: string;
  requestedScopes: ConsentScope[];
  approvedScopes: ConsentScope[];
  status: ConsentStatus;
  createdAt: string;
  expiresAt: string;
  revokedAt?: string;
  lastAccessAt?: string;
  durationDays: number;
}

export type AuditEventType = 
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'LOGOUT'
  | 'CONSENT_REQUESTED'
  | 'CONSENT_APPROVED'
  | 'CONSENT_DENIED'
  | 'CONSENT_REVOKED'
  | 'CONSENT_EXPIRED'
  | 'SIMULATED_API_SUCCESS'
  | 'SIMULATED_API_DENIED_REVOKED'
  | 'SIMULATED_API_DENIED_EXPIRED'
  | 'SIMULATED_API_DENIED_SCOPE'
  | 'SIMULATED_API_UNAUTHORIZED';

export interface AuditEvent {
  id: string;
  timestamp: string;
  eventType: AuditEventType;
  applicationId?: string;
  applicationName?: string;
  consentId?: string;
  outcome: 'SUCCESS' | 'DENIED' | 'FAILURE' | 'WARNING';
  description: string;
  endpoint?: string;
  ipAddressMock?: string;
}

export interface ApiRequestLog {
  id: string;
  timestamp: string;
  clientName: string;
  clientId: string;
  endpoint: string;
  scopeRequired: ConsentScope;
  status: 'SUCCESS' | 'DENIED';
  statusCode: 200 | 401 | 403;
  message: string;
  durationMs: number;
  consentId?: string;
  responseData?: unknown;
}

export interface MockApiResponse<T = unknown> {
  success: boolean;
  status: number;
  statusText: string;
  message: string;
  timestamp: string;
  consentId?: string;
  scopeVerified?: ConsentScope;
  simulatedJwtToken?: string;
  data?: T;
  error?: {
    code: string;
    reason: string;
    details?: string;
  };
}

export interface DashboardMetrics {
  totalBalance: number;
  accountCount: number;
  connectedAppsCount: number;
  activeConsentCount: number;
  revokedConsentCount: number;
  recentSuccessfulAccessCount: number;
  recentDeniedAccessCount: number;
}
