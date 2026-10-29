"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialActivityChart = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const OpenTrustContext_1 = require("../../context/OpenTrustContext");
const bankService_1 = require("../../services/mock/bankService");
const formatters_1 = require("../../utils/formatters");
const recharts_1 = require("recharts");
const CATEGORY_COLORS = [
    '#2563EB', // blue
    '#10B981', // emerald
    '#F59E0B', // amber
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
];
const FinancialActivityChart = () => {
    const { transactions } = (0, OpenTrustContext_1.useOpenTrust)();
    const [activeTab, setActiveTab] = (0, react_1.useState)('cashflow');
    const cashFlowData = bankService_1.bankService.getCashFlowTrend(transactions);
    const categoryData = bankService_1.bankService.getSpendingByCategory(transactions);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-base font-bold text-slate-900", children: "Financial Activity Analytics" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-500 mt-0.5", children: "Derived directly from mock transaction ledger data" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('cashflow'), className: `px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'cashflow'
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'}`, children: "Income vs Outflow" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('category'), className: `px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'category'
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'}`, children: "Spending Breakdown" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-64 w-full", children: activeTab === 'cashflow' ? ((0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: cashFlowData, margin: { top: 10, right: 10, left: -15, bottom: 0 }, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3", stroke: "#f1f5f9", vertical: false }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "date", tick: { fill: '#64748b', fontSize: 11 }, tickLine: false }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { tick: { fill: '#64748b', fontSize: 10 }, tickLine: false, axisLine: false, tickFormatter: (val) => `₹${val >= 1000 ? `${Math.round(val / 1000)}k` : val}` }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { formatter: (value) => [(0, formatters_1.formatINR)(value), ''], contentStyle: {
                                    backgroundColor: '#0f172a',
                                    borderRadius: '12px',
                                    border: 'none',
                                    color: '#fff',
                                    fontSize: '12px',
                                } }), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "income", name: "Income", fill: "#10B981", radius: [4, 4, 0, 0] }), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "expense", name: "Expense", fill: "#EF4444", radius: [4, 4, 0, 0] })] }) })) : ((0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.PieChart, { children: [(0, jsx_runtime_1.jsx)(recharts_1.Pie, { data: categoryData, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", innerRadius: 50, outerRadius: 80, paddingAngle: 3, children: categoryData.map((_, index) => ((0, jsx_runtime_1.jsx)(recharts_1.Cell, { fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }, `cell-${index}`))) }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { formatter: (value) => [(0, formatters_1.formatINR)(value), 'Amount'], contentStyle: {
                                    backgroundColor: '#0f172a',
                                    borderRadius: '12px',
                                    border: 'none',
                                    color: '#fff',
                                    fontSize: '12px',
                                } }), (0, jsx_runtime_1.jsx)(recharts_1.Legend, { verticalAlign: "bottom", height: 36, iconType: "circle", wrapperStyle: { fontSize: '11px', color: '#64748b' } })] }) })) })] }));
};
exports.FinancialActivityChart = FinancialActivityChart;
