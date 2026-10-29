"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Badge = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Badge = ({ children, variant = 'slate', size = 'md', dot = false, className = '', }) => {
    const variantStyles = {
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
        red: 'bg-rose-50 text-rose-700 border-rose-200/80',
        blue: 'bg-sky-50 text-sky-700 border-sky-200/80',
        indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
        slate: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    const dotColors = {
        emerald: 'bg-emerald-500',
        amber: 'bg-amber-500',
        red: 'bg-rose-500',
        blue: 'bg-sky-500',
        indigo: 'bg-indigo-500',
        slate: 'bg-slate-400',
    };
    const sizeStyles = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-xs font-medium px-2.5 py-1',
    };
    return ((0, jsx_runtime_1.jsxs)("span", { className: `inline-flex items-center gap-1.5 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`, children: [dot && (0, jsx_runtime_1.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${dotColors[variant]}` }), children] }));
};
exports.Badge = Badge;
