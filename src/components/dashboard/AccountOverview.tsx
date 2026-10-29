import React from 'react';
import { useOpenTrust } from '../../context/OpenTrustContext';
import { formatINR } from '../../utils/formatters';
import { Building2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';

export const AccountOverview: React.FC = () => {
  const { accounts } = useOpenTrust();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">Linked Bank Accounts</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulated accounts eligible for Open Banking data sharing authorization
          </p>
        </div>
        <Link
          to="/accounts"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          View All <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
                    <Building2 className="w-4 h-4 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{acc.bankCode}</h3>
                    <p className="text-[11px] text-slate-500">{acc.accountType} Account</p>
                  </div>
                </div>
                <Badge variant="emerald" size="sm" dot>
                  {acc.status}
                </Badge>
              </div>

              <div className="space-y-1 my-3">
                <span className="text-[11px] font-mono text-slate-500 tracking-wider">
                  {acc.maskedAccountNumber}
                </span>
                <div className="text-lg font-extrabold text-slate-900">
                  {formatINR(acc.balance)}
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-200/60 text-[11px] text-slate-500 flex items-center justify-between">
              <span className="truncate">{acc.branch.split(',')[0]}</span>
              <span className="font-mono text-slate-400 text-[10px]">{acc.ifscCode}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
