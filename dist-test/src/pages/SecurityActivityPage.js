"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityActivityPage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const OpenTrustContext_1 = require("../context/OpenTrustContext");
const formatters_1 = require("../utils/formatters");
const lucide_react_1 = require("lucide-react");
const Badge_1 = require("../components/common/Badge");
const Button_1 = require("../components/common/Button");
const EmptyState_1 = require("../components/common/EmptyState");
const SecurityActivityPage = () => {
    const { auditEvents } = (0, OpenTrustContext_1.useOpenTrust)();
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [outcomeFilter, setOutcomeFilter] = (0, react_1.useState)('ALL');
    const [typeFilter, setTypeFilter] = (0, react_1.useState)('ALL');
    const filteredEvents = (0, react_1.useMemo)(() => {
        return auditEvents.filter((evt) => {
            const matchesSearch = !searchQuery.trim() ||
                evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (evt.applicationName && evt.applicationName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (evt.endpoint && evt.endpoint.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesOutcome = outcomeFilter === 'ALL' || evt.outcome === outcomeFilter;
            const matchesType = typeFilter === 'ALL' || evt.eventType.includes(typeFilter);
            return matchesSearch && matchesOutcome && matchesType;
        });
    }, [auditEvents, searchQuery, outcomeFilter, typeFilter]);
    const getOutcomeBadge = (outcome) => {
        switch (outcome) {
            case 'SUCCESS':
                return ((0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "emerald", size: "sm", dot: true, children: "Permitted" }));
            case 'DENIED':
                return ((0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "red", size: "sm", dot: true, children: "Denied (Blocked)" }));
            case 'WARNING':
                return ((0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "amber", size: "sm", dot: true, children: "Warning" }));
            default:
                return (0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "slate", children: outcome });
        }
    };
    const getEventIcon = (outcome) => {
        switch (outcome) {
            case 'SUCCESS':
                return ((0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle2, { className: "w-4 h-4" }) }));
            case 'DENIED':
                return ((0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "w-4 h-4" }) }));
            case 'WARNING':
                return ((0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-4 h-4" }) }));
            default:
                return ((0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "w-4 h-4" }) }));
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight", children: "Security & Consent Audit Activity" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs sm:text-sm text-slate-500 mt-1", children: "Tamper-evident simulated audit trail of authorizations, revocations, and API data queries" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-mono", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "w-3.5 h-3.5 text-emerald-400" }), (0, jsx_runtime_1.jsxs)("span", { children: [auditEvents.length, " Simulated Audit Events Logged"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col md:flex-row items-center justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative w-full md:w-80", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search events, clients, or endpoints...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center gap-3 w-full md:w-auto justify-end", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold text-slate-500", children: "Outcome:" }), (0, jsx_runtime_1.jsxs)("select", { value: outcomeFilter, onChange: (e) => setOutcomeFilter(e.target.value), className: "bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "ALL", children: "All Outcomes" }), (0, jsx_runtime_1.jsx)("option", { value: "SUCCESS", children: "Permitted" }), (0, jsx_runtime_1.jsx)("option", { value: "DENIED", children: "Denied" }), (0, jsx_runtime_1.jsx)("option", { value: "WARNING", children: "Warning" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold text-slate-500", children: "Category:" }), (0, jsx_runtime_1.jsxs)("select", { value: typeFilter, onChange: (e) => setTypeFilter(e.target.value), className: "bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "ALL", children: "All Categories" }), (0, jsx_runtime_1.jsx)("option", { value: "API", children: "API Access Attempts" }), (0, jsx_runtime_1.jsx)("option", { value: "CONSENT", children: "Consent Lifecycle" }), (0, jsx_runtime_1.jsx)("option", { value: "LOGIN", children: "Authentication" })] })] })] })] }), filteredEvents.length === 0 ? ((0, jsx_runtime_1.jsx)(EmptyState_1.EmptyState, { icon: lucide_react_1.Activity, title: "No audit events found", description: "None of the recorded security events match your search or filter criteria.", action: (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "outline", size: "sm", onClick: () => {
                        setSearchQuery('');
                        setOutcomeFilter('ALL');
                        setTypeFilter('ALL');
                    }, children: "Reset Filters" }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden", children: filteredEvents.map((evt) => ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3.5 min-w-0", children: [getEventIcon(evt.outcome), (0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center gap-2 mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-bold text-slate-900 text-xs sm:text-sm", children: evt.eventType.replace(/_/g, ' ') }), getOutcomeBadge(evt.outcome), evt.applicationName && ((0, jsx_runtime_1.jsx)("span", { className: "text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100", children: evt.applicationName }))] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-600 leading-relaxed font-normal", children: evt.description }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono mt-2", children: [evt.endpoint && (0, jsx_runtime_1.jsxs)("span", { children: ["Endpoint: ", evt.endpoint] }), evt.ipAddressMock && (0, jsx_runtime_1.jsxs)("span", { children: ["\u2022 IP: ", evt.ipAddressMock] }), evt.consentId && (0, jsx_runtime_1.jsxs)("span", { children: ["\u2022 Consent: ", evt.consentId] })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-right flex-shrink-0 sm:self-start", children: (0, jsx_runtime_1.jsx)("span", { className: "font-mono text-xs text-slate-500 font-medium", children: (0, formatters_1.formatDate)(evt.timestamp) }) })] }, evt.id))) }))] }));
};
exports.SecurityActivityPage = SecurityActivityPage;
