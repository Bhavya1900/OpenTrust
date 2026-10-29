"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopBar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const react_router_dom_1 = require("react-router-dom");
const Button_1 = require("../common/Button");
const TopBar = ({ onOpenMobileMenu }) => {
    const location = (0, react_router_dom_1.useLocation)();
    const getPageInfo = () => {
        const path = location.pathname;
        if (path.startsWith('/dashboard'))
            return { title: 'Customer Dashboard', category: 'Overview' };
        if (path.startsWith('/accounts'))
            return { title: 'My Accounts', category: 'Banking' };
        if (path.startsWith('/transactions'))
            return { title: 'Transactions Explorer', category: 'Activity' };
        if (path.startsWith('/apps'))
            return { title: 'Connected Applications', category: 'Ecosystem' };
        if (path.startsWith('/consent/request'))
            return { title: 'Consent Authorization Request', category: 'Consent' };
        if (path.startsWith('/consents'))
            return { title: 'Consent Management', category: 'Governance' };
        if (path.startsWith('/activity'))
            return { title: 'Security Activity Log', category: 'Audit' };
        if (path.startsWith('/developer'))
            return { title: 'Developer Console & Simulator', category: 'API Testing' };
        if (path.startsWith('/settings'))
            return { title: 'Preferences & Identity', category: 'Settings' };
        return { title: 'OpenTrust', category: 'Platform' };
    };
    const page = getPageInfo();
    return ((0, jsx_runtime_1.jsxs)("header", { className: "h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onOpenMobileMenu, className: "lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg", "aria-label": "Open navigation menu", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { className: "w-5 h-5" }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline", children: page.category }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-slate-300 hidden sm:inline", children: "/" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-base sm:text-lg font-bold text-slate-900 leading-tight", children: page.title })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ShieldAlert, { className: "w-3.5 h-3.5 text-amber-600" }), (0, jsx_runtime_1.jsx)("span", { children: "SIMULATED ENVIRONMENT" })] }), location.pathname !== '/developer' ? ((0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/developer", children: (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "outline", size: "sm", leftIcon: (0, jsx_runtime_1.jsx)(lucide_react_1.Terminal, { className: "w-3.5 h-3.5 text-blue-600" }), children: "API Simulator" }) })) : ((0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/consents", children: (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "outline", size: "sm", leftIcon: (0, jsx_runtime_1.jsx)(lucide_react_1.ShieldCheck, { className: "w-3.5 h-3.5 text-emerald-600" }), children: "Manage Consents" }) }))] })] }));
};
exports.TopBar = TopBar;
