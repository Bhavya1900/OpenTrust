"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectedAppsSummary = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const OpenTrustContext_1 = require("../../context/OpenTrustContext");
const formatters_1 = require("../../utils/formatters");
const lucide_react_1 = require("lucide-react");
const react_router_dom_1 = require("react-router-dom");
const Badge_1 = require("../common/Badge");
const ConnectedAppsSummary = () => {
    const { applications, consents } = (0, OpenTrustContext_1.useOpenTrust)();
    const getIcon = (iconName) => {
        switch (iconName) {
            case 'TrendingUp':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-5 h-5 text-blue-600" });
            case 'PieChart':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.PieChart, { className: "w-5 h-5 text-purple-600" });
            case 'ShieldCheck':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.ShieldCheck, { className: "w-5 h-5 text-emerald-600" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.ExternalLink, { className: "w-5 h-5 text-slate-600" });
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-5", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-base font-bold text-slate-900", children: "Connected Applications" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-500 mt-0.5", children: "Third-party FinTech clients registered in the ecosystem" })] }), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/apps", className: "text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1", children: ["All Apps ", (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowUpRight, { className: "w-3.5 h-3.5" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: applications.map((app) => {
                    const consent = consents.find((c) => c.applicationId === app.id);
                    const status = consent ? consent.status : 'PENDING';
                    const badgeVariant = status === 'ACTIVE'
                        ? 'emerald'
                        : status === 'REVOKED'
                            ? 'red'
                            : status === 'EXPIRED'
                                ? 'slate'
                                : 'amber';
                    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition-all flex flex-col justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center", children: getIcon(app.icon) }), (0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: badgeVariant, size: "sm", dot: true, children: status })] }), (0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-bold text-slate-900", children: app.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed", children: app.description }), consent && consent.status === 'ACTIVE' && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-3 pt-3 border-t border-slate-200/60", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1", children: "Approved Data Scopes:" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1", children: consent.approvedScopes.map((scope) => ((0, jsx_runtime_1.jsx)("span", { className: "text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium border border-blue-100", children: scope === 'ACCOUNT_DETAILS'
                                                        ? 'Details'
                                                        : scope === 'ACCOUNT_BALANCES'
                                                            ? 'Balances'
                                                            : 'Transactions' }, scope))) })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[11px] text-slate-400", children: consent?.expiresAt ? `Exp: ${(0, formatters_1.formatDateOnly)(consent.expiresAt)}` : 'No active grant' }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: consent ? `/consents` : `/consent/request/${app.id}`, className: "font-semibold text-blue-600 hover:text-blue-800", children: consent ? 'Review Consent' : 'Authorize &rarr;' })] })] }, app.id));
                }) })] }));
};
exports.ConnectedAppsSummary = ConnectedAppsSummary;
