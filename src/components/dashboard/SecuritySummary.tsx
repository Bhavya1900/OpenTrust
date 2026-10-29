import React from 'react';
import { useOpenTrust } from '../../context/OpenTrustContext';
import { ShieldCheck, ShieldX, CheckCircle2, AlertOctagon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SecuritySummary: React.FC = () => {
  const { metrics, consents, auditEvents } = useOpenTrust();

  const revokedList = consents.filter((c) => c.status === 'REVOKED');
  const deniedAuditList = auditEvents.filter((a) => a.outcome === 'DENIED');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Security & Governance Summary</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time consent enforcement and access audit metrics
          </p>
        </div>
        <Link
          to="/activity"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          View Audit Log &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Active Consents</div>
            <div className="text-lg font-bold text-emerald-700">{metrics.activeConsentCount}</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
            <ShieldX className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Revoked Consents</div>
            <div className="text-lg font-bold text-rose-700">{metrics.revokedConsentCount}</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Approved Accesses</div>
            <div className="text-lg font-bold text-sky-700">{metrics.recentSuccessfulAccessCount}</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Blocked Requests</div>
            <div className="text-lg font-bold text-amber-700">{metrics.recentDeniedAccessCount}</div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
          Active Policy Enforcement Note:
        </div>
        <p className="text-slate-500 leading-relaxed text-[11px]">
          Revoked consents instantly deny token issuance and third-party API queries. {revokedList.length} application(s) currently restricted from access. {deniedAuditList.length} denied access events recorded in session.
        </p>
      </div>
    </div>
  );
};
