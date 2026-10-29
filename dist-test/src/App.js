"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("./context/AuthContext");
const OpenTrustContext_1 = require("./context/OpenTrustContext");
const AppRoutes_1 = require("./routes/AppRoutes");
const App = () => {
    return ((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsx)(AuthContext_1.AuthProvider, { children: (0, jsx_runtime_1.jsx)(OpenTrustContext_1.OpenTrustProvider, { children: (0, jsx_runtime_1.jsx)(AppRoutes_1.AppRoutes, {}) }) }) }));
};
exports.App = App;
exports.default = exports.App;
