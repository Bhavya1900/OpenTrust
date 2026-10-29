"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyState = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const EmptyState = ({ icon: Icon, title, description, action, }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-2xl border border-dashed border-slate-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3.5", children: (0, jsx_runtime_1.jsx)(Icon, { className: "w-6 h-6" }) }), (0, jsx_runtime_1.jsx)("h4", { className: "text-base font-semibold text-slate-800", children: title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-500 max-w-sm mt-1 mb-5", children: description }), action && (0, jsx_runtime_1.jsx)("div", { children: action })] }));
};
exports.EmptyState = EmptyState;
