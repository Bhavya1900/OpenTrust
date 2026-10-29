import React, { useState } from 'react';
import { useOpenTrust } from '../context/OpenTrustContext';
import { BankAccount } from '../types';
import { formatINR } from '../utils/formatters';
import { Building2, Shield, Eye, Info, CheckCircle2 } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { AccountDetailModal } from '../components/accounts/AccountDetailModal';

export const AccountsPage: React.FC = () => {
  const { accounts, transactions } = useOpenTrust();
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

  const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            My Bank Accounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Simulated accounts registered to customer identity Arjun V. Sharma
          </p>
        </div>

        <div className="bg-white p-3 px-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="text-xs text-slate-500">Cumulative Liquid Balance</div>
          <div className="text-lg font-black text-slate-900">{formatINR(totalBalance)}</div>
        </div>
      </div>

      {/* Security Architecture Notice */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3 text-xs text-blue-950">
        <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Open Banking Architectural Separation:</strong> In Open Banking, this page represents your primary banking interface. External third-party apps do not connect directly here; they must issue authorization requests that you approve with granular scopes.
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-800 shadow-xs">
                    <Building2 className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{acc.bankName}</h3>
                    <p className="text-xs text-slate-500">{acc.accountType} Account</p>
                  </div>
                </div>
                <Badge variant="emerald" size="sm" dot>
                  {acc.status}
                </Badge>
              </div>

              <div className="space-y-1 mb-4 p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-400">Masked Account Number</div>
                <div className="font-mono font-semibold text-slate-700 text-sm">
                  {acc.maskedAccountNumber}
                </div>
              </div>

              <div className="mb-4">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Available Balance
                </span>
                <div className="text-2xl font-black text-slate-900 mt-0.5">
                  {formatINR(acc.balance)}
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Branch:</span>
                  <span className="font-medium text-slate-700">{acc.branch.split(',')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">IFSC:</span>
                  <span className="font-mono text-slate-700">{acc.ifscCode}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                leftIcon={<Eye className="w-3.5 h-3.5" />}
                onClick={() => setSelectedAccount(acc)}
              >
                View Account Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Account Details Modal */}
      <AccountDetailModal
        account={selectedAccount}
        isOpen={!!selectedAccount}
        onClose={() => setSelectedAccount(null)}
        transactions={transactions}
      />

      {/* Compliance Information */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>RBI Account Aggregator Framework Alignment (Simulation)</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>KYC Verified</span>
        </div>
      </div>
    </div>
  );
};
