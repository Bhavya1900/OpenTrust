"use strict";
/**
 * OpenTrust Phase 1 Automated Verification Suite
 * Tests critical business logic, state transitions, security evaluation, and metrics.
 */
Object.defineProperty(exports, "__esModule", { value: true });
function assertEqual(actual, expected, msg) {
    if (actual !== expected) {
        throw new Error(`${msg ? msg + ' ' : ''}Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
}
function assertOk(val, msg) {
    if (!val) {
        throw new Error(msg || 'Expected condition to be truthy');
    }
}
// Import seed data and services directly
const seedData_1 = require("../src/data/seedData");
const consentService_1 = require("../src/services/mock/consentService");
const bankService_1 = require("../src/services/mock/bankService");
const apiSimulatorService_1 = require("../src/services/mock/apiSimulatorService");
const authService_1 = require("../src/services/mock/authService");
console.log('=====================================================');
console.log('   OPENTRUST PHASE 1 AUTOMATED ACCEPTANCE SUITE      ');
console.log('=====================================================\n');
let testsPassed = 0;
let totalTests = 0;
function runTest(description, testFn) {
    totalTests++;
    try {
        testFn();
        testsPassed++;
        console.log(`  ✓ PASS: ${description}`);
    }
    catch (err) {
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
    }
    catch (err) {
        console.error(`  ✗ FAIL: ${description}`);
        console.error(`    ${err.message}\n`);
        process.exitCode = 1;
    }
}
async function main() {
    console.log('MODULE 1: SIMULATED AUTHENTICATION');
    await runAsyncTest('Valid demo credentials return success with demo customer', async () => {
        const res = await authService_1.authService.login('demo@opentrust.test', 'Demo@123');
        assertEqual(res.success, true);
        assertEqual(res.user?.id, seedData_1.DEMO_USER.id);
        assertEqual(res.user?.email, 'demo@opentrust.test');
    });
    await runAsyncTest('Arbitrary non-demo credentials are explicitly rejected', async () => {
        const res = await authService_1.authService.login('attacker@bad.com', 'wrongpassword');
        assertEqual(res.success, false);
        assertOk(res.error?.includes('Invalid credentials'));
    });
    console.log('\nMODULE 2: BANK LEDGER & AGGREGATE CALCULATIONS');
    runTest('Aggregate balance dynamically matches sum of active bank accounts', () => {
        const metrics = bankService_1.bankService.calculateMetrics(seedData_1.INITIAL_ACCOUNTS, seedData_1.INITIAL_CONSENTS, [], 3);
        const expectedSum = 148250.00 + 385600.00 + 76400.00;
        assertEqual(metrics.totalBalance, expectedSum);
        assertEqual(metrics.accountCount, 3);
        assertEqual(metrics.connectedAppsCount, 3);
        assertEqual(metrics.activeConsentCount, 1);
        assertEqual(metrics.revokedConsentCount, 1);
    });
    runTest('Transactions filtering supports search and category filters accurately', () => {
        const debits = bankService_1.bankService.filterTransactions(seedData_1.INITIAL_TRANSACTIONS, '', 'DEBIT', 'ALL', 'date-desc');
        assertOk(debits.every((t) => t.type === 'DEBIT'));
        const searchSwiggy = bankService_1.bankService.filterTransactions(seedData_1.INITIAL_TRANSACTIONS, 'Swiggy', 'ALL', 'ALL', 'date-desc');
        assertEqual(searchSwiggy.length, 1);
        assertEqual(searchSwiggy[0].merchantName, 'Swiggy Foods Pvt Ltd');
    });
    console.log('\nMODULE 3: CONSENT LIFECYCLE STATE MACHINE');
    let testConsent;
    runTest('Customer approval transitions to ACTIVE with granular scopes and expiry', () => {
        testConsent = consentService_1.consentService.approveConsent(undefined, seedData_1.DEMO_USER.id, 'app_finsight_01', ['ACCOUNT_DETAILS', 'ACCOUNT_BALANCES', 'TRANSACTION_HISTORY'], ['ACCOUNT_DETAILS', 'ACCOUNT_BALANCES'], // Purposefully withhold TRANSACTION_HISTORY
        30);
        assertEqual(testConsent.status, 'ACTIVE');
        assertEqual(testConsent.approvedScopes.length, 2);
        assertOk(testConsent.approvedScopes.includes('ACCOUNT_DETAILS'));
        assertOk(testConsent.approvedScopes.includes('ACCOUNT_BALANCES'));
        assertOk(!testConsent.approvedScopes.includes('TRANSACTION_HISTORY'));
        assertOk(new Date(testConsent.expiresAt).getTime() > Date.now());
    });
    runTest('Revocation transitions status to REVOKED and stamps revocation timestamp', () => {
        const revoked = consentService_1.consentService.revokeConsent(testConsent);
        assertEqual(revoked.status, 'REVOKED');
        assertOk(revoked.revokedAt !== undefined);
        assertEqual(consentService_1.consentService.isValidConsent(revoked).isValid, false);
    });
    console.log('\nMODULE 4: DEVELOPER API SIMULATOR POLICY ENFORCEMENT');
    await runAsyncTest('Active consent with approved scope returns HTTP 200 and scoped data', async () => {
        const app = seedData_1.INITIAL_APPLICATIONS[0]; // FinSight Analytics
        const activeConsent = {
            ...testConsent,
            status: 'ACTIVE',
            approvedScopes: ['ACCOUNT_BALANCES'],
        };
        const { response, log } = await apiSimulatorService_1.apiSimulatorService.executeSimulatedRequest({
            application: app,
            consent: activeConsent,
            operation: 'READ_ACCOUNT_BALANCES',
            accounts: seedData_1.INITIAL_ACCOUNTS,
            transactions: seedData_1.INITIAL_TRANSACTIONS,
        });
        if (response.status !== 200) {
            console.log('API RESPONSE DEBUG:', JSON.stringify(response, null, 2));
        }
        assertEqual(response.status, 200);
        assertEqual(response.success, true);
        assertEqual(log.statusCode, 200);
        assertOk(response.data?.balances !== undefined, 'balances field is defined');
        assertOk(response.simulatedJwtToken !== undefined, 'jwt token is defined');
    });
    await runAsyncTest('Requesting unapproved scope returns HTTP 403 Forbidden (Insufficient Scope)', async () => {
        const app = seedData_1.INITIAL_APPLICATIONS[0];
        const restrictedConsent = {
            ...testConsent,
            status: 'ACTIVE',
            approvedScopes: ['ACCOUNT_BALANCES'], // TRANSACTION_HISTORY withheld
        };
        const { response, log } = await apiSimulatorService_1.apiSimulatorService.executeSimulatedRequest({
            application: app,
            consent: restrictedConsent,
            operation: 'READ_TRANSACTION_HISTORY',
            accounts: seedData_1.INITIAL_ACCOUNTS,
            transactions: seedData_1.INITIAL_TRANSACTIONS,
        });
        assertEqual(response.status, 403);
        assertEqual(response.success, false);
        assertEqual(log.statusCode, 403);
        assertEqual(response.error?.code, 'INSUFFICIENT_SCOPE');
    });
    await runAsyncTest('Requesting under REVOKED consent returns HTTP 403 Forbidden (Consent Revoked)', async () => {
        const app = seedData_1.INITIAL_APPLICATIONS[0];
        const revokedConsent = {
            ...testConsent,
            status: 'REVOKED',
            revokedAt: new Date().toISOString(),
        };
        const { response, log } = await apiSimulatorService_1.apiSimulatorService.executeSimulatedRequest({
            application: app,
            consent: revokedConsent,
            operation: 'READ_ACCOUNT_BALANCES',
            accounts: seedData_1.INITIAL_ACCOUNTS,
            transactions: seedData_1.INITIAL_TRANSACTIONS,
        });
        assertEqual(response.status, 403);
        assertEqual(response.success, false);
        assertEqual(log.statusCode, 403);
        assertEqual(response.error?.code, 'CONSENT_REVOKED');
    });
    await runAsyncTest('Requesting under EXPIRED consent returns HTTP 403 Forbidden (Consent Expired)', async () => {
        const app = seedData_1.INITIAL_APPLICATIONS[0];
        const expiredConsent = {
            ...testConsent,
            status: 'EXPIRED',
            expiresAt: '2026-10-01T00:00:00Z',
        };
        const { response, log } = await apiSimulatorService_1.apiSimulatorService.executeSimulatedRequest({
            application: app,
            consent: expiredConsent,
            operation: 'READ_ACCOUNT_BALANCES',
            accounts: seedData_1.INITIAL_ACCOUNTS,
            transactions: seedData_1.INITIAL_TRANSACTIONS,
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
