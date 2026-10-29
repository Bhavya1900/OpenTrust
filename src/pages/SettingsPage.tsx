import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOpenTrust } from '../context/OpenTrustContext';
import { DEMO_USER } from '../data/seedData';
import {
  LogOut,
  Info,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { resetDemoData } = useOpenTrust();
  const navigate = useNavigate();

  const [notificationState, setNotificationState] = useState(true);
  const [auditTelemetry, setAuditTelemetry] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleReset = () => {
    resetDemoData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  const customer = user || DEMO_USER;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Settings & Identity
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review demo customer profile and simulated Open Banking environment configurations
        </p>
      </div>

      {resetSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Demo state reset to initial seed dataset successfully.</span>
        </div>
      )}

      {/* Customer Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md">
              {customer.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{customer.name}</h3>
                <Badge variant="emerald" size="sm" dot>
                  {customer.kycStatus}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Customer ID: {customer.maskedCustomerId}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block mb-1">Email Address (Demo)</span>
            <span className="font-semibold text-slate-800">{customer.email}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block mb-1">Registered Phone</span>
            <span className="font-mono font-semibold text-slate-800">{customer.phone}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block mb-1">Permanent Account Number (PAN)</span>
            <span className="font-mono font-semibold text-slate-800">{customer.panMasked}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block mb-1">Consent Framework Protocol</span>
            <span className="font-semibold text-blue-700">Open Banking Account Aggregator 1.0</span>
          </div>
        </div>
      </div>

      {/* Prototype Environment Details */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Prototype Environment Details</h3>

        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-blue-900">
            <Info className="w-4 h-4 text-blue-700" />
            <span>Phase 1 Architecture Boundary (Academic Submission)</span>
          </div>
          <p className="leading-relaxed">
            This application is Phase 1 of the 3-phase Open Banking system for L&T. Authentication, consent state, and API evaluations are managed through typed in-memory mock services with realistic Indian banking structures. The subsequent Phase 2 will introduce the Express.js REST backend, MongoDB persistence, and real JWT verification without requiring UI rewrites.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Runtime Layer:</span>
            <strong className="text-slate-800">React + TypeScript (Vite)</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">State Management:</span>
            <strong className="text-slate-800">React Context + Typed Services</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Currency Locale:</span>
            <strong className="text-slate-800">INR (₹) - en-IN</strong>
          </div>
        </div>
      </div>

      {/* Preferences & Reset */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Evaluation Controls</h3>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <div className="font-semibold text-slate-800">Simulate Real-Time Audit Telemetry</div>
              <div className="text-slate-500 text-[11px]">Log simulated API calls to Security Activity immediately</div>
            </div>
            <input
              type="checkbox"
              checked={auditTelemetry}
              onChange={(e) => setAuditTelemetry(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <div className="font-semibold text-slate-800">Automatic Revocation Propagation</div>
              <div className="text-slate-500 text-[11px]">Immediately deny API simulator requests when consent is revoked</div>
            </div>
            <input
              type="checkbox"
              checked={notificationState}
              onChange={(e) => setNotificationState(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-500" />}
          >
            Reset Seed Data to Factory Defaults
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            Sign Out of Demo Session
          </Button>
        </div>
      </div>
    </div>
  );
};
