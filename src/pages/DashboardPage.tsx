import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BalanceSummary } from '../components/dashboard/BalanceSummary';
import { AccountOverview } from '../components/dashboard/AccountOverview';
import { FinancialActivityChart } from '../components/dashboard/FinancialActivityChart';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { ConnectedAppsSummary } from '../components/dashboard/ConnectedAppsSummary';
import { SecuritySummary } from '../components/dashboard/SecuritySummary';
import { ShieldCheck, Terminal, Grid, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Open Banking Customer Data Sovereignty</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Arjun'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            You hold total control over which third-party applications can access your banking information. Review approved scopes, track simulated API calls, or revoke permissions at any time.
          </p>

          {/* Quick Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link to="/consents">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<ShieldCheck className="w-4 h-4" />}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Review Active Consents
              </Button>
            </Link>

            <Link to="/apps">
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-800/80 text-white border-slate-700 hover:bg-slate-700"
                leftIcon={<Grid className="w-4 h-4 text-blue-400" />}
              >
                Connected Applications
              </Button>
            </Link>

            <Link to="/developer">
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-800/80 text-white border-slate-700 hover:bg-slate-700"
                leftIcon={<Terminal className="w-4 h-4 text-emerald-400" />}
              >
                Developer API Simulator
              </Button>
            </Link>
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Aggregate Metric Summaries */}
      <BalanceSummary />

      {/* Accounts & Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AccountOverview />
          <FinancialActivityChart />
        </div>
        <div className="space-y-6">
          <RecentTransactions />
        </div>
      </div>

      {/* Connected Applications & Security Activity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConnectedAppsSummary />
        <SecuritySummary />
      </div>
    </div>
  );
};
