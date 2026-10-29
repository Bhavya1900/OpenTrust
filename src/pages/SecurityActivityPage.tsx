import React, { useState, useMemo } from 'react';
import { useOpenTrust } from '../context/OpenTrustContext';
import { formatDate } from '../utils/formatters';
import {
  Activity,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  Lock,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';

export const SecurityActivityPage: React.FC = () => {
  const { auditEvents } = useOpenTrust();

  const [searchQuery, setSearchQuery] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<'ALL' | 'SUCCESS' | 'DENIED' | 'WARNING'>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredEvents = useMemo(() => {
    return auditEvents.filter((evt) => {
      const matchesSearch =
        !searchQuery.trim() ||
        evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (evt.applicationName && evt.applicationName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (evt.endpoint && evt.endpoint.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesOutcome = outcomeFilter === 'ALL' || evt.outcome === outcomeFilter;
      const matchesType = typeFilter === 'ALL' || evt.eventType.includes(typeFilter);

      return matchesSearch && matchesOutcome && matchesType;
    });
  }, [auditEvents, searchQuery, outcomeFilter, typeFilter]);

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'SUCCESS':
        return (
          <Badge variant="emerald" size="sm" dot>
            Permitted
          </Badge>
        );
      case 'DENIED':
        return (
          <Badge variant="red" size="sm" dot>
            Denied (Blocked)
          </Badge>
        );
      case 'WARNING':
        return (
          <Badge variant="amber" size="sm" dot>
            Warning
          </Badge>
        );
      default:
        return <Badge variant="slate">{outcome}</Badge>;
    }
  };

  const getEventIcon = (outcome: string) => {
    switch (outcome) {
      case 'SUCCESS':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'DENIED':
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-4 h-4" />
          </div>
        );
      case 'WARNING':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Security & Consent Audit Activity
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tamper-evident simulated audit trail of authorizations, revocations, and API data queries
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-mono">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>{auditEvents.length} Simulated Audit Events Logged</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events, clients, or endpoints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Outcome:</span>
            <select
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value as typeof outcomeFilter)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Outcomes</option>
              <option value="SUCCESS">Permitted</option>
              <option value="DENIED">Denied</option>
              <option value="WARNING">Warning</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Category:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Categories</option>
              <option value="API">API Access Attempts</option>
              <option value="CONSENT">Consent Lifecycle</option>
              <option value="LOGIN">Authentication</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Timeline / Table */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No audit events found"
          description="None of the recorded security events match your search or filter criteria."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setOutcomeFilter('ALL');
                setTypeFilter('ALL');
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                {getEventIcon(evt.outcome)}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {evt.eventType.replace(/_/g, ' ')}
                    </span>
                    {getOutcomeBadge(evt.outcome)}
                    {evt.applicationName && (
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {evt.applicationName}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {evt.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono mt-2">
                    {evt.endpoint && <span>Endpoint: {evt.endpoint}</span>}
                    {evt.ipAddressMock && <span>• IP: {evt.ipAddressMock}</span>}
                    {evt.consentId && <span>• Consent: {evt.consentId}</span>}
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0 sm:self-start">
                <span className="font-mono text-xs text-slate-500 font-medium">
                  {formatDate(evt.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
