/**
 * OpenTrust Phase 1 Automated Verification Suite
 * Tests critical business logic, state transitions, security evaluation, and metrics.
 */

import assert from 'node:assert';

// Import seed data and services
import { DEMO_USER, INITIAL_ACCOUNTS, INITIAL_TRANSACTIONS, INITIAL_APPLICATIONS, INITIAL_CONSENTS } from '../src/data/seedData.js';
import { consentService } from '../src/services/mock/consentService.js';
import { bankService } from '../src/services/mock/bankService.js';
import { apiSimulatorService } from '../src/services/mock/apiSimulatorService.js';
import { authService } from '../src/services/mock/authService.js';

console.log('--- STARTING OPENTRUST PHASE 1 ACCEPTANCE TESTS ---\n');

let testsPassed = 0;
let totalTests = 0;

function runTest(description, testFn) {
  totalTests++;
  try {
    testFn();
    testsPassed++;
    console.log(`  ✓ PASS: ${description}`);
  } catch (err) {
    console.error(`  ✗ FAIL: ${description}`);
    console.error(`    ${err.message}\n`);
    process.exitCode = 1;
  }
}

async function runAsyncTest(description, testFn) {
  totalTests++;
  try {
    await testFn();
    testsPassed++;
    console.log(`  ✓ PASS: ${description}`);
  } catch (err) {
    console.error(`  ✗ FAIL: ${description}`);
    console.error(`    ${err.message}\n`);
    process.exitCode = 1;
  }
}

async function main() {
  console.log('1. AUTHENTICATION SERVICE VERIFICATION');
  await runAsyncTest('Valid demo credentials return success with demo user', async () => {
    const res = await authService.login('demo@opentrust.test', 'Demo@123');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.user?.id, DEMO_USER.id);
    assert.strictEqual(res.user?.email, 'demo@opentrust.test');
  });

  await runAsyncTest('Invalid credentials are appropriately rejected', async () => {
    const res = await authService.login('attacker@bad.com', 'wrongpassword');
    assert.strictEqual(res.success, false);
    assert.ok(res.error?.includes('Invalid credentials'));
  });

  console.log('\n2. BANK DATA & AGGREGATE CALCULATIONS');
  runTest('Aggregate balance exactly equals sum of active seeded accounts', () => {
    const metrics = bankService.calculateMetrics(INITIAL_ACCOUNTS, INITIAL_CONSENTS, [], 3);
    const expectedSum = 148250.00 + 385600.00 + 76400.00;
    assert.strictEqual(metrics.totalBalance, expectedSum);
    assert.strictEqual(metrics.accountCount, 3);
    assert.strictEqual(metrics.connectedAppsCount, 3);
    assert.strictEqual(metrics.activeConsentCount, 1);
    assert.strictEqual(metrics.revokedConsentCount, 1);
  });

  runTest('Transaction filters return correct subsets by search and type', () => {
    const debits = bankService.filterTransactions(INITIAL_TRANSACTIONS, '', 'DEBIT', 'ALL', 'date-desc');
    assert.ok(debits.every(t => t.type === 'DEBIT'));

    const searchSwiggy = bankService.filterTransactions(INITIAL_TRANSACTIONS, 'Swiggy', 'ALL', 'ALL', 'date-desc');
    assert.strictEqual(searchSwiggy.length, 1);
    assert.strictEqual(searchSwiggy[0].merchantName, 'Swiggy Foods Pvt Ltd');
  });

  console.log('\n3. CONSENT LIFECYCLE & STATE TRANSITIONS');
  let testConsent;
  runTest('Customer approval creates ACTIVE consent with granular scopes and expiry', () => {
    testConsent = consentService.approveConsent(
      undefined,
      DEMO_USER.id,
      'app_finsight_01',
      ['ACCOUNT_DETAILS', 'ACCOUNT_BALANCES', 'TRANSACTION_HISTORY'],
      ['ACCOUNT_DETAILS', 'ACCOUNT_BALANCES'], // Purposefully withhold TRANSACTION_HISTORY
      30
    );
    assert.strictEqual(testConsent.status, 'ACTIVE');
    assert.strictEqual(testConsent.approvedScopes.length, 2);
    assert.ok(testConsent.approvedScopes.includes('ACCOUNT_DETAILS'));
    assert.ok(testConsent.approvedScopes.includes('ACCOUNT_BALANCES'));
    assert.ok(!testConsent.approvedScopes.includes('TRANSACTION_HISTORY'));
    assert.ok(new Date(testConsent.expiresAt).getTime() > Date.now());
  });

  runTest('Revocation transitions consent status to REVOKED and sets timestamp', () => {
    const revoked = consentService.revokeConsent(testConsent);
    assert.strictEqual(revoked.status, 'REVOKED');
    assert.ok(revoked.revokedAt !== undefined);
    assert.strictEqual(consentService.isValidConsent(revoked).isValid, false);
  });

  console.log('\n4. DEVELOPER API SIMULATOR POLICY ENFORCEMENT');
  await runAsyncTest('Active consent with approved scope returns HTTP 200 and scoped data', async () => {
    const app = INITIAL_APPLICATIONS[0]; // FinSight Analytics
    const activeConsent = {
      ...testConsent,
      status: 'ACTIVE',
      approvedScopes: ['ACCOUNT_BALANCES'],
    };

    const { response, log } = await apiSimulatorService.executeSimulatedRequest({
      application: app,
      consent: activeConsent,
      operation: 'READ_ACCOUNT_BALANCES',
      accounts: INITIAL_ACCOUNTS,
      transactions: INITIAL_TRANSACTIONS,
    });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.success, true);
    assert.strictEqual(log.statusCode, 200);
    assert.ok(response.data?.balances !== undefined);
    assert.ok(response.simulatedJwtToken?.includes('OPENTRUST_PROTOTYPE_SIMULATION'));
  });

  await runAsyncTest('Requesting unapproved scope returns HTTP 403 Forbidden (Insufficient Scope)', async () => {
    const app = INITIAL_APPLICATIONS[0];
    const restrictedConsent = {
      ...testConsent,
      status: 'ACTIVE',
      approvedScopes: ['ACCOUNT_BALANCES'], // TRANSACTION_HISTORY omitted
    };

    const { response, log } = await apiSimulatorService.executeSimulatedRequest({
      application: app,
      consent: restrictedConsent,
      operation: 'READ_TRANSACTION_HISTORY',
      accounts: INITIAL_ACCOUNTS,
      transactions: INITIAL_TRANSACTIONS,
    });

    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.success, false);
    assert.strictEqual(log.statusCode, 403);
    assert.strictEqual(response.error?.code, 'INSUFFICIENT_SCOPE');
  });

  await runAsyncTest('Requesting under REVOKED consent returns HTTP 403 Forbidden (Consent Revoked)', async () => {
    const app = INITIAL_APPLICATIONS[0];
    const revokedConsent = {
      ...testConsent,
      status: 'REVOKED',
      revokedAt: new Date().toISOString(),
    };

    const { response, log } = await apiSimulatorService.executeSimulatedRequest({
      application: app,
      consent: revokedConsent,
      operation: 'READ_ACCOUNT_BALANCES',
      accounts: INITIAL_ACCOUNTS,
      transactions: INITIAL_TRANSACTIONS,
    });

    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.success, false);
    assert.strictEqual(log.statusCode, 403);
    assert.strictEqual(response.error?.code, 'CONSENT_REVOKED');
  });

  await runAsyncTest('Requesting under EXPIRED consent returns HTTP 403 Forbidden (Consent Expired)', async () => {
    const app = INITIAL_APPLICATIONS[0];
    const expiredConsent = {
      ...testConsent,
      status: 'EXPIRED',
      expiresAt: '2026-10-01T00:00:00Z',
    };

    const { response, log } = await apiSimulatorService.executeSimulatedRequest({
      application: app,
      consent: expiredConsent,
      operation: 'READ_ACCOUNT_BALANCES',
      accounts: INITIAL_ACCOUNTS,
      transactions: INITIAL_TRANSACTIONS,
    });

    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.success, false);
    assert.strictEqual(log.statusCode, 403);
    assert.strictEqual(response.error?.code, 'CONSENT_EXPIRED');
  });

  console.log(`\n--- TEST RUN COMPLETE: ${testsPassed}/${totalTests} PASSED ---`);
}

main().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
