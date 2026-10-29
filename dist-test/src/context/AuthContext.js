"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.AuthProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const authService_1 = require("../services/mock/authService");
const AuthContext = (0, react_1.createContext)(undefined);
const AuthProvider = ({ children }) => {
    const [user, setUser] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        // Check if session exists in sessionStorage on page refresh
        const session = authService_1.authService.getCurrentSession();
        if (session) {
            setUser(authService_1.authService.getDemoUser());
        }
        else {
            setUser(null);
        }
        setIsLoading(false);
    }, []);
    const login = async (email, pass) => {
        setIsLoading(true);
        const res = await authService_1.authService.login(email, pass);
        setIsLoading(false);
        if (res.success && res.user) {
            setUser(res.user);
            return { success: true };
        }
        return { success: false, error: res.error || 'Login failed.' };
    };
    const logout = async () => {
        await authService_1.authService.logout();
        setUser(null);
    };
    const fillDemoCredentials = () => {
        return {
            email: 'demo@opentrust.test',
            pass: 'Demo@123',
        };
    };
    return ((0, jsx_runtime_1.jsx)(AuthContext.Provider, { value: {
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout,
            fillDemoCredentials,
        }, children: children }));
};
exports.AuthProvider = AuthProvider;
const useAuth = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
exports.useAuth = useAuth;
