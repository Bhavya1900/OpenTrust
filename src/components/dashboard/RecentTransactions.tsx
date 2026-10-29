import React from 'react';
import { useOpenTrust } from '../../context/OpenTrustContext';
import { formatINR, formatDateOnly } from '../../utils/formatters';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecentTransactions: React.FC = () => {
  const { transactions } = useOpenTrust();
  const recent = transactions.slice(0, 6);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Recent Transactions</h2>
          <p className="text-xs text-slate-500 mt-0.5">Customer ledger activity</p>
        </div>
        <Link
          to="/transactions"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          View All <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {recent.map((txn) => {
          const isCredit = txn.type === 'CREDIT';
          return (
            <div
              key={txn.id}
              className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {isCredit ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
                <div className="truncate">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                    {txn.description}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>{formatDateOnly(txn.timestamp)}</span>
                    <span>•</span>
                    <span className="truncate">{txn.category}</span>
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div
                  className={`text-xs sm:text-sm font-bold ${
                    isCredit ? 'text-emerald-600' : 'text-slate-900'
                  }`}
                >
                  {isCredit ? `+ ${formatINR(txn.amount)}` : `- ${formatINR(txn.amount)}`}
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  {txn.type}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
