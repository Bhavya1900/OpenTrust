"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const Sidebar_1 = require("./Sidebar");
const TopBar_1 = require("./TopBar");
const DemoBanner_1 = require("./DemoBanner");
const lucide_react_1 = require("lucide-react");
const AppLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-slate-50 flex flex-col font-sans", children: [(0, jsx_runtime_1.jsx)(DemoBanner_1.DemoBanner, {}), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 flex overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "hidden lg:block h-[calc(100vh-37px)] sticky top-0", children: (0, jsx_runtime_1.jsx)(Sidebar_1.Sidebar, {}) }), mobileMenuOpen && ((0, jsx_runtime_1.jsxs)("div", { className: "fixed inset-0 z-50 lg:hidden flex", children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity", onClick: () => setMobileMenuOpen(false) }), (0, jsx_runtime_1.jsxs)("div", { className: "relative w-72 max-w-[80vw] bg-slate-900 z-10 shadow-2xl flex flex-col h-full", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-4 right-3", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => setMobileMenuOpen(false), className: "text-slate-400 hover:text-white p-1 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-5 h-5" }) }) }), (0, jsx_runtime_1.jsx)(Sidebar_1.Sidebar, { onCloseMobile: () => setMobileMenuOpen(false) })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 flex flex-col min-w-0 overflow-y-auto", children: [(0, jsx_runtime_1.jsx)(TopBar_1.TopBar, { onOpenMobileMenu: () => setMobileMenuOpen(true) }), (0, jsx_runtime_1.jsx)("main", { className: "flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Outlet, {}) })] })] })] }));
};
exports.AppLayout = AppLayout;
