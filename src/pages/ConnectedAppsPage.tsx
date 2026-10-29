import React, { useState } from 'react';
import { useOpenTrust } from '../context/OpenTrustContext';
import { ThirdPartyApplication, Consent } from '../types';
import { formatDate, formatDateOnly } from '../utils/formatters';
import {
  TrendingUp,
  PieChart,
  ShieldCheck,
  ExternalLink,
  Lock,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';

export const ConnectedAppsPage: React.FC = () => {
  const { applications, consents } = useOpenTrust();
  const [selectedApp, setSelectedApp] = useState<ThirdPartyApplication | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-blue-600" />;
      case 'PieChart':
        return <PieChart className="w-6 h-6 text-purple-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
      default:
        return <ExternalLink className="w-6 h-6 text-slate-600" />;
    }
  };

  const getStatusBadge = (consent: Consent | undefined) => {
    if (!consent) {
      return (
        <Badge variant="slate" size="sm" dot>
          Registered • No Consent
        </Badge>
      );
    }
    if (consent.status === 'ACTIVE') {
      return (
        <Badge variant="emerald" size="sm" dot>
          Active Authorization
        </Badge>
      );
    }
    if (consent.status === 'REVOKED') {
      return (
        <Badge variant="red" size="sm" dot>
          Consent Revoked
        </Badge>
      );
    }
    if (consent.status === 'EXPIRED') {
      return (
        <Badge variant="slate" size="sm" dot>
          Expired
        </Badge>
      );
    }
    return (
      <Badge variant="amber" size="sm" dot>
        {consent.status}
      </Badge>
    );
  };

  const selectedConsent = selectedApp
    ? consents.find((c) => c.applicationId === selectedApp.id)
    : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Registered Third-Party Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            External FinTech client systems participating in the Open Banking simulation
          </p>
        </div>

        <Link to="/consents">
          <Button variant="outline" size="sm" leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}>
            Consent Management Portal
          </Button>
        </Link>
      </div>

      {/* Explanatory card */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-start gap-3 text-xs">
        <Lock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Open Banking Principle:</strong> Mere registration in the developer directory confers zero access to customer data. An explicit, customer-approved, time-bound consent grant with selected granular scopes is strictly required before any API endpoint can be invoked.
        </div>
      </div>

      {/* Application Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {applications.map((app) => {
          const consent = consents.find((c) => c.applicationId === app.id);
          const hasActiveConsent = consent?.status === 'ACTIVE';

          return (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex items-center justify-center">
                    {getIcon(app.icon)}
                  </div>
                  {getStatusBadge(consent)}
                </div>

                <h3 className="text-base font-bold text-slate-900">{app.name}</h3>
                <span className="text-xs font-medium text-slate-400 block mb-2">
                  {app.category}
                </span>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {app.description}
                </p>

                {/* Client ID / Dev entity */}
                <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Client ID:</span>
                    <span className="font-mono font-medium text-slate-700">{app.clientId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Developer:</span>
                    <span className="text-slate-700 font-medium truncate max-w-[140px]">
                      {app.developer}
                    </span>
                  </div>
                </div>

                {/* Consent Status details */}
                <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last API Access:</span>
                    <span className="font-medium text-slate-700">
                      {consent?.lastAccessAt ? formatDate(consent.lastAccessAt) : 'Never accessed'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Consent Expiry:</span>
                    <span className="font-medium text-slate-700">
                      {consent?.expiresAt ? formatDateOnly(consent.expiresAt) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedApp(app)}
                >
                  Inspect App
                </Button>

                {hasActiveConsent ? (
                  <Link to="/consents" className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      Manage
                    </Button>
                  </Link>
                ) : (
                  <Link to={`/consent/request/${app.id}`} className="flex-1">
                    <Button
                      variant={consent?.status === 'REVOKED' ? 'outline' : 'primary'}
                      size="sm"
                      className="w-full"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      {consent?.status === 'REVOKED' ? 'Re-authorize' : 'Authorize'}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* App Details Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={selectedApp.name}
          subtitle={`Registered Client Identifier: ${selectedApp.clientId}`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
              <div>
                <span className="font-semibold text-slate-700 block mb-0.5">Application Purpose:</span>
                <p className="text-slate-600 leading-relaxed">{selectedApp.purpose}</p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> Website:
                </span>
                <span className="font-mono text-blue-600">{selectedApp.website}</span>
              </div>
            </div>

            {/* Scope Details */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Requested Default Scopes
              </h4>
              <div className="space-y-1.5">
                {selectedApp.requestedDefaultScopes.map((scope) => (
                  <div
                    key={scope}
                    className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-800 font-mono">{scope}</span>
                    <span className="text-[11px] text-slate-500">
                      {scope === 'ACCOUNT_DETAILS'
                        ? 'Account basic info & branch'
                        : scope === 'ACCOUNT_BALANCES'
                        ? 'Real-time balances'
                        : 'Granular transaction ledger'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Consent State */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Current Consent Status:</span>
                {getStatusBadge(selectedConsent)}
              </div>

              {selectedConsent && (
                <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span>Consent ID:</span>
                    <span className="font-mono font-medium text-slate-800">
                      {selectedConsent.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Granted At:</span>
                    <span>{formatDate(selectedConsent.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approved Scopes:</span>
                    <span className="font-mono text-emerald-700 font-semibold">
                      [{selectedConsent.approvedScopes.join(', ')}]
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedApp(null)}>
                Close
              </Button>
              <Link to={`/consent/request/${selectedApp.id}`}>
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => setSelectedApp(null)}
                >
                  Configure Consent
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
