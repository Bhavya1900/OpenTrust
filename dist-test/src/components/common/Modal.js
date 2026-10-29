"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'lg', }) => {
    (0, react_1.useEffect)(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity", onClick: onClose, "aria-hidden": "true" }), (0, jsx_runtime_1.jsxs)("div", { role: "dialog", "aria-modal": "true", className: `relative w-full ${maxWidthClasses[maxWidth]} bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all my-8`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50/50", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold text-slate-900", children: title }), subtitle && (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-500 mt-0.5", children: subtitle })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, "aria-label": "Close dialog", className: "text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-100 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-5 h-5" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: children })] })] }));
};
exports.Modal = Modal;
