import React from 'react';
import { BankAccount, Transaction } from '../../types';
import { Modal } from '../common/Modal';
import { formatINR, formatDateOnly } from '../../utils/formatters';
import { Building2, ShieldCheck, CreditCard, MapPin, Hash, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Badge } from '../common/Badge';

interface AccountDetailModalProps {
  account: BankAccount | null;
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  account,
  isOpen,
  onClose,
  transactions,
}) => {
  if (!account) return null;

  const accountTxns = transactions.filter((t) => t.accountId === account.id).slice(0, 5);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={account.bankName}
      subtitle={`${account.accountType} Account • ${account.maskedAccountNumber}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Balance Header Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-200">
              Available Simulated Balance
            </span>
            <Badge variant="emerald" size="sm" dot>
              {account.status}
            </Badge>
          </div>
          <div className="text-3xl font-extrabold tracking-tight">
            {formatINR(account.balance)}
          </div>
          <div className="mt-3 pt-3 border-t border-blue-900/60 flex items-center justify-between text-xs text-blue-200">
            <span>Currency: {account.currency}</span>
            <span className="font-mono text-xs">{account.maskedAccountNumber}</span>
          </div>
        </div>

        {/* Account Metadata Details */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Bank Name</span>
            </div>
            <div className="font-semibold text-slate-800">{account.bankName}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Account Type</span>
            </div>
            <div className="font-semibold text-slate-800">{account.accountType}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Hash className="w-3.5 h-3.5" />
              <span>IFSC Code</span>
            </div>
            <div className="font-mono font-semibold text-slate-800">{account.ifscCode}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Branch Location</span>
            </div>
            <div className="font-semibold text-slate-800 truncate">{account.branch}</div>
          </div>
        </div>

        {/* Security & Open Banking info */}
        <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
          <ShieldCheck className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong>Open Banking Integration:</strong> Third-party applications can only access this account balance or transaction history if explicitly granted through an active consent with corresponding scope.
          </p>
        </div>

        {/* Recent Transactions for this Account */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
            Recent Account Activity
          </h4>
          {accountTxns.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">No recent transactions for this account.</p>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
              {accountTxns.map((t) => {
                const isCredit = t.type === 'CREDIT';
                return (
                  <div key={t.id} className="p-3 flex items-center justify-between text-xs bg-white">
                    <div className="flex items-center gap-2.5 truncate">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isCredit ? (
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-slate-800 truncate">{t.description}</div>
                        <div className="text-[10px] text-slate-400">{formatDateOnly(t.timestamp)}</div>
                      </div>
                    </div>
                    <div
                      className={`font-bold ml-2 ${
                        isCredit ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isCredit ? `+ ${formatINR(t.amount)}` : `- ${formatINR(t.amount)}`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
