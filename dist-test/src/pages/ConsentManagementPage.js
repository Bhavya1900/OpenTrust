"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsentManagementPage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const OpenTrustContext_1 = require("../context/OpenTrustContext");
const formatters_1 = require("../utils/formatters");
const lucide_react_1 = require("lucide-react");
const Badge_1 = require("../components/common/Badge");
const Button_1 = require("../components/common/Button");
const ConfirmationDialog_1 = require("../components/common/ConfirmationDialog");
const Modal_1 = require("../components/common/Modal");
const react_router_dom_1 = require("react-router-dom");
const EmptyState_1 = require("../components/common/EmptyState");
const ConsentManagementPage = () => {
    const { consents, applications, revokeConsent } = (0, OpenTrustContext_1.useOpenTrust)();
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [statusFilter, setStatusFilter] = (0, react_1.useState)('ALL');
    const [sortBy, setSortBy] = (0, react_1.useState)('created-desc');
    // Revocation modal state
    const [consentToRevoke, setConsentToRevoke] = (0, react_1.useState)(null);
    const [isRevoking, setIsRevoking] = (0, react_1.useState)(false);
    const [revocationToast, setRevocationToast] = (0, react_1.useState)(null);
    // Detail inspection modal
    const [inspectConsent, setInspectConsent] = (0, react_1.useState)(null);
    // Filtered and sorted consents
    const filteredConsents = (0, react_1.useMemo)(() => {
        return consents
            .filter((c) => {
            const app = applications.find((a) => a.id === c.applicationId);
            const matchesQuery = !searchQuery.trim() ||
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
    const counts = (0, react_1.useMemo)(() => {
        return {
            active: consents.filter((c) => c.status === 'ACTIVE').length,
            revoked: consents.filter((c) => c.status === 'REVOKED').length,
            expired: consents.filter((c) => c.status === 'EXPIRED').length,
            denied: consents.filter((c) => c.status === 'DENIED').length,
        };
    }, [consents]);
    const handleConfirmRevoke = async () => {
        if (!consentToRevoke)
            return;
        setIsRevoking(true);
        try {
            const revoked = await revokeConsent(consentToRevoke.id);
            const app = applications.find((a) => a.id === revoked.applicationId);
            setRevocationToast(`Successfully revoked consent for ${app?.name || 'application'}. All future API requests will be denied with HTTP 403 Forbidden.`);
            setConsentToRevoke(null);
            setTimeout(() => setRevocationToast(null), 6000);
        }
        finally {
            setIsRevoking(false);
        }
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'ACTIVE':
                return ((0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "emerald", size: "sm", dot: true, children: "Active Consent" }));
            case 'REVOKED':
                return ((0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "red", size: "sm", dot: true, children: "Revoked" }));
            case 'EXPIRED':
                return ((0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "slate", size: "sm", dot: true, children: "Expired" }));
            case 'DENIED':
                return ((0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "amber", size: "sm", dot: true, children: "Denied" }));
            default:
                return (0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "slate", children: status });
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight", children: "Consent Management Portal" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs sm:text-sm text-slate-500 mt-1", children: "Audit, inspect, and exercise instant revocation rights over all third-party data permissions" })] }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/developer", children: (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "secondary", size: "sm", rightIcon: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "w-3.5 h-3.5" }), children: "Test Access in Developer Simulator" }) })] }), revocationToast && ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-center justify-between animate-fadeIn shadow-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle2, { className: "w-5 h-5 text-rose-600 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: revocationToast })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setRevocationToast(null), className: "text-rose-700 hover:text-rose-950 font-bold ml-4", children: "Dismiss" })] })), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { onClick: () => setStatusFilter(statusFilter === 'ACTIVE' ? 'ALL' : 'ACTIVE'), className: `p-4 rounded-2xl border transition-all cursor-pointer select-none ${statusFilter === 'ACTIVE'
                            ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400'
                            : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold text-slate-500", children: "Active Consents" }), (0, jsx_runtime_1.jsx)("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-black text-slate-900", children: counts.active }), (0, jsx_runtime_1.jsx)("span", { className: "text-[11px] text-slate-400 mt-1 block", children: "Live API access permitted" })] }), (0, jsx_runtime_1.jsxs)("div", { onClick: () => setStatusFilter(statusFilter === 'REVOKED' ? 'ALL' : 'REVOKED'), className: `p-4 rounded-2xl border transition-all cursor-pointer select-none ${statusFilter === 'REVOKED'
                            ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400'
                            : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold text-slate-500", children: "Revoked Consents" }), (0, jsx_runtime_1.jsx)("span", { className: "w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-black text-slate-900", children: counts.revoked }), (0, jsx_runtime_1.jsx)("span", { className: "text-[11px] text-slate-400 mt-1 block", children: "Tokens immediately terminated" })] }), (0, jsx_runtime_1.jsxs)("div", { onClick: () => setStatusFilter(statusFilter === 'EXPIRED' ? 'ALL' : 'EXPIRED'), className: `p-4 rounded-2xl border transition-all cursor-pointer select-none ${statusFilter === 'EXPIRED'
                            ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-400'
                            : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold text-slate-500", children: "Expired Consents" }), (0, jsx_runtime_1.jsx)("span", { className: "w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-black text-slate-900", children: counts.expired }), (0, jsx_runtime_1.jsx)("span", { className: "text-[11px] text-slate-400 mt-1 block", children: "Validity lapsed past duration" })] }), (0, jsx_runtime_1.jsxs)("div", { onClick: () => setStatusFilter(statusFilter === 'DENIED' ? 'ALL' : 'DENIED'), className: `p-4 rounded-2xl border transition-all cursor-pointer select-none ${statusFilter === 'DENIED'
                            ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400'
                            : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold text-slate-500", children: "Denied Requests" }), (0, jsx_runtime_1.jsx)("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-black text-slate-900", children: counts.denied }), (0, jsx_runtime_1.jsx)("span", { className: "text-[11px] text-slate-400 mt-1 block", children: "Customer withheld permission" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col sm:flex-row items-center justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative w-full sm:w-80", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search by app name or consent ID...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 w-full sm:w-auto justify-end", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold text-slate-500", children: "Status:" }), (0, jsx_runtime_1.jsxs)("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "ALL", children: "All Statuses" }), (0, jsx_runtime_1.jsx)("option", { value: "ACTIVE", children: "Active" }), (0, jsx_runtime_1.jsx)("option", { value: "REVOKED", children: "Revoked" }), (0, jsx_runtime_1.jsx)("option", { value: "EXPIRED", children: "Expired" }), (0, jsx_runtime_1.jsx)("option", { value: "DENIED", children: "Denied" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold text-slate-500", children: "Sort:" }), (0, jsx_runtime_1.jsxs)("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "created-desc", children: "Recently Granted" }), (0, jsx_runtime_1.jsx)("option", { value: "expires-asc", children: "Expiring Soonest" }), (0, jsx_runtime_1.jsx)("option", { value: "expires-desc", children: "Latest Expiry" })] })] })] })] }), filteredConsents.length === 0 ? ((0, jsx_runtime_1.jsx)(EmptyState_1.EmptyState, { icon: lucide_react_1.ShieldCheck, title: "No consent records found", description: "No consent records match your active query. Adjust your search or filters to review permissions.", action: (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "outline", size: "sm", onClick: () => {
                        setSearchQuery('');
                        setStatusFilter('ALL');
                    }, children: "Reset Filters" }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full text-left border-collapse text-xs", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]", children: [(0, jsx_runtime_1.jsx)("th", { className: "py-3.5 px-4 sm:px-6", children: "Authorized Application" }), (0, jsx_runtime_1.jsx)("th", { className: "py-3.5 px-4", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "py-3.5 px-4", children: "Approved Scopes" }), (0, jsx_runtime_1.jsx)("th", { className: "py-3.5 px-4", children: "Expires At" }), (0, jsx_runtime_1.jsx)("th", { className: "py-3.5 px-4", children: "Last API Access" }), (0, jsx_runtime_1.jsx)("th", { className: "py-3.5 px-4 sm:px-6 text-right", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "divide-y divide-slate-100", children: filteredConsents.map((c) => {
                                    const app = applications.find((a) => a.id === c.applicationId);
                                    const isActive = c.status === 'ACTIVE';
                                    return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-slate-50/60 transition-colors", children: [(0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4 sm:px-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shadow-xs flex-shrink-0", children: app?.name.charAt(0) || 'A' }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-bold text-slate-900 text-sm", children: app?.name || 'Third-Party App' }), (0, jsx_runtime_1.jsx)("div", { className: "font-mono text-slate-400 text-[10px] mt-0.5", children: c.id })] })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4", children: getStatusBadge(c.status) }), (0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4", children: c.approvedScopes.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1", children: c.approvedScopes.map((scope) => ((0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100", children: scope === 'ACCOUNT_DETAILS'
                                                            ? 'Details'
                                                            : scope === 'ACCOUNT_BALANCES'
                                                                ? 'Balances'
                                                                : 'Transactions' }, scope))) })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-slate-400 italic text-[11px]", children: "None approved" })) }), (0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4 text-slate-600 font-medium", children: (0, formatters_1.formatDateOnly)(c.expiresAt) }), (0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4 text-slate-500 font-mono text-[11px]", children: c.lastAccessAt ? (0, formatters_1.formatDate)(c.lastAccessAt) : 'Never' }), (0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4 sm:px-6 text-right", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-end gap-2", children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "outline", size: "sm", leftIcon: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "w-3.5 h-3.5" }), onClick: () => setInspectConsent(c), children: "Inspect" }), isActive ? ((0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "danger", size: "sm", leftIcon: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-3.5 h-3.5" }), onClick: () => setConsentToRevoke(c), children: "Revoke" })) : ((0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: `/consent/request/${c.applicationId}`, children: (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "outline", size: "sm", children: "Re-authorize" }) }))] }) })] }, c.id));
                                }) })] }) }) })), consentToRevoke && ((0, jsx_runtime_1.jsx)(ConfirmationDialog_1.ConfirmationDialog, { isOpen: !!consentToRevoke, onClose: () => setConsentToRevoke(null), onConfirm: handleConfirmRevoke, isLoading: isRevoking, title: "Confirm Consent Revocation", description: `Are you sure you want to revoke consent for "${applications.find((a) => a.id === consentToRevoke.applicationId)?.name}"? This application will immediately lose access to all financial data APIs under this consent, and any future simulated request will be denied.`, confirmLabel: "Revoke Access Now", variant: "danger" })), inspectConsent && ((0, jsx_runtime_1.jsx)(Modal_1.Modal, { isOpen: !!inspectConsent, onClose: () => setInspectConsent(null), title: "Consent Authorization Audit", subtitle: `Identifier: ${inspectConsent.id}`, maxWidth: "lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4 text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-500", children: "Client Application:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-bold text-slate-900", children: applications.find((a) => a.id === inspectConsent.applicationId)?.name })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-500", children: "Status:" }), getStatusBadge(inspectConsent.status)] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-500", children: "Granted Timestamp:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-mono text-slate-700", children: (0, formatters_1.formatDate)(inspectConsent.createdAt) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-500", children: "Expiration Timestamp:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-mono text-slate-700", children: (0, formatters_1.formatDate)(inspectConsent.expiresAt) })] }), inspectConsent.revokedAt && ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-rose-700 font-semibold", children: [(0, jsx_runtime_1.jsx)("span", { children: "Revocation Timestamp:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-mono", children: (0, formatters_1.formatDate)(inspectConsent.revokedAt) })] }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-bold text-slate-800 uppercase tracking-wider mb-2", children: "Authorized Permissions:" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1.5", children: inspectConsent.approvedScopes.map((scope) => ((0, jsx_runtime_1.jsxs)("div", { className: "p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-mono font-semibold text-slate-800", children: scope }), (0, jsx_runtime_1.jsx)("span", { className: "text-emerald-600 font-semibold", children: "Authorized" })] }, scope))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-end gap-3 pt-3 border-t border-slate-100", children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "outline", size: "sm", onClick: () => setInspectConsent(null), children: "Close" }), inspectConsent.status === 'ACTIVE' && ((0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "danger", size: "sm", onClick: () => {
                                        const toRev = inspectConsent;
                                        setInspectConsent(null);
                                        setConsentToRevoke(toRev);
                                    }, children: "Revoke Consent" }))] })] }) }))] }));
};
exports.ConsentManagementPage = ConsentManagementPage;
