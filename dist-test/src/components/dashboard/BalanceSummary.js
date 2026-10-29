"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceSummary = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const OpenTrustContext_1 = require("../../context/OpenTrustContext");
const formatters_1 = require("../../utils/formatters");
const lucide_react_1 = require("lucide-react");
const react_router_dom_1 = require("react-router-dom");
const BalanceSummary = () => {
    const { metrics } = (0, OpenTrustContext_1.useOpenTrust)();
    const cards = [
        {
            label: 'Total Available Balance',
            value: (0, formatters_1.formatINR)(metrics.totalBalance),
            sublabel: `Across ${metrics.accountCount} simulated bank accounts`,
            icon: lucide_react_1.Wallet,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            link: '/accounts',
            linkText: 'View Accounts',
        },
        {
            label: 'Active Consents',
            value: metrics.activeConsentCount.toString(),
            sublabel: `${metrics.revokedConsentCount} revoked • Granular permissions`,
            icon: lucide_react_1.ShieldCheck,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            link: '/consents',
            linkText: 'Manage Consents',
        },
        {
            label: 'Connected Applications',
            value: metrics.connectedAppsCount.toString(),
            sublabel: 'Registered FinTech data consumers',
            icon: lucide_react_1.Grid,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            link: '/apps',
            linkText: 'Explore Apps',
        },
        {
            label: 'Simulated API Accesses',
            value: `${metrics.recentSuccessfulAccessCount} / ${metrics.recentSuccessfulAccessCount + metrics.recentDeniedAccessCount}`,
            sublabel: `${metrics.recentDeniedAccessCount} access attempts blocked`,
            icon: lucide_react_1.ShieldAlert,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            link: '/developer',
            linkText: 'Open Console',
        },
    ];
    return ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: cards.map((card, i) => {
            const Icon = card.icon;
            return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold text-slate-500 uppercase tracking-wide", children: card.label }), (0, jsx_runtime_1.jsx)("div", { className: `p-2 rounded-xl ${card.bgColor} ${card.color}`, children: (0, jsx_runtime_1.jsx)(Icon, { className: "w-4 h-4" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-extrabold text-slate-900 tracking-tight", children: card.value }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-500 mt-1 font-medium", children: card.sublabel })] }), (0, jsx_runtime_1.jsxs)("div", { className: "pt-4 mt-3 border-t border-slate-100 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: card.link, className: "text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1", children: [card.linkText, " \u2192"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-[10px] text-slate-400 font-mono", children: "SIMULATED" })] })] }, i));
        }) }));
};
exports.BalanceSummary = BalanceSummary;
