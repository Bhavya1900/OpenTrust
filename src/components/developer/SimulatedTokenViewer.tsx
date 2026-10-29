import React, { useState } from 'react';
import { ThirdPartyApplication, Consent } from '../../types';
import { apiSimulatorService } from '../../services/mock/apiSimulatorService';
import { KeyRound, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

interface SimulatedTokenViewerProps {
  application: ThirdPartyApplication;
  consent: Consent | undefined;
}

export const SimulatedTokenViewer: React.FC<SimulatedTokenViewerProps> = ({
  application,
  consent,
}) => {
  const [expanded, setExpanded] = useState(false);

  const token = apiSimulatorService.generateSimulatedToken(
    application,
    consent?.id,
    consent?.status === 'ACTIVE' ? consent.approvedScopes : []
  );

  const parts = token.split('.');

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-200">Simulated Authorization Token</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded">
            SIMULATION ONLY
          </span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 self-start sm:self-auto"
        >
          {expanded ? 'Collapse Token Details' : 'Inspect Token Payload'}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs break-all text-slate-300">
        <span className="text-rose-400">{parts[0]}</span>
        <span className="text-slate-600">.</span>
        <span className="text-purple-400">{parts[1]}</span>
        <span className="text-slate-600">.</span>
        <span className="text-blue-400">{parts[2]}</span>
      </div>

      <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-400">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span>
          Educational prototype simulation only. Not a cryptographically signed OAuth2 access token. Real JWT issuance will occur in Phase 2 backend.
        </span>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
              Decoded Header (Base64)
            </span>
            <pre className="font-mono text-[11px] text-slate-300">
              {JSON.stringify({ alg: 'HS256', typ: 'JWT', env: 'OPENTRUST_PROTOTYPE' }, null, 2)}
            </pre>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
              Decoded Claims & Scopes
            </span>
            <pre className="font-mono text-[11px] text-slate-300">
              {JSON.stringify(
                {
                  iss: 'https://opentrust.test',
                  sub: 'usr_demo_001',
                  aud: application.clientId,
                  consent_id: consent?.id || 'none',
                  consent_status: consent?.status || 'NO_CONSENT',
                  scope: consent?.status === 'ACTIVE' ? consent.approvedScopes : [],
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
