"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoBanner = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const DemoBanner = () => {
    const [dismissed, setDismissed] = (0, react_1.useState)(false);
    if (dismissed)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-blue-900/50 shadow-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2.5 mx-auto", children: [(0, jsx_runtime_1.jsxs)("span", { className: "inline-flex items-center gap-1 font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ShieldAlert, { className: "w-3 h-3 text-amber-400" }), "DEMO ENVIRONMENT"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-slate-300 hidden sm:inline", children: "Educational simulation for L&T: Open Banking Consent & Secure Data Sharing. Dummy Indian banking data only." })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setDismissed(true), className: "text-slate-400 hover:text-white p-0.5 rounded transition-colors", title: "Dismiss notice", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-3.5 h-3.5" }) })] }));
};
exports.DemoBanner = DemoBanner;
