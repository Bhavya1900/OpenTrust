"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../context/AuthContext");
const AppLayout_1 = require("../components/layout/AppLayout");
const LoginPage_1 = require("../pages/LoginPage");
const DashboardPage_1 = require("../pages/DashboardPage");
const AccountsPage_1 = require("../pages/AccountsPage");
const TransactionsPage_1 = require("../pages/TransactionsPage");
const ConnectedAppsPage_1 = require("../pages/ConnectedAppsPage");
const ConsentRequestPage_1 = require("../pages/ConsentRequestPage");
const ConsentManagementPage_1 = require("../pages/ConsentManagementPage");
const SecurityActivityPage_1 = require("../pages/SecurityActivityPage");
const DeveloperConsolePage_1 = require("../pages/DeveloperConsolePage");
const SettingsPage_1 = require("../pages/SettingsPage");
const NotFoundPage_1 = require("../pages/NotFoundPage");
// Protected Route Guard
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = (0, AuthContext_1.useAuth)();
    const location = (0, react_router_dom_1.useLocation)();
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-slate-900 flex items-center justify-center text-white", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-mono text-slate-400", children: "Loading OpenTrust Prototype..." })] }) }));
    }
    if (!isAuthenticated) {
        return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
};
const AppRoutes = () => {
    return ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/login", element: (0, jsx_runtime_1.jsx)(LoginPage_1.LoginPage, {}) }), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Route, { element: (0, jsx_runtime_1.jsx)(ProtectedRoute, { children: (0, jsx_runtime_1.jsx)(AppLayout_1.AppLayout, {}) }), children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/dashboard", replace: true }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/dashboard", element: (0, jsx_runtime_1.jsx)(DashboardPage_1.DashboardPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/accounts", element: (0, jsx_runtime_1.jsx)(AccountsPage_1.AccountsPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/transactions", element: (0, jsx_runtime_1.jsx)(TransactionsPage_1.TransactionsPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/apps", element: (0, jsx_runtime_1.jsx)(ConnectedAppsPage_1.ConnectedAppsPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/consent/request/:appId", element: (0, jsx_runtime_1.jsx)(ConsentRequestPage_1.ConsentRequestPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/consent/:consentId", element: (0, jsx_runtime_1.jsx)(ConsentRequestPage_1.ConsentRequestPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/consents", element: (0, jsx_runtime_1.jsx)(ConsentManagementPage_1.ConsentManagementPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/activity", element: (0, jsx_runtime_1.jsx)(SecurityActivityPage_1.SecurityActivityPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/developer", element: (0, jsx_runtime_1.jsx)(DeveloperConsolePage_1.DeveloperConsolePage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/settings", element: (0, jsx_runtime_1.jsx)(SettingsPage_1.SettingsPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "*", element: (0, jsx_runtime_1.jsx)(NotFoundPage_1.NotFoundPage, {}) })] })] }));
};
exports.AppRoutes = AppRoutes;
