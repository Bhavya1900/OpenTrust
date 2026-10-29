import React from 'react';
import { ThirdPartyApplication, ConsentScope } from '../../types';
import { formatDate } from '../../utils/formatters';
import { ShieldCheck, Lock, AlertCircle } from 'lucide-react';

interface ConsentSummaryCardProps {
  app: ThirdPartyApplication;
  selectedScopes: ConsentScope[];
  durationDays: number;
}

export const ConsentSummaryCard: React.FC<ConsentSummaryCardProps> = ({
  app,
  selectedScopes,
  durationDays,
}) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + durationDays);

  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Authorization Summary & Legal Disclosure</span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between py-1.5 border-b border-slate-200/60">
          <span className="text-slate-500">Authorized Recipient</span>
          <span className="font-semibold text-slate-900">{app.name}</span>
        </div>

        <div className="flex justify-between py-1.5 border-b border-slate-200/60">
          <span className="text-slate-500">Developer Entity</span>
          <span className="font-medium text-slate-800">{app.developer}</span>
        </div>

        <div className="flex justify-between py-1.5 border-b border-slate-200/60">
          <span className="text-slate-500">Selected Data Categories</span>
          <span className="font-semibold text-blue-700">
            {selectedScopes.length > 0 ? `${selectedScopes.length} Categories Permitted` : 'None Selected'}
          </span>
        </div>

        <div className="flex justify-between py-1.5 border-b border-slate-200/60">
          <span className="text-slate-500">Active Validity Period</span>
          <span className="font-medium text-slate-800">{durationDays} Days</span>
        </div>

        <div className="flex justify-between py-1.5">
          <span className="text-slate-500">Automatic Expiration</span>
          <span className="font-mono font-semibold text-slate-900">{formatDate(expiryDate)}</span>
        </div>
      </div>

      <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
        <Lock className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          <strong>Customer Sovereignty Guarantee:</strong> You retain the absolute right to revoke this consent at any moment from the Consent Management dashboard. Revocation terminates API tokens instantaneously.
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Simulated Open Banking authorization. No actual banking credentials or real money involved.</span>
      </div>
    </div>
  );
};
