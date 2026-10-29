"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../context/AuthContext");
const Button_1 = require("../components/common/Button");
const lucide_react_1 = require("lucide-react");
const LoginPage = () => {
    const { login, fillDemoCredentials, isAuthenticated } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const location = (0, react_router_dom_1.useLocation)();
    const [email, setEmail] = (0, react_1.useState)('demo@opentrust.test');
    const [password, setPassword] = (0, react_1.useState)('Demo@123');
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const [rememberMe, setRememberMe] = (0, react_1.useState)(true);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [errorMessage, setErrorMessage] = (0, react_1.useState)(null);
    // If already logged in, redirect
    const from = location.state?.from?.pathname || '/dashboard';
    react_1.default.useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        if (!email.trim()) {
            setErrorMessage('Please enter your email address.');
            return;
        }
        if (!password) {
            setErrorMessage('Please enter your password.');
            return;
        }
        setIsLoading(true);
        const result = await login(email, password);
        setIsLoading(false);
        if (result.success) {
            navigate(from, { replace: true });
        }
        else {
            setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
        }
    };
    const handleAutofill = () => {
        const creds = fillDemoCredentials();
        setEmail(creds.email);
        setPassword(creds.pass);
        setErrorMessage(null);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" }), (0, jsx_runtime_1.jsxs)("div", { className: "sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: "w-3.5 h-3.5 text-amber-400" }), (0, jsx_runtime_1.jsx)("span", { children: "PHASE 1 INTERACTIVE PROTOTYPE" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-11 w-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-blue-900/50", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "w-6 h-6 stroke-[2.2]" }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-3xl font-extrabold text-white tracking-tight", children: "OpenTrust" })] }), (0, jsx_runtime_1.jsx)("h2", { className: "mt-2 text-sm text-slate-400 font-medium", children: "Open Banking Consent & Secure Data Sharing Platform" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "sm:mx-auto sm:w-full sm:max-w-md relative z-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-900/90 border border-slate-800 shadow-2xl rounded-3xl p-6 sm:p-8 backdrop-blur-xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-white tracking-tight", children: "Demo Customer Portal" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-400 mt-1", children: "Sign in to simulate customer consent authorizations and inspect API access." })] }), errorMessage && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" }), (0, jsx_runtime_1.jsx)("span", { children: errorMessage })] })), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-xs font-semibold text-slate-300 mb-1.5", children: "Email Address" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "demo@opentrust.test", required: true, className: "w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-xs font-semibold text-slate-300 mb-1.5", children: "Password" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("input", { type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true, className: "w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600 font-mono" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors", children: showPassword ? (0, jsx_runtime_1.jsx)(lucide_react_1.EyeOff, { className: "w-4 h-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "w-4 h-4" }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs pt-1", children: [(0, jsx_runtime_1.jsxs)("label", { className: "flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: rememberMe, onChange: (e) => setRememberMe(e.target.checked), className: "rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" }), (0, jsx_runtime_1.jsx)("span", { children: "Remember demo session" })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-[11px] text-slate-500", children: "Fictitious Credentials" })] }), (0, jsx_runtime_1.jsx)(Button_1.Button, { type: "submit", variant: "secondary", className: "w-full mt-2 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30", isLoading: isLoading, children: "Enter Customer Portal" })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 pt-5 border-t border-slate-800/80", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2.5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-bold text-slate-300 flex items-center gap-1.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "w-3.5 h-3.5 text-amber-400" }), "College Evaluation Account"] }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: handleAutofill, className: "text-[11px] font-semibold text-blue-400 hover:text-blue-300 underline", children: "Autofill" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/80 p-2 rounded-xl", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-500 block text-[10px]", children: "Email:" }), "demo@opentrust.test"] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-500 block text-[10px]", children: "Password:" }), "Demo@123"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 text-[10px] text-slate-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle2, { className: "w-3 h-3 text-emerald-400" }), (0, jsx_runtime_1.jsx)("span", { children: "Simulates full consent lifecycle without external database." })] })] }) })] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-4 text-center text-[11px] text-slate-500 leading-relaxed px-4", children: "This system is an academic simulation built for L&T. Does not store real personal or banking credentials. Real JWT verification is slated for Phase 2 backend." })] })] }));
};
exports.LoginPage = LoginPage;
