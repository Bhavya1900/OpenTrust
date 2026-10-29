"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GranularPermissionCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const seedData_1 = require("../../data/seedData");
const lucide_react_1 = require("lucide-react");
const GranularPermissionCard = ({ requestedScopes, selectedScopes, onChange, }) => {
    const toggleScope = (scopeId) => {
        if (selectedScopes.includes(scopeId)) {
            onChange(selectedScopes.filter((s) => s !== scopeId));
        }
        else {
            onChange([...selectedScopes, scopeId]);
        }
    };
    const selectAll = () => {
        onChange([...requestedScopes]);
    };
    const deselectAll = () => {
        onChange([]);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-bold text-slate-900", children: "Select Granular Permissions" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-500 mt-0.5", children: "You have full control to approve or withhold individual data categories." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: selectAll, className: "text-xs font-semibold text-blue-600 hover:text-blue-800", children: "Select All" }), (0, jsx_runtime_1.jsx)("span", { className: "text-slate-300", children: "\u2022" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: deselectAll, className: "text-xs font-semibold text-slate-500 hover:text-slate-700", children: "Deselect All" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: seedData_1.SCOPE_DEFINITIONS.map((def) => {
                    const isRequested = requestedScopes.includes(def.id);
                    const isSelected = selectedScopes.includes(def.id);
                    return ((0, jsx_runtime_1.jsxs)("div", { onClick: () => toggleScope(def.id), className: `p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${isSelected
                            ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'}`, children: [(0, jsx_runtime_1.jsx)("div", { className: `w-5 h-5 rounded-md flex items-center justify-center mt-0.5 transition-colors flex-shrink-0 ${isSelected
                                    ? 'bg-blue-600 text-white'
                                    : 'border-2 border-slate-300 bg-white'}`, children: isSelected && (0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "w-3.5 h-3.5 stroke-[3]" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center justify-between gap-2 mb-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-bold text-slate-900", children: def.name }), isRequested && ((0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-semibold uppercase bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200", children: "Requested by App" }))] }), (0, jsx_runtime_1.jsxs)("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${def.sensitivity === 'High'
                                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                                    : def.sensitivity === 'Medium'
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`, children: [def.sensitivity, " Sensitivity"] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-600 leading-relaxed", children: def.description }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-start gap-2", children: [isSelected ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.EyeOff, { className: "w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" })), (0, jsx_runtime_1.jsxs)("span", { children: [(0, jsx_runtime_1.jsx)("strong", { className: "text-slate-700", children: "What app will receive: " }), def.whatItExposes] })] })] })] }, def.id));
                }) }), selectedScopes.length === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ShieldCheck, { className: "w-4 h-4 text-amber-600 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("span", { children: "At least one data permission must be selected to authorize access." })] }))] }));
};
exports.GranularPermissionCard = GranularPermissionCard;
