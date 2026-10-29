"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const lucide_react_1 = require("lucide-react");
const AuthContext_1 = require("../../context/AuthContext");
const OpenTrustContext_1 = require("../../context/OpenTrustContext");
const Sidebar = ({ onCloseMobile }) => {
    const { user, logout } = (0, AuthContext_1.useAuth)();
    const { consents, resetDemoData } = (0, OpenTrustContext_1.useOpenTrust)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const activeConsentsCount = consents.filter((c) => c.status === 'ACTIVE').length;
    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: lucide_react_1.LayoutDashboard },
        { label: 'My Accounts', path: '/accounts', icon: lucide_react_1.WalletCards },
        { label: 'Transactions', path: '/transactions', icon: lucide_react_1.Receipt },
        { label: 'Connected Apps', path: '/apps', icon: lucide_react_1.Grid },
        {
            label: 'Consent Management',
            path: '/consents',
            icon: lucide_react_1.ShieldCheck,
            badge: activeConsentsCount > 0 ? activeConsentsCount : undefined,
        },
        { label: 'Security Activity', path: '/activity', icon: lucide_react_1.Activity },
        { label: 'Developer Console', path: '/developer', icon: lucide_react_1.Terminal, highlight: true },
        { label: 'Settings', path: '/settings', icon: lucide_react_1.Settings },
    ];
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    return ((0, jsx_runtime_1.jsxs)("aside", { className: "w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 select-none", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-5 border-b border-slate-800", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-900/40", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "w-5 h-5 stroke-[2.2]" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-extrabold text-white text-base tracking-tight", children: "OpenTrust" }), (0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded", children: "PROTOTYPE" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-[11px] text-slate-400 font-medium", children: "Consent & Data Sharing" })] })] }) }), (0, jsx_runtime_1.jsxs)("nav", { className: "flex-1 px-3 py-4 space-y-1 overflow-y-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400", children: "Customer Portal" }), navItems.map((item) => {
                        const Icon = item.icon;
                        return ((0, jsx_runtime_1.jsxs)(react_router_dom_1.NavLink, { to: item.path, onClick: onCloseMobile, className: ({ isActive }) => `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 font-semibold'
                                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'} ${item.highlight ? 'border border-blue-500/30' : ''}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(Icon, { className: "w-4 h-4 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("span", { children: item.label })] }), item.badge !== undefined && ((0, jsx_runtime_1.jsx)("span", { className: "text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30", children: item.badge }))] }, item.path));
                    }), (0, jsx_runtime_1.jsx)("div", { className: "pt-4 px-1", children: (0, jsx_runtime_1.jsxs)("button", { onClick: () => {
                                if (window.confirm('Reset all demo consent states & simulator logs back to seed values?')) {
                                    resetDemoData();
                                }
                            }, className: "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors", title: "Reset prototype state back to initial seed data", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RotateCcw, { className: "w-3.5 h-3.5 text-slate-400" }), (0, jsx_runtime_1.jsx)("span", { children: "Reset Demo State" })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 border-t border-slate-800 bg-slate-950/40", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 mb-2 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2.5 min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded-full bg-blue-900/60 border border-blue-600/50 flex items-center justify-center text-blue-300 flex-shrink-0 font-bold text-xs", children: user?.name.split(' ').map((n) => n[0]).join('') || (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "truncate", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs font-semibold text-slate-200 truncate", children: user?.name || 'Demo Customer' }), (0, jsx_runtime_1.jsx)("div", { className: "text-[10px] text-slate-400 font-mono truncate", children: user?.maskedCustomerId || 'CUST-IN-984210' })] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleLogout, title: "Sign out of prototype", className: "text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-700/60 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.LogOut, { className: "w-4 h-4" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-[10px] text-slate-400 text-center leading-tight", children: "L&T College Project \u2022 Phase 1 Prototype" })] })] }));
};
exports.Sidebar = Sidebar;
