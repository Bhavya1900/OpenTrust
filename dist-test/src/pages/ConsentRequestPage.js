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
exports.ConsentRequestPage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const OpenTrustContext_1 = require("../context/OpenTrustContext");
const GranularPermissionCard_1 = require("../components/consent/GranularPermissionCard");
const DurationSelector_1 = require("../components/consent/DurationSelector");
const ConsentSummaryCard_1 = require("../components/consent/ConsentSummaryCard");
const Button_1 = require("../components/common/Button");
const lucide_react_1 = require("lucide-react");
const ConsentRequestPage = () => {
    const { appId, consentId } = (0, react_router_dom_1.useParams)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { applications, consents, approveConsent, denyConsent } = (0, OpenTrustContext_1.useOpenTrust)();
    // Find app either by appId or by finding the consent's application
    const app = react_1.default.useMemo(() => {
        if (appId) {
            return applications.find((a) => a.id === appId);
        }
        if (consentId) {
            const c = consents.find((item) => item.id === consentId);
            if (c)
                return applications.find((a) => a.id === c.applicationId);
        }
        return applications[0]; // fallback to first app
    }, [appId, consentId, applications, consents]);
    // Existing consent if any
    const existingConsent = react_1.default.useMemo(() => {
        if (!app)
            return undefined;
        return consents.find((c) => c.applicationId === app.id);
    }, [app, consents]);
    // State for user configuration
    const [selectedScopes, setSelectedScopes] = (0, react_1.useState)(() => {
        if (existingConsent && existingConsent.approvedScopes.length > 0) {
            return [...existingConsent.approvedScopes];
        }
        return app ? [...app.requestedDefaultScopes] : ['ACCOUNT_DETAILS', 'ACCOUNT_BALANCES'];
    });
    const [durationDays, setDurationDays] = (0, react_1.useState)(() => {
        return existingConsent ? existingConsent.durationDays : 30;
    });
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const [notification, setNotification] = (0, react_1.useState)(null);
    if (!app) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-bold text-slate-800", children: "Application Not Found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-500 mt-1 mb-4", children: "The requested application could not be located in the demo registry." }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/apps", children: (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "outline", size: "sm", children: "Back to Connected Apps" }) })] }));
    }
    const handleApprove = async () => {
        if (selectedScopes.length === 0)
            return;
        setIsSubmitting(true);
        try {
            await approveConsent(app.id, selectedScopes, durationDays);
            setNotification({
                type: 'success',
                message: `Consent successfully authorized for ${app.name} with ${selectedScopes.length} data scope(s).`,
            });
            setTimeout(() => {
                navigate('/consents');
            }, 1200);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDeny = async () => {
        setIsSubmitting(true);
        try {
            await denyConsent(app.id, app.requestedDefaultScopes);
            setNotification({
                type: 'denied',
                message: `Consent request from ${app.name} was rejected. Access has been denied and logged.`,
            });
            setTimeout(() => {
                navigate('/apps');
            }, 1200);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-4xl mx-auto space-y-6 pb-12", children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/apps", className: "inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "w-3.5 h-3.5" }), (0, jsx_runtime_1.jsx)("span", { children: "Back to Connected Applications" })] }) }), notification && ((0, jsx_runtime_1.jsxs)("div", { className: `p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-fadeIn ${notification.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'}`, children: [notification.type === 'success' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle2, { className: "w-5 h-5 text-emerald-600 flex-shrink-0" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-rose-600 flex-shrink-0" })), (0, jsx_runtime_1.jsx)("span", { children: notification.message })] })), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white relative", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xl font-bold shadow-inner", children: app.name.charAt(0) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold text-blue-300 uppercase tracking-wider", children: "Open Banking Authorization" }), (0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded", children: "SIMULATION" })] }), (0, jsx_runtime_1.jsx)("h1", { className: "text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5", children: app.name }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-slate-300 font-mono mt-0.5", children: ["Client ID: ", app.clientId, " \u2022 Developer: ", app.developer] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 self-start sm:self-auto bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs text-blue-200", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "w-3.5 h-3.5 text-blue-300" }), (0, jsx_runtime_1.jsx)("span", { children: "TLS 1.3 End-to-End Encrypted" })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 sm:p-8 space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.HelpCircle, { className: "w-4 h-4 text-blue-600" }), (0, jsx_runtime_1.jsx)("span", { children: "Why is this application requesting your data?" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs sm:text-sm text-slate-600 leading-relaxed font-normal", children: app.purpose })] }), (0, jsx_runtime_1.jsx)(GranularPermissionCard_1.GranularPermissionCard, { requestedScopes: app.requestedDefaultScopes, selectedScopes: selectedScopes, onChange: setSelectedScopes }), (0, jsx_runtime_1.jsx)("div", { className: "pt-4 border-t border-slate-100", children: (0, jsx_runtime_1.jsx)(DurationSelector_1.DurationSelector, { selectedDuration: durationDays, onChange: setDurationDays }) }), (0, jsx_runtime_1.jsx)(ConsentSummaryCard_1.ConsentSummaryCard, { app: app, selectedScopes: selectedScopes, durationDays: durationDays }), (0, jsx_runtime_1.jsxs)("div", { className: "pt-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 w-full sm:w-auto", children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { type: "button", variant: "outline", size: "md", onClick: () => navigate('/apps'), disabled: isSubmitting, className: "w-full sm:w-auto", children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.Button, { type: "button", variant: "danger", size: "md", onClick: handleDeny, isLoading: isSubmitting, leftIcon: (0, jsx_runtime_1.jsx)(lucide_react_1.ShieldX, { className: "w-4 h-4" }), className: "w-full sm:w-auto", children: "Deny Request" })] }), (0, jsx_runtime_1.jsxs)(Button_1.Button, { type: "button", variant: "success", size: "lg", onClick: handleApprove, disabled: selectedScopes.length === 0 || isSubmitting, isLoading: isSubmitting, leftIcon: (0, jsx_runtime_1.jsx)(lucide_react_1.ShieldCheck, { className: "w-5 h-5" }), className: "w-full sm:w-auto shadow-md shadow-emerald-700/20", children: ["Allow Access (", selectedScopes.length, " Scopes)"] })] })] })] })] }));
};
exports.ConsentRequestPage = ConsentRequestPage;
