"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOpenTrust = exports.OpenTrustProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const seedData_1 = require("../data/seedData");
const bankService_1 = require("../services/mock/bankService");
const consentService_1 = require("../services/mock/consentService");
const apiSimulatorService_1 = require("../services/mock/apiSimulatorService");
const OpenTrustContext = (0, react_1.createContext)(undefined);
const OpenTrustProvider = ({ children }) => {
    const [accounts, setAccounts] = (0, react_1.useState)(() => seedData_1.INITIAL_ACCOUNTS);
    const [transactions] = (0, react_1.useState)(() => seedData_1.INITIAL_TRANSACTIONS);
    const [applications] = (0, react_1.useState)(() => seedData_1.INITIAL_APPLICATIONS);
    const [consents, setConsents] = (0, react_1.useState)(() => seedData_1.INITIAL_CONSENTS);
    const [auditEvents, setAuditEvents] = (0, react_1.useState)(() => seedData_1.INITIAL_AUDIT_EVENTS);
    const [apiLogs, setApiLogs] = (0, react_1.useState)([
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
    const metrics = (0, react_1.useMemo)(() => {
        return bankService_1.bankService.calculateMetrics(accounts, consents, apiLogs, applications.length);
    }, [accounts, consents, apiLogs, applications.length]);
    const getAppById = (appId) => applications.find((a) => a.id === appId);
    const getConsentById = (consentId) => consents.find((c) => c.id === consentId);
    const getConsentForApp = (appId) => consents.find((c) => c.applicationId === appId);
    const approveConsent = async (appId, approvedScopes, durationDays) => {
        const app = getAppById(appId);
        if (!app)
            throw new Error('Application not found');
        const existing = getConsentForApp(appId);
        const updatedConsent = consentService_1.consentService.approveConsent(existing, seedData_1.DEMO_USER.id, appId, app.requestedDefaultScopes, approvedScopes, durationDays);
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
        const newAuditEvent = {
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
    const denyConsent = async (appId, requestedScopes) => {
        const app = getAppById(appId);
        if (!app)
            throw new Error('Application not found');
        const existing = getConsentForApp(appId);
        const deniedConsent = consentService_1.consentService.denyConsent(existing, seedData_1.DEMO_USER.id, appId, requestedScopes);
        setConsents((prev) => {
            const idx = prev.findIndex((c) => c.id === deniedConsent.id || c.applicationId === appId);
            if (idx >= 0) {
                const copy = [...prev];
                copy[idx] = deniedConsent;
                return copy;
            }
            return [deniedConsent, ...prev];
        });
        const newAuditEvent = {
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
    const revokeConsent = async (consentId) => {
        const existing = getConsentById(consentId);
        if (!existing)
            throw new Error('Consent record not found');
        const app = getAppById(existing.applicationId);
        const revoked = consentService_1.consentService.revokeConsent(existing);
        setConsents((prev) => prev.map((c) => (c.id === consentId ? revoked : c)));
        const newAuditEvent = {
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
    const runSimulatedApi = async (appId, operation) => {
        const app = getAppById(appId);
        if (!app)
            throw new Error('Application not found');
        const consent = getConsentForApp(appId);
        const { response, log } = await apiSimulatorService_1.apiSimulatorService.executeSimulatedRequest({
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
            setConsents((prev) => prev.map((c) => c.id === consent.id ? { ...c, lastAccessAt: new Date().toISOString() } : c));
        }
        // Also record corresponding audit activity
        let auditType = 'SIMULATED_API_SUCCESS';
        let outcome = 'SUCCESS';
        if (!response.success) {
            if (response.error?.code === 'CONSENT_REVOKED') {
                auditType = 'SIMULATED_API_DENIED_REVOKED';
                outcome = 'DENIED';
            }
            else if (response.error?.code === 'CONSENT_EXPIRED') {
                auditType = 'SIMULATED_API_DENIED_EXPIRED';
                outcome = 'DENIED';
            }
            else if (response.error?.code === 'INSUFFICIENT_SCOPE') {
                auditType = 'SIMULATED_API_DENIED_SCOPE';
                outcome = 'DENIED';
            }
            else {
                auditType = 'SIMULATED_API_UNAUTHORIZED';
                outcome = 'FAILURE';
            }
        }
        const auditEvt = {
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
        setAccounts(seedData_1.INITIAL_ACCOUNTS);
        setConsents(seedData_1.INITIAL_CONSENTS);
        setAuditEvents(seedData_1.INITIAL_AUDIT_EVENTS);
    };
    return ((0, jsx_runtime_1.jsx)(OpenTrustContext.Provider, { value: {
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
        }, children: children }));
};
exports.OpenTrustProvider = OpenTrustProvider;
const useOpenTrust = () => {
    const context = (0, react_1.useContext)(OpenTrustContext);
    if (!context) {
        throw new Error('useOpenTrust must be used within an OpenTrustProvider');
    }
    return context;
};
exports.useOpenTrust = useOpenTrust;
