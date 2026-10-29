import {
  ThirdPartyApplication,
  Consent,
  BankAccount,
  Transaction,
  ConsentScope,
  MockApiResponse,
  ApiRequestLog,
} from '../../types';
import { consentService } from './consentService';

export interface ExecuteApiParams {
  application: ThirdPartyApplication;
  consent: Consent | undefined;
  operation: 'READ_ACCOUNT_DETAILS' | 'READ_ACCOUNT_BALANCES' | 'READ_TRANSACTION_HISTORY';
  accounts: BankAccount[];
  transactions: Transaction[];
}

export const apiSimulatorService = {
  /**
   * Maps operation to required consent scope, endpoint and description
   */
  getOperationMeta(operation: 'READ_ACCOUNT_DETAILS' | 'READ_ACCOUNT_BALANCES' | 'READ_TRANSACTION_HISTORY'): {
    endpoint: string;
    scope: ConsentScope;
    name: string;
    description: string;
  } {
    switch (operation) {
      case 'READ_ACCOUNT_DETAILS':
        return {
          endpoint: '/api/v1/open-banking/accounts/details',
          scope: 'ACCOUNT_DETAILS',
          name: 'Read Account Details',
          description: 'Fetches bank identifiers, branch names, account types, and masked numbers.',
        };
      case 'READ_ACCOUNT_BALANCES':
        return {
          endpoint: '/api/v1/open-banking/accounts/balances',
          scope: 'ACCOUNT_BALANCES',
          name: 'Read Account Balances',
          description: 'Fetches current ledger and available balance for authorized accounts.',
        };
      case 'READ_TRANSACTION_HISTORY':
        return {
          endpoint: '/api/v1/open-banking/transactions',
          scope: 'TRANSACTION_HISTORY',
          name: 'Read Transaction History',
          description: 'Fetches granular debit/credit transaction records, merchant descriptions, and reference numbers.',
        };
    }
  },

  /**
   * Generates a realistic but clearly labeled simulated mock JWT representation
   */
  generateSimulatedToken(client: ThirdPartyApplication, consentId?: string, approvedScopes: ConsentScope[] = []): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT', env: 'OPENTRUST_PROTOTYPE_SIMULATION' }));
    const payload = btoa(
      JSON.stringify({
        iss: 'https://opentrust.test/oauth2',
        sub: 'usr_demo_001',
        aud: client.clientId,
        client_id: client.clientId,
        consent_id: consentId || 'none',
        scope: approvedScopes.join(' '),
        simulated: true,
        note: 'DEMO ONLY - NOT PRODUCTION SECURITY',
      })
    );
    const mockSig = 'SIMULATED_SIGNATURE_EDUCATIONAL_DEMO';
    return `${header}.${payload}.${mockSig}`;
  },

  /**
   * Execute simulated third-party API call evaluating real consent state
   */
  async executeSimulatedRequest(
    params: ExecuteApiParams
  ): Promise<{ response: MockApiResponse; log: ApiRequestLog }> {
    const startTime = performance.now();
    // Simulate natural network roundtrip
    await new Promise((resolve) => setTimeout(resolve, 280));

    const meta = this.getOperationMeta(params.operation);
    const { application, consent, accounts, transactions } = params;

    const logId = `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const timestamp = new Date().toISOString();

    // 1. Check if application has a consent record
    if (!consent) {
      const durationMs = Math.round(performance.now() - startTime);
      const res: MockApiResponse = {
        success: false,
        status: 403,
        statusText: 'Forbidden',
        message: `Consent not established for application "${application.name}". Access denied.`,
        timestamp,
        error: {
          code: 'CONSENT_MISSING',
          reason: 'No consent record exists between demo customer and this third-party client.',
          details: 'The customer must authorize this application via the consent workflow before APIs can be invoked.',
        },
      };

      const log: ApiRequestLog = {
        id: logId,
        timestamp,
        clientName: application.name,
        clientId: application.clientId,
        endpoint: meta.endpoint,
        scopeRequired: meta.scope,
        status: 'DENIED',
        statusCode: 403,
        message: res.message,
        durationMs,
        responseData: res,
      };

      return { response: res, log };
    }

    // 2. Check if consent was explicitly REVOKED
    if (consent.status === 'REVOKED') {
      const durationMs = Math.round(performance.now() - startTime);
      const res: MockApiResponse = {
        success: false,
        status: 403,
        statusText: 'Forbidden',
        message: `Consent was revoked by customer. API access denied for "${application.name}".`,
        timestamp,
        consentId: consent.id,
        error: {
          code: 'CONSENT_REVOKED',
          reason: `Consent ${consent.id} was revoked at ${new Date(consent.revokedAt || '').toLocaleString('en-IN')}.`,
          details: 'Once revoked, all simulated authorization tokens are invalidated immediately. The customer must re-authorize.',
        },
      };

      const log: ApiRequestLog = {
        id: logId,
        timestamp,
        clientName: application.name,
        clientId: application.clientId,
        endpoint: meta.endpoint,
        scopeRequired: meta.scope,
        status: 'DENIED',
        statusCode: 403,
        message: res.message,
        durationMs,
        consentId: consent.id,
        responseData: res,
      };

      return { response: res, log };
    }

    // 3. Check if consent has EXPIRED
    const validity = consentService.isValidConsent(consent);
    if (!validity.isValid) {
      const durationMs = Math.round(performance.now() - startTime);
      const res: MockApiResponse = {
        success: false,
        status: 403,
        statusText: 'Forbidden',
        message: `Consent is no longer valid: ${validity.reason}`,
        timestamp,
        consentId: consent.id,
        error: {
          code: consent.status === 'EXPIRED' ? 'CONSENT_EXPIRED' : 'CONSENT_INVALID',
          reason: validity.reason || 'Consent has expired or is invalid.',
          details: 'The consent duration has elapsed. A fresh authorization request is required.',
        },
      };

      const log: ApiRequestLog = {
        id: logId,
        timestamp,
        clientName: application.name,
        clientId: application.clientId,
        endpoint: meta.endpoint,
        scopeRequired: meta.scope,
        status: 'DENIED',
        statusCode: 403,
        message: res.message,
        durationMs,
        consentId: consent.id,
        responseData: res,
      };

      return { response: res, log };
    }

    // 4. Check if required scope was approved by customer
    if (!consent.approvedScopes.includes(meta.scope)) {
      const durationMs = Math.round(performance.now() - startTime);
      const res: MockApiResponse = {
        success: false,
        status: 403,
        statusText: 'Forbidden',
        message: `Insufficient scope: "${meta.scope}" was not approved by customer.`,
        timestamp,
        consentId: consent.id,
        error: {
          code: 'INSUFFICIENT_SCOPE',
          reason: `Client requested ${meta.scope}, but customer only authorized [${consent.approvedScopes.join(', ')}].`,
          details: 'The customer exercised granular control and withheld permission for this specific financial data category.',
        },
      };

      const log: ApiRequestLog = {
        id: logId,
        timestamp,
        clientName: application.name,
        clientId: application.clientId,
        endpoint: meta.endpoint,
        scopeRequired: meta.scope,
        status: 'DENIED',
        statusCode: 403,
        message: res.message,
        durationMs,
        consentId: consent.id,
        responseData: res,
      };

      return { response: res, log };
    }

    // 5. Success! Return scoped, sanitized data
    const durationMs = Math.round(performance.now() - startTime);
    const simulatedJwt = this.generateSimulatedToken(application, consent.id, consent.approvedScopes);

    let scopedData: unknown;

    if (meta.scope === 'ACCOUNT_DETAILS') {
      // Expose only basic identity/details, NOT balances or transactions
      scopedData = {
        customerId: 'usr_demo_001',
        totalAccounts: accounts.length,
        accounts: accounts.map((acc) => ({
          accountId: acc.id,
          bankName: acc.bankName,
          accountType: acc.accountType,
          maskedAccountNumber: acc.maskedAccountNumber,
          ifscCode: acc.ifscCode,
          branch: acc.branch,
          status: acc.status,
        })),
      };
    } else if (meta.scope === 'ACCOUNT_BALANCES') {
      // Expose current balances and currency, NOT transaction details
      scopedData = {
        currency: 'INR',
        asOfTimestamp: new Date().toISOString(),
        balances: accounts.map((acc) => ({
          accountId: acc.id,
          bankName: acc.bankName,
          maskedAccountNumber: acc.maskedAccountNumber,
          availableBalance: acc.balance,
          ledgerBalance: acc.balance,
          currency: acc.currency,
        })),
        aggregateTotal: accounts.reduce((sum, a) => sum + a.balance, 0),
      };
    } else if (meta.scope === 'TRANSACTION_HISTORY') {
      // Expose granular transaction records
      scopedData = {
        totalRecords: transactions.length,
        timeframe: 'Past 30 Days (Demo)',
        transactions: transactions.map((t) => ({
          transactionId: t.id,
          referenceNumber: t.referenceNumber,
          accountId: t.accountId,
          description: t.description,
          merchantName: t.merchantName,
          category: t.category,
          type: t.type,
          amount: t.amount,
          currency: 'INR',
          timestamp: t.timestamp,
        })),
      };
    }

    const res: MockApiResponse = {
      success: true,
      status: 200,
      statusText: 'OK',
      message: `Successfully returned ${meta.name} data under authorized scope [${meta.scope}].`,
      timestamp,
      consentId: consent.id,
      scopeVerified: meta.scope,
      simulatedJwtToken: simulatedJwt,
      data: scopedData,
    };

    const log: ApiRequestLog = {
      id: logId,
      timestamp,
      clientName: application.name,
      clientId: application.clientId,
      endpoint: meta.endpoint,
      scopeRequired: meta.scope,
      status: 'SUCCESS',
      statusCode: 200,
      message: res.message,
      durationMs,
      consentId: consent.id,
      responseData: res,
    };

    return { response: res, log };
  },
};
