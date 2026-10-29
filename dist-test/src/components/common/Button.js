"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Button = ({ children, variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, className = '', disabled, ...props }) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-lg';
    const variantStyles = {
        primary: 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 shadow-sm active:translate-y-px',
        secondary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600 shadow-sm active:translate-y-px',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-600 shadow-sm active:translate-y-px',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-sm active:translate-y-px',
        outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:ring-slate-400',
        ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400',
    };
    const sizeStyles = {
        sm: 'text-xs px-2.5 py-1.5 gap-1.5',
        md: 'text-sm px-4 py-2 gap-2',
        lg: 'text-base px-5 py-2.5 gap-2.5',
    };
    return ((0, jsx_runtime_1.jsxs)("button", { className: `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`, disabled: disabled || isLoading, ...props, children: [isLoading ? ((0, jsx_runtime_1.jsxs)("svg", { className: "animate-spin -ml-0.5 h-4 w-4 text-current", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0, jsx_runtime_1.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v8H4z" })] })) : (leftIcon), (0, jsx_runtime_1.jsx)("span", { children: children }), !isLoading && rightIcon] }));
};
exports.Button = Button;
