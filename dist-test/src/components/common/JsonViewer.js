"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonViewer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const JsonViewer = ({ data, title = 'Response Payload (JSON)', maxHeight = 'max-h-96', }) => {
    const [copied, setCopied] = (0, react_1.useState)(false);
    const formattedJson = JSON.stringify(data, null, 2);
    const handleCopy = () => {
        navigator.clipboard.writeText(formattedJson);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-xl border border-slate-800 bg-slate-950 text-slate-100 overflow-hidden shadow-inner font-mono text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-slate-400", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-slate-300", children: title })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleCopy, className: "flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs", title: "Copy JSON to clipboard", children: copied ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "w-3.5 h-3.5 text-emerald-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-emerald-400", children: "Copied" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { className: "w-3.5 h-3.5" }), (0, jsx_runtime_1.jsx)("span", { children: "Copy" })] })) })] }), (0, jsx_runtime_1.jsx)("div", { className: `p-4 overflow-x-auto ${maxHeight} text-emerald-400 leading-relaxed font-mono`, children: (0, jsx_runtime_1.jsx)("pre", { children: formattedJson }) })] }));
};
exports.JsonViewer = JsonViewer;
