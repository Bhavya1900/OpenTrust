# OpenTrust — Open Banking Consent & Secure Data Sharing System
> **College Project for L&T** — Simple Open Banking Consent & Secure Data Sharing System  
> **Phase 1: Complete UI Foundation & Interactive Prototype**

---

## 1. Problem Statement & Architecture

Open Banking empowers bank customers to securely authorize third-party FinTech applications to access select categories of financial data through standardized APIs. Customers must retain complete, transparent control over:
- **Which applications** can access their financial records.
- **Which granular categories** of data (Account Details, Balances, Transactions) are shared.
- **How long** the authorization remains valid (1 day, 7 days, 30 days).
- **Instant revocation**, immediately terminating access tokens and causing subsequent API calls to be denied.

### Phase 1 Implementation Scope
Phase 1 delivers a complete, visually polished, interactive frontend prototype with a typed mock service layer. All business logic, session checks, consent enforcement rules, and simulated API access controls are strictly isolated within the service layer (`src/services/mock/`), ensuring the application can be seamlessly transitioned to a real Express.js + MongoDB backend in Phase 2 without a frontend rewrite.

---

## 2. Technology Stack

- **Framework**: React 18 with TypeScript 5
- **Tooling & Bundler**: Vite 5 (with `@rollup/wasm-node` fallback for Windows App Control compatibility)
- **Styling**: Tailwind CSS with custom FinTech navy/slate palette
- **Routing**: React Router v6 (nested layouts, protected route guards)
- **Icons**: Lucide React
- **Data Visualizations**: Recharts (Cashflow inflow/outflow & Category expense distribution)
- **Locale & Currency**: Indian Rupee (`₹` INR) formatting with realistic Indian banking structures (HDFC, ICICI, SBI)

---

## 3. Directory Structure

```
c:\Users\Bhavya\Desktop\OpenTrust\
├── index.html                       # HTML entry point with Plus Jakarta Sans & JetBrains Mono
├── package.json                     # Scripts (dev, build, preview, test, postinstall)
├── tsconfig.json                    # Strict TypeScript configuration
├── tailwind.config.js               # Design tokens (navy, emerald, amber, rose)
├── dist/                            # Production build output
├── dist-test/                       # Compiled automated test suite
├── scripts/
│   └── verifyPhase1.ts              # Automated test suite verifying 10 critical checks
├── src/
│   ├── main.tsx                     # React DOM entry point
│   ├── App.tsx                      # Root component with providers
│   ├── index.css                    # Tailwind base styles and custom scrollbars
│   ├── types/
│   │   ├── index.ts                 # Typed interfaces (User, BankAccount, Transaction, Consent, AuditEvent, etc.)
│   │   └── lucide-react.d.ts        # Type declarations for icons
│   ├── data/
│   │   └── seedData.ts              # Fictitious Indian demo dataset (Arjun Sharma, 3 banks, 18 txns, 3 apps)
│   ├── services/
│   │   └── mock/
│   │       ├── authService.ts       # Simulated authentication, demo credentials validation, session storage
│   │       ├── bankService.ts       # Metric aggregations, transaction filtering, chart datasets
│   │       ├── consentService.ts    # State machine for consent grant, expiry, and revocation
│   │       └── apiSimulatorService.ts # Policy evaluator for Developer Console (200 OK / 403 Forbidden)
│   ├── context/
│   │   ├── AuthContext.tsx          # Current demo customer authentication state
│   │   └── OpenTrustContext.tsx     # Centralized state management for consents, accounts, logs & events
│   ├── components/
│   │   ├── common/                  # Reusable UI (Badge, Button, Modal, ConfirmationDialog, JsonViewer, EmptyState)
│   │   ├── layout/                  # Shell (AppLayout, Sidebar, TopBar, DemoBanner)
│   │   ├── dashboard/               # BalanceSummary, AccountOverview, FinancialActivityChart, RecentTransactions, etc.
│   │   ├── consent/                 # GranularPermissionCard, DurationSelector, ConsentSummaryCard
│   │   ├── accounts/                # AccountDetailModal
│   │   └── developer/               # SimulatedTokenViewer
│   ├── pages/
│   │   ├── LoginPage.tsx            # /login
│   │   ├── DashboardPage.tsx        # /dashboard
│   │   ├── AccountsPage.tsx         # /accounts
│   │   ├── TransactionsPage.tsx     # /transactions
│   │   ├── ConnectedAppsPage.tsx    # /apps
│   │   ├── ConsentRequestPage.tsx   # /consent/request/:appId & /consent/:consentId
│   │   ├── ConsentManagementPage.tsx# /consents
│   │   ├── SecurityActivityPage.tsx # /activity
│   │   ├── DeveloperConsolePage.tsx # /developer
│   │   ├── SettingsPage.tsx         # /settings
│   │   └── NotFoundPage.tsx         # Catch-all 404
│   ├── routes/
│   │   └── AppRoutes.tsx            # Protected route guards and route tree
│   └── utils/
│       └── formatters.ts            # Indian currency, relative timestamps, account maskers
```

---

## 4. Demo Credentials

The prototype enforces credential verification against the simulated customer identity:

- **Email**: `demo@opentrust.test`
- **Password**: `Demo@123`
- **Customer Name**: Arjun V. Sharma
- **Customer ID**: `CUST-IN-984210`

*(A one-click "Autofill" button is available on the login card for convenience during college evaluation).*

---

## 5. End-to-End Evaluation Workflow

Follow this demonstration sequence to evaluate the complete Open Banking lifecycle:

1. **Login Simulation (`/login`)**:
   - Navigate to `/login`. Sign in using `demo@opentrust.test` and `Demo@123`.
   - Observe that invalid credentials produce clear error alerts.
   - Upon sign-in, you are securely redirected to the **Customer Dashboard**.

2. **Customer Dashboard (`/dashboard`)**:
   - Inspect the **Aggregate Available Balance** (`₹ 6,10,250.00`), dynamically calculated from the 3 underlying bank accounts.
   - Review the **Financial Activity Analytics** charts (Income vs Expense bar chart or Spending Breakdown pie chart).
   - Review recent Indian transactions (Infosys salary, Swiggy, Croma, Tata Power, etc.).

3. **Explore Bank Accounts (`/accounts`)**:
   - View seeded Indian accounts: HDFC Bank (Savings), ICICI Bank (Current), State Bank of India (Salary).
   - Click **View Account Details** to open the modal showing masked account numbers, branch, IFSC codes, and account-specific transactions.

4. **Transactions Explorer (`/transactions`)**:
   - Search across descriptions, merchants, or reference IDs (e.g. search "Swiggy" or "Infosys").
   - Filter by **Debits** or **Credits**, filter by category, and observe that summary totals dynamically re-calculate from the filtered dataset.

5. **Connected Applications (`/apps`)**:
   - Review the 3 registered demo clients:
     - **FinSight Analytics** (Personal Finance & AI Insights)
     - **BudgetWise** (Zero-based budgeting & bills)
     - **WealthTrack** (Wealth & asset allocation)
   - Click **Inspect App** to see developer identity and requested default scopes.

6. **Dedicated Consent Authorization (`/consent/request/:appId`)**:
   - Open authorization for an application.
   - Test **Granular Scopes**: check or uncheck individual permissions (*Account Details*, *Account Balances*, *Transaction History*).
   - Test **Duration Selector**: toggle between 1 day, 7 days, and 30 days and watch the expiration timestamp update dynamically.
   - Notice that if no scopes are selected, the approval button is safely disabled.
   - Click **Allow Access** or **Deny Request** to verify that application state, audit events, and metrics immediately update.

7. **Developer Console & API Simulator (`/developer`)**:
   - **Test 1 (Approved Access)**: Select **FinSight Analytics**, choose **Read Account Balances**, and click **Send Simulated API Request**.
     - Observe: **HTTP 200 OK**, response duration in ms, simulated JWT token header, and sanitized balance payload (without transactions).
   - **Test 2 (Insufficient Scope Enforcement)**: With FinSight Analytics selected, choose **Read Transaction History**.
     - Observe: **HTTP 403 Forbidden** (`INSUFFICIENT_SCOPE`), because customer consent excluded transactions!
   - **Test 3 (Revocation Lifecycle)**: Go to **Consent Management** (`/consents`), click **Revoke** on FinSight Analytics, and confirm in the dialog.
     - Return to **Developer Console** and re-send the request.
     - Observe: Immediate **HTTP 403 Forbidden** (`CONSENT_REVOKED`), proving access is revoked end-to-end!

8. **Security & Audit Activity (`/activity`)**:
   - Inspect the complete audit trail showing login events, consent grants, customer revocations, and blocked API attempts.
   - Filter by outcome (*Permitted* vs *Denied*) or category (*API Access* vs *Consent Lifecycle*).

9. **Settings & Environment Reset (`/settings`)**:
   - View customer KYC details and simulated environment specifications.
   - Click **Reset Seed Data to Factory Defaults** if you want to restart the evaluation from the clean initial state.

---

## 6. How to Run the Application on Windows

### Prerequisites
- Node.js (v18, v20, or v22+)
- Windows PowerShell or Command Prompt

### Development Server
To launch the interactive prototype on your local browser:

```powershell
npm run dev
```

Open your browser to:
```
http://localhost:5173
```

### Production Build
To compile the TypeScript project and create the optimized production bundle:

```powershell
npm run build
```

The output will be placed in `dist/`.

### Automated Verification Test Suite
To execute the automated acceptance suite verifying all 10 critical state transitions:

```powershell
npm test
```

Expected output:
```
=====================================================
   OPENTRUST PHASE 1 AUTOMATED ACCEPTANCE SUITE      
=====================================================

MODULE 1: SIMULATED AUTHENTICATION
  ✓ PASS: Valid demo credentials return success with demo customer
  ✓ PASS: Arbitrary non-demo credentials are explicitly rejected

MODULE 2: BANK LEDGER & AGGREGATE CALCULATIONS
  ✓ PASS: Aggregate balance dynamically matches sum of active bank accounts
  ✓ PASS: Transactions filtering supports search and category filters accurately

MODULE 3: CONSENT LIFECYCLE STATE MACHINE
  ✓ PASS: Customer approval transitions to ACTIVE with granular scopes and expiry
  ✓ PASS: Revocation transitions status to REVOKED and stamps revocation timestamp

MODULE 4: DEVELOPER API SIMULATOR POLICY ENFORCEMENT
  ✓ PASS: Active consent with approved scope returns HTTP 200 and scoped data
  ✓ PASS: Requesting unapproved scope returns HTTP 403 Forbidden (Insufficient Scope)
  ✓ PASS: Requesting under REVOKED consent returns HTTP 403 Forbidden (Consent Revoked)
  ✓ PASS: Requesting under EXPIRED consent returns HTTP 403 Forbidden (Consent Expired)

=====================================================
   TEST RESULTS: 10 of 10 CHECKS PASSED (100%) 
=====================================================
```

---

## 7. Strict Security & Phase 1 Boundaries

- **Simulated Authentication**: Session state is maintained in `sessionStorage` strictly for prototype continuity. Passwords and simulated tokens are **never** persisted in `localStorage`.
- **Mock Service Isolation**: All API verification logic resides in `src/services/mock/apiSimulatorService.ts`. In Phase 2, this will be replaced with real HTTP calls to the Express backend.
- **Data Privacy**: No real bank connections or financial transactions exist. All accounts, PANs, and INR transaction amounts are fictional educational dummy data.
- **No Phase 2 Backend Implementation**: No Express server, MongoDB schemas, or real cryptographic OAuth signing have been written, in strict compliance with the Phase 1 instructions.
