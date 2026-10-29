"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecentTransactions = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const OpenTrustContext_1 = require("../../context/OpenTrustContext");
const formatters_1 = require("../../utils/formatters");
const lucide_react_1 = require("lucide-react");
const react_router_dom_1 = require("react-router-dom");
const RecentTransactions = () => {
    const { transactions } = (0, OpenTrustContext_1.useOpenTrust)();
    const recent = transactions.slice(0, 6);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-base font-bold text-slate-900", children: "Recent Transactions" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-500 mt-0.5", children: "Customer ledger activity" })] }), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/transactions", className: "text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1", children: ["View All ", (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowUpRight, { className: "w-3.5 h-3.5" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "divide-y divide-slate-100", children: recent.map((txn) => {
                    const isCredit = txn.type === 'CREDIT';
                    return ((0, jsx_runtime_1.jsxs)("div", { className: "py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 px-2 rounded-xl transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-700'}`, children: isCredit ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ArrowDownLeft, { className: "w-4 h-4" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ArrowUpRight, { className: "w-4 h-4" })) }), (0, jsx_runtime_1.jsxs)("div", { className: "truncate", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-xs sm:text-sm font-semibold text-slate-800 truncate", children: txn.description }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-[11px] text-slate-400 mt-0.5", children: [(0, jsx_runtime_1.jsx)("span", { children: (0, formatters_1.formatDateOnly)(txn.timestamp) }), (0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: txn.category })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right flex-shrink-0", children: [(0, jsx_runtime_1.jsx)("div", { className: `text-xs sm:text-sm font-bold ${isCredit ? 'text-emerald-600' : 'text-slate-900'}`, children: isCredit ? `+ ${(0, formatters_1.formatINR)(txn.amount)}` : `- ${(0, formatters_1.formatINR)(txn.amount)}` }), (0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-mono text-slate-400 uppercase", children: txn.type })] })] }, txn.id));
                }) })] }));
};
exports.RecentTransactions = RecentTransactions;
