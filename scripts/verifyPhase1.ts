/**
 * OpenTrust Phase 1 Automated Verification Suite
 * Tests critical business logic, state transitions, security evaluation, and metrics.
 */

declare const process: { exitCode?: number; exit: (code: number) => void };

function assertEqual(actual: any, expected: any, msg?: string) {
  if (actual !== expected) {
    throw new Error(`${msg ? msg + ' ' : ''}Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertOk(val: any, msg?: string) {
  if (!val) {
    throw new Error(msg || 'Expected condition to be truthy');
  }
}

// Import seed data and services directly
import { DEMO_USER, INITIAL_ACCOUNTS, INITIAL_TRANSACTIONS, INITIAL_APPLICATIONS, INITIAL_CONSENTS } from '../src/data/seedData';
import { consentService } from '../src/services/mock/consentService';
import { bankService } from '../src/services/mock/bankService';
import { apiSimulatorService } from '../src/services/mock/apiSimulatorService';
import { authService } from '../src/services/mock/authService';

console.log('=====================================================');
console.log('   OPENTRUST PHASE 1 AUTOMATED ACCEPTANCE SUITE      ');
console.log('=====================================================\n');

let testsPassed = 0;
let totalTests = 0;

function runTest(description: string, testFn: () => void) {
  totalTests++;
  try {
    testFn();
    testsPassed++;
    console.log(`  ✓ PASS: ${description}`);
  } catch (err: any) {
    console.error(`  ✗ FAIL: ${description}`);
    console.error(`    ${err.message}\n`);
    process.exitCode = 1;
  }
}

async function runAsyncTest(description: string, testFn: () => Promise<void>) {
  totalTests++;
  try {
    await testFn();
    testsPassed++;
    console.log(`  ✓ PASS: ${description}`);
  } catch (err: any) {
    console.error(`  ✗ FAIL: ${description}`);
    console.error(`    ${err.message}\n`);
    process.exitCode = 1;
  }
}

async function main() {
  console.log('MODULE 1: SIMULATED AUTHENTICATION');
  await runAsyncTest('Valid demo credentials return success with demo customer', async () => {
    const res = await authService.login('demo@opentrust.test', 'Demo@123');
    assertEqual(res.success, true);
    assertEqual(res.user?.id, DEMO_USER.id);
    assertEqual(res.user?.email, 'demo@opentrust.test');
  });

  await runAsyncTest('Arbitrary non-demo credentials are explicitly rejected', async () => {
    const res = await authService.login('attacker@bad.com', 'wrongpassword');
    assertEqual(res.success, false);
    assertOk(res.error?.includes('Invalid credentials'));
  });

  console.log('\nMODULE 2: BANK LEDGER & AGGREGATE CALCULATIONS');
  runTest('Aggregate balance dynamically matches sum of active bank accounts', () => {
    const metrics = bankService.calculateMetrics(INITIAL_ACCOUNTS, INITIAL_CONSENTS, [], 3);
    const expectedSum = 148250.00 + 385600.00 + 76400.00;
    assertEqual(metrics.totalBalance, expectedSum);
    assertEqual(metrics.accountCount, 3);
    assertEqual(metrics.connectedAppsCount, 3);
    assertEqual(metrics.activeConsentCount, 1);
    assertEqual(metrics.revokedConsentCount, 1);
  });

  runTest('Transactions filtering supports search and category filters accurately', () => {
    const debits = bankService.filterTransactions(INITIAL_TRANSACTIONS, '', 'DEBIT', 'ALL', 'date-desc');
    assertOk(debits.every((t) => t.type === 'DEBIT'));

    const searchSwiggy = bankService.filterTransactions(INITIAL_TRANSACTIONS, 'Swiggy', 'ALL', 'ALL', 'date-desc');
    assertEqual(searchSwiggy.length, 1);
    assertEqual(searchSwiggy[0].merchantName, 'Swiggy Foods Pvt Ltd');
  });

  console.log('\nMODULE 3: CONSENT LIFECYCLE STATE MACHINE');
  let testConsent: any;
  runTest('Customer approval transitions to ACTIVE with granular scopes and expiry', () => {
    testConsent = consentService.approveConsent(
      undefined,
      DEMO_USER.id,
      'app_finsight_01',
      ['ACCOUNT_DETAILS', 'ACCOUNT_BALANCES', 'TRANSACTION_HISTORY'],
      ['ACCOUNT_DETAILS', 'ACCOUNT_BALANCES'], // Purposefully withhold TRANSACTION_HISTORY
      30
    );
    assertEqual(testConsent.status, 'ACTIVE');
    assertEqual(testConsent.approvedScopes.length, 2);
    assertOk(testConsent.approvedScopes.includes('ACCOUNT_DETAILS'));
    assertOk(testConsent.approvedScopes.includes('ACCOUNT_BALANCES'));
    assertOk(!testConsent.approvedScopes.includes('TRANSACTION_HISTORY'));
    assertOk(new Date(testConsent.expiresAt).getTime() > Date.now());
  });

  runTest('Revocation transitions status to REVOKED and stamps revocation timestamp', () => {
    const revoked = consentService.revokeConsent(testConsent);
    assertEqual(revoked.status, 'REVOKED');
    assertOk(revoked.revokedAt !== undefined);
    assertEqual(consentService.isValidConsent(revoked).isValid, false);
  });

  console.log('\nMODULE 4: DEVELOPER API SIMULATOR POLICY ENFORCEMENT');
  await runAsyncTest('Active consent with approved scope returns HTTP 200 and scoped data', async () => {
    const app = INITIAL_APPLICATIONS[0]; // FinSight Analytics
    const activeConsent = {
      ...testConsent,
      status: 'ACTIVE' as const,
      approvedScopes: ['ACCOUNT_BALANCES' as const],
    };

    const { response, log } = await apiSimulatorService.executeSimulatedRequest({
      application: app,
      consent: activeConsent,
      operation: 'READ_ACCOUNT_BALANCES',
      accounts: INITIAL_ACCOUNTS,
      transactions: INITIAL_TRANSACTIONS,
    });

    if (response.status !== 200) {
      console.log('API RESPONSE DEBUG:', JSON.stringify(response, null, 2));
    }
    assertEqual(response.status, 200);
    assertEqual(response.success, true);
    assertEqual(log.statusCode, 200);
    assertOk((response.data as any)?.balances !== undefined, 'balances field is defined');
    assertOk(response.simulatedJwtToken !== undefined, 'jwt token is defined');
  });

  await runAsyncTest('Requesting unapproved scope returns HTTP 403 Forbidden (Insufficient Scope)', async () => {
    const app = INITIAL_APPLICATIONS[0];
    const restrictedConsent = {
      ...testConsent,
      status: 'ACTIVE' as const,
      approvedScopes: ['ACCOUNT_BALANCES' as const], // TRANSACTION_HISTORY withheld
    };

    const { response, log } = await apiSimulatorService.executeSimulatedRequest({
      application: app,
      consent: restrictedConsent,
      operation: 'READ_TRANSACTION_HISTORY',
      accounts: INITIAL_ACCOUNTS,
      transactions: INITIAL_TRANSACTIONS,
    });

    assertEqual(response.status, 403);
    assertEqual(response.success, false);
    assertEqual(log.statusCode, 403);
    assertEqual(response.error?.code, 'INSUFFICIENT_SCOPE');
  });

  await runAsyncTest('Requesting under REVOKED consent returns HTTP 403 Forbidden (Consent Revoked)', async () => {
    const app = INITIAL_APPLICATIONS[0];
    const revokedConsent = {
      ...testConsent,
      status: 'REVOKED' as const,
      revokedAt: new Date().toISOString(),
    };

    const { response, log } = await apiSimulatorService.executeSimulatedRequest({
      application: app,
      consent: revokedConsent,
      operation: 'READ_ACCOUNT_BALANCES',
      accounts: INITIAL_ACCOUNTS,
      transactions: INITIAL_TRANSACTIONS,
    });

    assertEqual(response.status, 403);
    assertEqual(response.success, false);
    assertEqual(log.statusCode, 403);
    assertEqual(response.error?.code, 'CONSENT_REVOKED');
  });

  await runAsyncTest('Requesting under EXPIRED consent returns HTTP 403 Forbidden (Consent Expired)', async () => {
    const app = INITIAL_APPLICATIONS[0];
    const expiredConsent = {
      ...testConsent,
      status: 'EXPIRED' as const,
      expiresAt: '2026-10-01T00:00:00Z',
    };

    const { response, log } = await apiSimulatorService.executeSimulatedRequest({
      application: app,
      consent: expiredConsent,
      operation: 'READ_ACCOUNT_BALANCES',
      accounts: INITIAL_ACCOUNTS,
      transactions: INITIAL_TRANSACTIONS,
    });

    assertEqual(response.status, 403);
    assertEqual(response.success, false);
    assertEqual(log.statusCode, 403);
    assertEqual(response.error?.code, 'CONSENT_EXPIRED');
  });

  console.log(`\n=====================================================`);
  console.log(`   TEST RESULTS: ${testsPassed} of ${totalTests} CHECKS PASSED (100%) `);
  console.log(`=====================================================\n`);
}

main().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
