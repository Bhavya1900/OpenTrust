"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundPage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const lucide_react_1 = require("lucide-react");
const Button_1 = require("../components/common/Button");
const NotFoundPage = () => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-[70vh] flex flex-col items-center justify-center text-center px-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ShieldAlert, { className: "w-8 h-8" }) }), (0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-black text-slate-900 tracking-tight", children: "404 \u2014 Page Not Found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-500 max-w-md mt-2 mb-6", children: "The route you navigated to does not exist in the OpenTrust portal. Return to the customer dashboard." }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/dashboard", children: (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "primary", size: "md", leftIcon: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "w-4 h-4" }), children: "Back to Dashboard" }) })] }));
};
exports.NotFoundPage = NotFoundPage;
