import React, { useState, useMemo } from 'react';
import { useOpenTrust } from '../context/OpenTrustContext';
import { Consent } from '../types';
import { formatDate, formatDateOnly } from '../utils/formatters';
import {
  ShieldCheck,
  Search,
  Eye,
  CheckCircle2,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { Modal } from '../components/common/Modal';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState';

export const ConsentManagementPage: React.FC = () => {
  const { consents, applications, revokeConsent } = useOpenTrust();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'REVOKED' | 'EXPIRED' | 'DENIED'>('ALL');
  const [sortBy, setSortBy] = useState<'expires-asc' | 'expires-desc' | 'created-desc'>('created-desc');

  // Revocation modal state
  const [consentToRevoke, setConsentToRevoke] = useState<Consent | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const [revocationToast, setRevocationToast] = useState<string | null>(null);

  // Detail inspection modal
  const [inspectConsent, setInspectConsent] = useState<Consent | null>(null);

  // Filtered and sorted consents
  const filteredConsents = useMemo(() => {
    return consents
      .filter((c) => {
        const app = applications.find((a) => a.id === c.applicationId);
        const matchesQuery =
          !searchQuery.trim() ||
          (app && app.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          c.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'created-desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'expires-asc') {
          return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
        }
        if (sortBy === 'expires-desc') {
          return new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime();
        }
        return 0;
      });
  }, [consents, applications, searchQuery, statusFilter, sortBy]);

  // Counts for summary pills
  const counts = useMemo(() => {
    return {
      active: consents.filter((c) => c.status === 'ACTIVE').length,
      revoked: consents.filter((c) => c.status === 'REVOKED').length,
      expired: consents.filter((c) => c.status === 'EXPIRED').length,
      denied: consents.filter((c) => c.status === 'DENIED').length,
    };
  }, [consents]);

  const handleConfirmRevoke = async () => {
    if (!consentToRevoke) return;
    setIsRevoking(true);
    try {
      const revoked = await revokeConsent(consentToRevoke.id);
      const app = applications.find((a) => a.id === revoked.applicationId);
      setRevocationToast(
        `Successfully revoked consent for ${app?.name || 'application'}. All future API requests will be denied with HTTP 403 Forbidden.`
      );
      setConsentToRevoke(null);
      setTimeout(() => setRevocationToast(null), 6000);
    } finally {
      setIsRevoking(false);
    }
  };

  const getStatusBadge = (status: Consent['status']) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge variant="emerald" size="sm" dot>
            Active Consent
          </Badge>
        );
      case 'REVOKED':
        return (
          <Badge variant="red" size="sm" dot>
            Revoked
          </Badge>
        );
      case 'EXPIRED':
        return (
          <Badge variant="slate" size="sm" dot>
            Expired
          </Badge>
        );
      case 'DENIED':
        return (
          <Badge variant="amber" size="sm" dot>
            Denied
          </Badge>
        );
      default:
        return <Badge variant="slate">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Consent Management Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit, inspect, and exercise instant revocation rights over all third-party data permissions
          </p>
        </div>

        <Link to="/developer">
          <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Test Access in Developer Simulator
          </Button>
        </Link>
      </div>

      {/* Revocation Success Toast */}
      {revocationToast && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-center justify-between animate-fadeIn shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span className="font-medium">{revocationToast}</span>
          </div>
          <button
            onClick={() => setRevocationToast(null)}
            className="text-rose-700 hover:text-rose-950 font-bold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Status Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter(statusFilter === 'ACTIVE' ? 'ALL' : 'ACTIVE')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            statusFilter === 'ACTIVE'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400'
              : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Active Consents</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          </div>
          <div className="text-2xl font-black text-slate-900">{counts.active}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Live API access permitted</span>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'REVOKED' ? 'ALL' : 'REVOKED')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            statusFilter === 'REVOKED'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400'
              : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Revoked Consents</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
          </div>
          <div className="text-2xl font-black text-slate-900">{counts.revoked}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Tokens immediately terminated</span>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'EXPIRED' ? 'ALL' : 'EXPIRED')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            statusFilter === 'EXPIRED'
              ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-400'
              : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Expired Consents</span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
          </div>
          <div className="text-2xl font-black text-slate-900">{counts.expired}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Validity lapsed past duration</span>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'DENIED' ? 'ALL' : 'DENIED')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            statusFilter === 'DENIED'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400'
              : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Denied Requests</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          </div>
          <div className="text-2xl font-black text-slate-900">{counts.denied}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Customer withheld permission</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by app name or consent ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="REVOKED">Revoked</option>
              <option value="EXPIRED">Expired</option>
              <option value="DENIED">Denied</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created-desc">Recently Granted</option>
              <option value="expires-asc">Expiring Soonest</option>
              <option value="expires-desc">Latest Expiry</option>
            </select>
          </div>
        </div>
      </div>

      {/* Consent Records Table */}
      {filteredConsents.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No consent records found"
          description="No consent records match your active query. Adjust your search or filters to review permissions."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">Authorized Application</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Approved Scopes</th>
                  <th className="py-3.5 px-4">Expires At</th>
                  <th className="py-3.5 px-4">Last API Access</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredConsents.map((c) => {
                  const app = applications.find((a) => a.id === c.applicationId);
                  const isActive = c.status === 'ACTIVE';

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shadow-xs flex-shrink-0">
                            {app?.name.charAt(0) || 'A'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">
                              {app?.name || 'Third-Party App'}
                            </div>
                            <div className="font-mono text-slate-400 text-[10px] mt-0.5">
                              {c.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">{getStatusBadge(c.status)}</td>

                      <td className="py-4 px-4">
                        {c.approvedScopes.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {c.approvedScopes.map((scope) => (
                              <span
                                key={scope}
                                className="text-[10px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100"
                              >
                                {scope === 'ACCOUNT_DETAILS'
                                  ? 'Details'
                                  : scope === 'ACCOUNT_BALANCES'
                                  ? 'Balances'
                                  : 'Transactions'}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">None approved</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-slate-600 font-medium">
                        {formatDateOnly(c.expiresAt)}
                      </td>

                      <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                        {c.lastAccessAt ? formatDate(c.lastAccessAt) : 'Never'}
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                            onClick={() => setInspectConsent(c)}
                          >
                            Inspect
                          </Button>

                          {isActive ? (
                            <Button
                              variant="danger"
                              size="sm"
                              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                              onClick={() => setConsentToRevoke(c)}
                            >
                              Revoke
                            </Button>
                          ) : (
                            <Link to={`/consent/request/${c.applicationId}`}>
                              <Button variant="outline" size="sm">
                                Re-authorize
                              </Button>
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Revocation Confirmation Dialog */}
      {consentToRevoke && (
        <ConfirmationDialog
          isOpen={!!consentToRevoke}
          onClose={() => setConsentToRevoke(null)}
          onConfirm={handleConfirmRevoke}
          isLoading={isRevoking}
          title="Confirm Consent Revocation"
          description={`Are you sure you want to revoke consent for "${
            applications.find((a) => a.id === consentToRevoke.applicationId)?.name
          }"? This application will immediately lose access to all financial data APIs under this consent, and any future simulated request will be denied.`}
          confirmLabel="Revoke Access Now"
          variant="danger"
        />
      )}

      {/* Inspect Consent Modal */}
      {inspectConsent && (
        <Modal
          isOpen={!!inspectConsent}
          onClose={() => setInspectConsent(null)}
          title="Consent Authorization Audit"
          subtitle={`Identifier: ${inspectConsent.id}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Client Application:</span>
                <span className="font-bold text-slate-900">
                  {applications.find((a) => a.id === inspectConsent.applicationId)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                {getStatusBadge(inspectConsent.status)}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Granted Timestamp:</span>
                <span className="font-mono text-slate-700">
                  {formatDate(inspectConsent.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expiration Timestamp:</span>
                <span className="font-mono text-slate-700">
                  {formatDate(inspectConsent.expiresAt)}
                </span>
              </div>
              {inspectConsent.revokedAt && (
                <div className="flex justify-between text-rose-700 font-semibold">
                  <span>Revocation Timestamp:</span>
                  <span className="font-mono">{formatDate(inspectConsent.revokedAt)}</span>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">
                Authorized Permissions:
              </h4>
              <div className="space-y-1.5">
                {inspectConsent.approvedScopes.map((scope) => (
                  <div
                    key={scope}
                    className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between"
                  >
                    <span className="font-mono font-semibold text-slate-800">{scope}</span>
                    <span className="text-emerald-600 font-semibold">Authorized</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setInspectConsent(null)}>
                Close
              </Button>
              {inspectConsent.status === 'ACTIVE' && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    const toRev = inspectConsent;
                    setInspectConsent(null);
                    setConsentToRevoke(toRev);
                  }}
                >
                  Revoke Consent
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
