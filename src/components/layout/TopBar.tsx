import React from 'react';
import { Menu, ShieldAlert, Terminal, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../common/Button';

interface TopBarProps {
  onOpenMobileMenu: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileMenu }) => {
  const location = useLocation();

  const getPageInfo = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return { title: 'Customer Dashboard', category: 'Overview' };
    if (path.startsWith('/accounts')) return { title: 'My Accounts', category: 'Banking' };
    if (path.startsWith('/transactions')) return { title: 'Transactions Explorer', category: 'Activity' };
    if (path.startsWith('/apps')) return { title: 'Connected Applications', category: 'Ecosystem' };
    if (path.startsWith('/consent/request')) return { title: 'Consent Authorization Request', category: 'Consent' };
    if (path.startsWith('/consents')) return { title: 'Consent Management', category: 'Governance' };
    if (path.startsWith('/activity')) return { title: 'Security Activity Log', category: 'Audit' };
    if (path.startsWith('/developer')) return { title: 'Developer Console & Simulator', category: 'API Testing' };
    if (path.startsWith('/settings')) return { title: 'Preferences & Identity', category: 'Settings' };
    return { title: 'OpenTrust', category: 'Platform' };
  };

  const page = getPageInfo();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile hamburger & Page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">
              {page.category}
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">/</span>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {page.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Right: Demo Environment tag & Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Demo indicator pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>SIMULATED ENVIRONMENT</span>
        </div>

        {/* Quick Simulator CTA */}
        {location.pathname !== '/developer' ? (
          <Link to="/developer">
            <Button variant="outline" size="sm" leftIcon={<Terminal className="w-3.5 h-3.5 text-blue-600" />}>
              API Simulator
            </Button>
          </Link>
        ) : (
          <Link to="/consents">
            <Button variant="outline" size="sm" leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}>
              Manage Consents
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};
