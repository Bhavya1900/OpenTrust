import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  BankAccount,
  Transaction,
  ThirdPartyApplication,
  Consent,
  AuditEvent,
  ApiRequestLog,
  ConsentScope,
  DashboardMetrics,
  MockApiResponse,
} from '../types';
import {
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_APPLICATIONS,
  INITIAL_CONSENTS,
  INITIAL_AUDIT_EVENTS,
  DEMO_USER,
} from '../data/seedData';
import { bankService } from '../services/mock/bankService';
import { consentService } from '../services/mock/consentService';
import { apiSimulatorService } from '../services/mock/apiSimulatorService';

interface OpenTrustContextType {
  accounts: BankAccount[];
  transactions: Transaction[];
  applications: ThirdPartyApplication[];
  consents: Consent[];
  auditEvents: AuditEvent[];
  apiLogs: ApiRequestLog[];
  metrics: DashboardMetrics;

  // Actions
  getAppById: (appId: string) => ThirdPartyApplication | undefined;
  getConsentById: (consentId: string) => Consent | undefined;
  getConsentForApp: (appId: string) => Consent | undefined;
  
  approveConsent: (
    appId: string,
    approvedScopes: ConsentScope[],
    durationDays: number
  ) => Promise<Consent>;
  
  denyConsent: (appId: string, requestedScopes: ConsentScope[]) => Promise<Consent>;
  
  revokeConsent: (consentId: string) => Promise<Consent>;
  
  runSimulatedApi: (
    appId: string,
    operation: 'READ_ACCOUNT_DETAILS' | 'READ_ACCOUNT_BALANCES' | 'READ_TRANSACTION_HISTORY'
  ) => Promise<{ response: MockApiResponse; log: ApiRequestLog }>;
  
  resetDemoData: () => void;
}

const OpenTrustContext = createContext<OpenTrustContextType | undefined>(undefined);

export const OpenTrustProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<BankAccount[]>(() => INITIAL_ACCOUNTS);
  const [transactions] = useState<Transaction[]>(() => INITIAL_TRANSACTIONS);
  const [applications] = useState<ThirdPartyApplication[]>(() => INITIAL_APPLICATIONS);
  const [consents, setConsents] = useState<Consent[]>(() => INITIAL_CONSENTS);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => INITIAL_AUDIT_EVENTS);
  const [apiLogs, setApiLogs] = useState<ApiRequestLog[]>([
    {
      id: 'req_init_01',
      timestamp: '2026-10-29T11:45:10Z',
      clientName: 'FinSight Analytics',
      clientId: 'cl_finsight_9821a',
      endpoint: '/api/v1/open-banking/accounts/balances',
      scopeRequired: 'ACCOUNT_BALANCES',
      status: 'SUCCESS',
      statusCode: 200,
      message: 'Successfully returned Read Account Balances data under authorized scope [ACCOUNT_BALANCES].',
      durationMs: 42,
      consentId: 'cst_act_9021',
    },
  ]);

  // Dynamically compute metrics from live dataset
  const metrics = useMemo<DashboardMetrics>(() => {
    return bankService.calculateMetrics(accounts, consents, apiLogs, applications.length);
  }, [accounts, consents, apiLogs, applications.length]);

  const getAppById = (appId: string) => applications.find((a) => a.id === appId);
  const getConsentById = (consentId: string) => consents.find((c) => c.id === consentId);
  const getConsentForApp = (appId: string) => consents.find((c) => c.applicationId === appId);

  const approveConsent = async (
    appId: string,
    approvedScopes: ConsentScope[],
    durationDays: number
  ): Promise<Consent> => {
    const app = getAppById(appId);
    if (!app) throw new Error('Application not found');

    const existing = getConsentForApp(appId);
    const updatedConsent = consentService.approveConsent(
      existing,
      DEMO_USER.id,
      appId,
      app.requestedDefaultScopes,
      approvedScopes,
      durationDays
    );

    setConsents((prev) => {
      const idx = prev.findIndex((c) => c.id === updatedConsent.id || c.applicationId === appId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedConsent;
        return copy;
      }
      return [updatedConsent, ...prev];
    });

    // Record audit event
    const newAuditEvent: AuditEvent = {
      id: `evt_${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      eventType: 'CONSENT_APPROVED',
      applicationId: app.id,
      applicationName: app.name,
      consentId: updatedConsent.id,
      outcome: 'SUCCESS',
      description: `Customer granted consent for ${durationDays} days. Approved scopes: [${approvedScopes.join(', ')}].`,
      endpoint: '/api/v1/consent/authorize',
      ipAddressMock: '103.21.124.9',
    };

    setAuditEvents((prev) => [newAuditEvent, ...prev]);

    return updatedConsent;
  };

  const denyConsent = async (appId: string, requestedScopes: ConsentScope[]): Promise<Consent> => {
    const app = getAppById(appId);
    if (!app) throw new Error('Application not found');

    const existing = getConsentForApp(appId);
    const deniedConsent = consentService.denyConsent(
      existing,
      DEMO_USER.id,
      appId,
      requestedScopes
    );

    setConsents((prev) => {
      const idx = prev.findIndex((c) => c.id === deniedConsent.id || c.applicationId === appId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = deniedConsent;
        return copy;
      }
      return [deniedConsent, ...prev];
    });

    const newAuditEvent: AuditEvent = {
      id: `evt_${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      eventType: 'CONSENT_DENIED',
      applicationId: app.id,
      applicationName: app.name,
      consentId: deniedConsent.id,
      outcome: 'DENIED',
      description: `Customer explicitly rejected consent authorization requested by ${app.name}.`,
      endpoint: '/api/v1/consent/authorize',
      ipAddressMock: '103.21.124.9',
    };

    setAuditEvents((prev) => [newAuditEvent, ...prev]);
    return deniedConsent;
  };

  const revokeConsent = async (consentId: string): Promise<Consent> => {
    const existing = getConsentById(consentId);
    if (!existing) throw new Error('Consent record not found');

    const app = getAppById(existing.applicationId);
    const revoked = consentService.revokeConsent(existing);

    setConsents((prev) => prev.map((c) => (c.id === consentId ? revoked : c)));

    const newAuditEvent: AuditEvent = {
      id: `evt_${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      eventType: 'CONSENT_REVOKED',
      applicationId: existing.applicationId,
      applicationName: app?.name || 'Third-Party Client',
      consentId: revoked.id,
      outcome: 'SUCCESS',
      description: `Customer revoked consent ${revoked.id}. All associated access privileges have been immediately terminated.`,
      endpoint: '/api/v1/consent/revoke',
      ipAddressMock: '103.21.124.9',
    };

    setAuditEvents((prev) => [newAuditEvent, ...prev]);
    return revoked;
  };

  const runSimulatedApi = async (
    appId: string,
    operation: 'READ_ACCOUNT_DETAILS' | 'READ_ACCOUNT_BALANCES' | 'READ_TRANSACTION_HISTORY'
  ) => {
    const app = getAppById(appId);
    if (!app) throw new Error('Application not found');

    const consent = getConsentForApp(appId);

    const { response, log } = await apiSimulatorService.executeSimulatedRequest({
      application: app,
      consent,
      operation,
      accounts,
      transactions,
    });

    // Append to API logs
    setApiLogs((prev) => [log, ...prev]);

    // If success, update lastAccessAt on the consent record
    if (response.success && consent) {
      setConsents((prev) =>
        prev.map((c) =>
          c.id === consent.id ? { ...c, lastAccessAt: new Date().toISOString() } : c
        )
      );
    }

    // Also record corresponding audit activity
    let auditType: AuditEvent['eventType'] = 'SIMULATED_API_SUCCESS';
    let outcome: AuditEvent['outcome'] = 'SUCCESS';

    if (!response.success) {
      if (response.error?.code === 'CONSENT_REVOKED') {
        auditType = 'SIMULATED_API_DENIED_REVOKED';
        outcome = 'DENIED';
      } else if (response.error?.code === 'CONSENT_EXPIRED') {
        auditType = 'SIMULATED_API_DENIED_EXPIRED';
        outcome = 'DENIED';
      } else if (response.error?.code === 'INSUFFICIENT_SCOPE') {
        auditType = 'SIMULATED_API_DENIED_SCOPE';
        outcome = 'DENIED';
      } else {
        auditType = 'SIMULATED_API_UNAUTHORIZED';
        outcome = 'FAILURE';
      }
    }

    const auditEvt: AuditEvent = {
      id: `evt_${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      eventType: auditType,
      applicationId: app.id,
      applicationName: app.name,
      consentId: consent?.id,
      outcome,
      description: response.success
        ? `Simulated API call [${log.endpoint}]: Granted access under scope [${log.scopeRequired}].`
        : `Simulated API call [${log.endpoint}]: Denied (${response.error?.reason || response.message}).`,
      endpoint: log.endpoint,
      ipAddressMock: '49.207.180.12',
    };

    setAuditEvents((prev) => [auditEvt, ...prev]);

    return { response, log };
  };

  const resetDemoData = () => {
    setAccounts(INITIAL_ACCOUNTS);
    setConsents(INITIAL_CONSENTS);
    setAuditEvents(INITIAL_AUDIT_EVENTS);
  };

  return (
    <OpenTrustContext.Provider
      value={{
        accounts,
        transactions,
        applications,
        consents,
        auditEvents,
        apiLogs,
        metrics,
        getAppById,
        getConsentById,
        getConsentForApp,
        approveConsent,
        denyConsent,
        revokeConsent,
        runSimulatedApi,
        resetDemoData,
      }}
    >
      {children}
    </OpenTrustContext.Provider>
  );
};

export const useOpenTrust = () => {
  const context = useContext(OpenTrustContext);
  if (!context) {
    throw new Error('useOpenTrust must be used within an OpenTrustProvider');
  }
  return context;
};
