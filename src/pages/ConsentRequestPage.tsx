import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOpenTrust } from '../context/OpenTrustContext';
import { ConsentScope } from '../types';
import { GranularPermissionCard } from '../components/consent/GranularPermissionCard';
import { DurationSelector } from '../components/consent/DurationSelector';
import { ConsentSummaryCard } from '../components/consent/ConsentSummaryCard';
import { Button } from '../components/common/Button';
import {
  ShieldCheck,
  ShieldX,
  ArrowLeft,
  Lock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const ConsentRequestPage: React.FC = () => {
  const { appId, consentId } = useParams<{ appId?: string; consentId?: string }>();
  const navigate = useNavigate();
  const { applications, consents, approveConsent, denyConsent } = useOpenTrust();

  // Find app either by appId or by finding the consent's application
  const app = React.useMemo(() => {
    if (appId) {
      return applications.find((a) => a.id === appId);
    }
    if (consentId) {
      const c = consents.find((item) => item.id === consentId);
      if (c) return applications.find((a) => a.id === c.applicationId);
    }
    return applications[0]; // fallback to first app
  }, [appId, consentId, applications, consents]);

  // Existing consent if any
  const existingConsent = React.useMemo(() => {
    if (!app) return undefined;
    return consents.find((c) => c.applicationId === app.id);
  }, [app, consents]);

  // State for user configuration
  const [selectedScopes, setSelectedScopes] = useState<ConsentScope[]>(() => {
    if (existingConsent && existingConsent.approvedScopes.length > 0) {
      return [...existingConsent.approvedScopes];
    }
    return app ? [...app.requestedDefaultScopes] : ['ACCOUNT_DETAILS', 'ACCOUNT_BALANCES'];
  });

  const [durationDays, setDurationDays] = useState<number>(() => {
    return existingConsent ? existingConsent.durationDays : 30;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'denied';
    message: string;
  } | null>(null);

  if (!app) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-slate-800">Application Not Found</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          The requested application could not be located in the demo registry.
        </p>
        <Link to="/apps">
          <Button variant="outline" size="sm">
            Back to Connected Apps
          </Button>
        </Link>
      </div>
    );
  }

  const handleApprove = async () => {
    if (selectedScopes.length === 0) return;
    setIsSubmitting(true);
    try {
      await approveConsent(app.id, selectedScopes, durationDays);
      setNotification({
        type: 'success',
        message: `Consent successfully authorized for ${app.name} with ${selectedScopes.length} data scope(s).`,
      });
      setTimeout(() => {
        navigate('/consents');
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeny = async () => {
    setIsSubmitting(true);
    try {
      await denyConsent(app.id, app.requestedDefaultScopes);
      setNotification({
        type: 'denied',
        message: `Consent request from ${app.name} was rejected. Access has been denied and logged.`,
      });
      setTimeout(() => {
        navigate('/apps');
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back link */}
      <div>
        <Link
          to="/apps"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Connected Applications</span>
        </Link>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-fadeIn ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Financial Consent Dialog Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Authorizing Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xl font-bold shadow-inner">
                {app.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                    Open Banking Authorization
                  </span>
                  <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded">
                    SIMULATION
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5">
                  {app.name}
                </h1>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  Client ID: {app.clientId} • Developer: {app.developer}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs text-blue-200">
              <Lock className="w-3.5 h-3.5 text-blue-300" />
              <span>TLS 1.3 End-to-End Encrypted</span>
            </div>
          </div>
        </div>

        {/* Purpose Explanation */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Why is this application requesting your data?</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {app.purpose}
            </p>
          </div>

          {/* Granular Scope Selector */}
          <GranularPermissionCard
            requestedScopes={app.requestedDefaultScopes}
            selectedScopes={selectedScopes}
            onChange={setSelectedScopes}
          />

          {/* Duration Selector */}
          <div className="pt-4 border-t border-slate-100">
            <DurationSelector
              selectedDuration={durationDays}
              onChange={setDurationDays}
            />
          </div>

          {/* Summary Reassurance Card */}
          <ConsentSummaryCard
            app={app}
            selectedScopes={selectedScopes}
            durationDays={durationDays}
          />

          {/* Action Button Row */}
          <div className="pt-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => navigate('/apps')}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="danger"
                size="md"
                onClick={handleDeny}
                isLoading={isSubmitting}
                leftIcon={<ShieldX className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Deny Request
              </Button>
            </div>

            <Button
              type="button"
              variant="success"
              size="lg"
              onClick={handleApprove}
              disabled={selectedScopes.length === 0 || isSubmitting}
              isLoading={isSubmitting}
              leftIcon={<ShieldCheck className="w-5 h-5" />}
              className="w-full sm:w-auto shadow-md shadow-emerald-700/20"
            >
              Allow Access ({selectedScopes.length} Scopes)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
