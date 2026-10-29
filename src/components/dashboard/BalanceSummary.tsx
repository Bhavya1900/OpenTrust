import React from 'react';
import { useOpenTrust } from '../../context/OpenTrustContext';
import { formatINR } from '../../utils/formatters';
import { Wallet, ShieldCheck, Grid, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BalanceSummary: React.FC = () => {
  const { metrics } = useOpenTrust();

  const cards = [
    {
      label: 'Total Available Balance',
      value: formatINR(metrics.totalBalance),
      sublabel: `Across ${metrics.accountCount} simulated bank accounts`,
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/accounts',
      linkText: 'View Accounts',
    },
    {
      label: 'Active Consents',
      value: metrics.activeConsentCount.toString(),
      sublabel: `${metrics.revokedConsentCount} revoked • Granular permissions`,
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      link: '/consents',
      linkText: 'Manage Consents',
    },
    {
      label: 'Connected Applications',
      value: metrics.connectedAppsCount.toString(),
      sublabel: 'Registered FinTech data consumers',
      icon: Grid,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      link: '/apps',
      linkText: 'Explore Apps',
    },
    {
      label: 'Simulated API Accesses',
      value: `${metrics.recentSuccessfulAccessCount} / ${metrics.recentSuccessfulAccessCount + metrics.recentDeniedAccessCount}`,
      sublabel: `${metrics.recentDeniedAccessCount} access attempts blocked`,
      icon: ShieldAlert,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      link: '/developer',
      linkText: 'Open Console',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {card.label}
                </span>
                <div className={`p-2 rounded-xl ${card.bgColor} ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">{card.sublabel}</p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={card.link}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
              >
                {card.linkText} &rarr;
              </Link>
              <span className="text-[10px] text-slate-400 font-mono">SIMULATED</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
