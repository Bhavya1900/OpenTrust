import React, { useState } from 'react';
import { useOpenTrust } from '../context/OpenTrustContext';
import { ConsentScope, MockApiResponse } from '../types';
import { apiSimulatorService } from '../services/mock/apiSimulatorService';
import { formatDate } from '../utils/formatters';
import {
  Terminal,
  Send,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Layers,
  FileCode,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { JsonViewer } from '../components/common/JsonViewer';
import { SimulatedTokenViewer } from '../components/developer/SimulatedTokenViewer';
import { Link } from 'react-router-dom';

type ApiOperation = 'READ_ACCOUNT_DETAILS' | 'READ_ACCOUNT_BALANCES' | 'READ_TRANSACTION_HISTORY';

export const DeveloperConsolePage: React.FC = () => {
  const { applications, consents, runSimulatedApi, apiLogs } = useOpenTrust();

  // Selected client
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [selectedOperation, setSelectedOperation] = useState<ApiOperation>('READ_ACCOUNT_BALANCES');

  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<MockApiResponse | null>(null);
  const [lastDuration, setLastDuration] = useState<number | null>(null);

  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];
  const consent = consents.find((c) => c.applicationId === selectedApp?.id);
  const operationMeta = apiSimulatorService.getOperationMeta(selectedOperation);

  const handleExecuteRequest = async () => {
    if (!selectedApp) return;
    setIsLoading(true);
    try {
      const { response, log } = await runSimulatedApi(selectedApp.id, selectedOperation);
      setLastResponse(response);
      setLastDuration(log.durationMs);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Developer Console & API Simulator
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-700 border border-blue-500/30 px-2 py-0.5 rounded-full">
              Core L&T Evaluator Tool
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Simulate third-party client API queries against active, revoked, or scope-restricted customer consents
          </p>
        </div>

        <Link to="/consents">
          <Button variant="outline" size="sm" leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}>
            Manage Consents
          </Button>
        </Link>
      </div>

      {/* Evaluator Interactive Walkthrough Guide */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white shadow-md border border-blue-800/80">
        <div className="flex items-start gap-3">
          <Terminal className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2 text-xs">
            <div className="font-bold text-sm text-white">
              Evaluation Walkthrough: Test Granular Consent Enforcement
            </div>
            <p className="text-slate-300 leading-relaxed">
              Observe real Open Banking policy evaluation without an external database:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
              <li>
                Select <strong className="text-blue-300">FinSight Analytics</strong> & test{' '}
                <strong className="text-emerald-300">Read Account Balances</strong> &rarr; Observe{' '}
                <span className="font-mono text-emerald-400">200 OK</span>.
              </li>
              <li>
                Switch operation to <strong className="text-amber-300">Read Transaction History</strong> &rarr; Observe{' '}
                <span className="font-mono text-rose-400">403 Forbidden (Insufficient Scope)</span> because the customer withheld transaction permission!
              </li>
              <li>
                Navigate to <Link to="/consents" className="text-blue-300 underline font-semibold">Consent Management</Link> and click <strong className="text-rose-400">Revoke Access</strong>.
              </li>
              <li>
                Return here and re-send request &rarr; Observe immediate{' '}
                <span className="font-mono text-rose-400">403 Forbidden (Consent Revoked)</span>.
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Main Simulator Workspace: 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Request Builder (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Step 1: Select Third-Party Client</span>
            </div>

            {/* Client App Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Registered Application:
              </label>
              <div className="space-y-2">
                {applications.map((app) => {
                  const appConsent = consents.find((c) => c.applicationId === app.id);
                  const isSelected = selectedAppId === app.id;

                  return (
                    <div
                      key={app.id}
                      onClick={() => setSelectedAppId(app.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">{app.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {app.clientId}
                        </div>
                      </div>

                      <div>
                        {appConsent?.status === 'ACTIVE' ? (
                          <Badge variant="emerald" size="sm" dot>
                            ACTIVE
                          </Badge>
                        ) : appConsent?.status === 'REVOKED' ? (
                          <Badge variant="red" size="sm" dot>
                            REVOKED
                          </Badge>
                        ) : appConsent?.status === 'EXPIRED' ? (
                          <Badge variant="slate" size="sm" dot>
                            EXPIRED
                          </Badge>
                        ) : (
                          <Badge variant="amber" size="sm" dot>
                            NO CONSENT
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Consent State Info */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Consent Status:</span>
                <span className="font-semibold text-slate-800">
                  {consent ? consent.status : 'None Established'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Approved Scopes:</span>
                <span className="font-mono text-blue-700 font-semibold">
                  {consent && consent.approvedScopes.length > 0
                    ? `[${consent.approvedScopes.join(', ')}]`
                    : '[]'}
                </span>
              </div>
            </div>

            {/* Step 2: Select API Operation */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <FileCode className="w-4 h-4 text-blue-600" />
                <span>Step 2: Choose API Endpoint Operation</span>
              </div>

              <div className="space-y-2">
                {[
                  {
                    id: 'READ_ACCOUNT_DETAILS',
                    label: 'Read Account Details',
                    scope: 'ACCOUNT_DETAILS',
                    endpoint: '/api/v1/open-banking/accounts/details',
                  },
                  {
                    id: 'READ_ACCOUNT_BALANCES',
                    label: 'Read Account Balances',
                    scope: 'ACCOUNT_BALANCES',
                    endpoint: '/api/v1/open-banking/accounts/balances',
                  },
                  {
                    id: 'READ_TRANSACTION_HISTORY',
                    label: 'Read Transaction History',
                    scope: 'TRANSACTION_HISTORY',
                    endpoint: '/api/v1/open-banking/transactions',
                  },
                ].map((op) => {
                  const isOpSelected = selectedOperation === op.id;
                  const isApproved =
                    consent?.status === 'ACTIVE' &&
                    consent.approvedScopes.includes(op.scope as ConsentScope);

                  return (
                    <div
                      key={op.id}
                      onClick={() => setSelectedOperation(op.id as ApiOperation)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isOpSelected
                          ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{op.label}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            isApproved
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {isApproved ? 'Scope Approved' : 'Scope Missing'}
                        </span>
                      </div>
                      <div className="font-mono text-[10px] text-slate-500 mt-1">
                        GET {op.endpoint}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Send Request Button */}
            <Button
              variant="secondary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              onClick={handleExecuteRequest}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Send Simulated API Request
            </Button>
          </div>

          {/* Simulated Token Card */}
          <SimulatedTokenViewer application={selectedApp} consent={consent} />
        </div>

        {/* Right Column: Response Inspection Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-slate-700" />
                  <h3 className="text-sm font-bold text-slate-900">HTTP Response Inspector</h3>
                </div>

                {lastResponse && (
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black font-mono px-2.5 py-1 rounded-lg ${
                        lastResponse.status === 200
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      HTTP {lastResponse.status} {lastResponse.statusText}
                    </span>
                    {lastDuration !== null && (
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {lastDuration}ms
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Endpoint banner */}
              <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-emerald-400 font-bold">GET</span>
                  <span className="text-slate-300 truncate">{operationMeta.endpoint}</span>
                </div>
                <span className="text-[11px] text-slate-400 flex-shrink-0">
                  Scope: {operationMeta.scope}
                </span>
              </div>

              {/* Response Message / Status Explanation */}
              {lastResponse ? (
                <div
                  className={`p-4 rounded-xl border mb-4 text-xs ${
                    lastResponse.status === 200
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/80 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {lastResponse.status === 200 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertOctagon className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold block">{lastResponse.message}</span>
                      {lastResponse.error && (
                        <p className="mt-1 text-[11px] leading-relaxed text-rose-800">
                          {lastResponse.error.details || lastResponse.error.reason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500 mb-4">
                  Select a registered client, choose an operation, and click "Send Simulated API Request" to test consent evaluation.
                </div>
              )}

              {/* JSON Payload Viewer */}
              <JsonViewer
                data={
                  lastResponse || {
                    status: 'IDLE',
                    hint: 'Ready for simulated request invocation',
                    targetClient: selectedApp.name,
                    targetScope: operationMeta.scope,
                  }
                }
                title="Response Body (JSON Payload)"
                maxHeight="max-h-[380px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Request History Log */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Simulated Request History</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live audit of API queries issued in the current prototype session
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {apiLogs.length} simulated requests
          </span>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
          {apiLogs.map((log) => {
            const isSuccess = log.status === 'SUCCESS';
            return (
              <div
                key={log.id}
                className="p-3.5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                      isSuccess
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {log.statusCode}
                  </span>
                  <div>
                    <div className="font-bold text-slate-800">
                      {log.clientName} &rarr; <span className="font-mono text-slate-600">{log.endpoint}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Required Scope: <strong className="font-mono">{log.scopeRequired}</strong> • {log.message}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 sm:self-auto font-mono text-slate-400 text-[11px]">
                  <span>{formatDate(log.timestamp)}</span>
                  <span className="ml-2 text-slate-300">({log.durationMs}ms)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
