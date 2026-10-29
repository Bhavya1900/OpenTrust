import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  WalletCards,
  Receipt,
  Grid,
  ShieldCheck,
  Activity,
  Terminal,
  Settings,
  LogOut,
  Shield,
  User as UserIcon,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOpenTrust } from '../../context/OpenTrustContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const { consents, resetDemoData } = useOpenTrust();
  const navigate = useNavigate();

  const activeConsentsCount = consents.filter((c) => c.status === 'ACTIVE').length;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Accounts', path: '/accounts', icon: WalletCards },
    { label: 'Transactions', path: '/transactions', icon: Receipt },
    { label: 'Connected Apps', path: '/apps', icon: Grid },
    {
      label: 'Consent Management',
      path: '/consents',
      icon: ShieldCheck,
      badge: activeConsentsCount > 0 ? activeConsentsCount : undefined,
    },
    { label: 'Security Activity', path: '/activity', icon: Activity },
    { label: 'Developer Console', path: '/developer', icon: Terminal, highlight: true },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-900/40">
            <Shield className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight">OpenTrust</span>
              <span className="text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded">
                PROTOTYPE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Consent & Data Sharing</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Customer Portal
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                } ${item.highlight ? 'border border-blue-500/30' : ''}`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* Reset State Helper for evaluator */}
        <div className="pt-4 px-1">
          <button
            onClick={() => {
              if (window.confirm('Reset all demo consent states & simulator logs back to seed values?')) {
                resetDemoData();
              }
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Reset prototype state back to initial seed data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </nav>

      {/* User Card & Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-900/60 border border-blue-600/50 flex items-center justify-center text-blue-300 flex-shrink-0 font-bold text-xs">
              {user?.name.split(' ').map((n) => n[0]).join('') || <UserIcon className="w-4 h-4" />}
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Demo Customer'}</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">{user?.maskedCustomerId || 'CUST-IN-984210'}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out of prototype"
            className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-700/60 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Educational Footer */}
        <div className="text-[10px] text-slate-400 text-center leading-tight">
          L&T College Project • Phase 1 Prototype
        </div>
      </div>
    </aside>
  );
};
