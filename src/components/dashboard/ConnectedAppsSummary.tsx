import React from 'react';
import { useOpenTrust } from '../../context/OpenTrustContext';
import { formatDateOnly } from '../../utils/formatters';
import { ArrowUpRight, TrendingUp, PieChart, ShieldCheck, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';

export const ConnectedAppsSummary: React.FC = () => {
  const { applications, consents } = useOpenTrust();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'PieChart':
        return <PieChart className="w-5 h-5 text-purple-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      default:
        return <ExternalLink className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">Connected Applications</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Third-party FinTech clients registered in the ecosystem
          </p>
        </div>
        <Link
          to="/apps"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          All Apps <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {applications.map((app) => {
          const consent = consents.find((c) => c.applicationId === app.id);
          const status = consent ? consent.status : 'PENDING';

          const badgeVariant =
            status === 'ACTIVE'
              ? 'emerald'
              : status === 'REVOKED'
              ? 'red'
              : status === 'EXPIRED'
              ? 'slate'
              : 'amber';

          return (
            <div
              key={app.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center">
                    {getIcon(app.icon)}
                  </div>
                  <Badge variant={badgeVariant} size="sm" dot>
                    {status}
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{app.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {app.description}
                </p>

                {consent && consent.status === 'ACTIVE' && (
                  <div className="mt-3 pt-3 border-t border-slate-200/60">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Approved Data Scopes:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {consent.approvedScopes.map((scope) => (
                        <span
                          key={scope}
                          className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium border border-blue-100"
                        >
                          {scope === 'ACCOUNT_DETAILS'
                            ? 'Details'
                            : scope === 'ACCOUNT_BALANCES'
                            ? 'Balances'
                            : 'Transactions'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  {consent?.expiresAt ? `Exp: ${formatDateOnly(consent.expiresAt)}` : 'No active grant'}
                </span>

                <Link
                  to={consent ? `/consents` : `/consent/request/${app.id}`}
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  {consent ? 'Review Consent' : 'Authorize &rarr;'}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
