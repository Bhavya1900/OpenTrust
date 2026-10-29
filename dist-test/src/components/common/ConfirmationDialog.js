"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmationDialog = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Modal_1 = require("./Modal");
const Button_1 = require("./Button");
const lucide_react_1 = require("lucide-react");
const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, description, confirmLabel = 'Confirm Action', cancelLabel = 'Cancel', variant = 'danger', isLoading = false, }) => {
    return ((0, jsx_runtime_1.jsx)(Modal_1.Modal, { isOpen: isOpen, onClose: onClose, title: title, maxWidth: "md", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm leading-relaxed text-rose-800", children: description })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-end gap-3 pt-4 border-t border-slate-100", children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "outline", onClick: onClose, disabled: isLoading, children: cancelLabel }), (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: variant === 'danger' ? 'danger' : 'primary', onClick: onConfirm, isLoading: isLoading, children: confirmLabel })] })] }) }));
};
exports.ConfirmationDialog = ConfirmationDialog;
