"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DurationSelector = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const formatters_1 = require("../../utils/formatters");
const lucide_react_1 = require("lucide-react");
const DurationSelector = ({ selectedDuration, onChange, }) => {
    const options = [
        { days: 1, label: '1 Day', note: 'Single-session or short audit' },
        { days: 7, label: '7 Days', note: 'Weekly budgeting trial' },
        { days: 30, label: '30 Days', note: 'Standard monthly finance cycle' },
    ];
    const getCalculatedExpiry = (days) => {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString();
    };
    const calculatedExpiry = getCalculatedExpiry(selectedDuration);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("label", { className: "text-sm font-bold text-slate-900 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4 text-blue-600" }), (0, jsx_runtime_1.jsx)("span", { children: "Consent Validity Duration" })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-[11px] text-slate-500 font-medium", children: "Non-perpetual validity" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-3 gap-3", children: options.map((opt) => {
                    const isSelected = selectedDuration === opt.days;
                    return ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => onChange(opt.days), className: `p-3.5 rounded-xl border text-left transition-all ${isSelected
                            ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-bold text-slate-900", children: opt.label }), (0, jsx_runtime_1.jsx)("div", { className: "text-[11px] text-slate-500 mt-0.5 leading-tight", children: opt.note })] }, opt.days));
                }) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4 text-slate-400" }), (0, jsx_runtime_1.jsx)("span", { children: "Calculated Expiration Timestamp:" })] }), (0, jsx_runtime_1.jsx)("span", { className: "font-mono font-semibold text-slate-800", children: (0, formatters_1.formatDate)(calculatedExpiry) })] })] }));
};
exports.DurationSelector = DurationSelector;
