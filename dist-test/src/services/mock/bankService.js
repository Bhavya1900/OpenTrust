"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bankService = void 0;
exports.bankService = {
    /**
     * Calculate aggregate metrics dynamically from the live in-memory state
     */
    calculateMetrics(accounts, consents, apiLogs, connectedAppsCount) {
        const totalBalance = accounts
            .filter((a) => a.status === 'ACTIVE')
            .reduce((sum, acc) => sum + acc.balance, 0);
        const activeConsentCount = consents.filter((c) => c.status === 'ACTIVE').length;
        const revokedConsentCount = consents.filter((c) => c.status === 'REVOKED').length;
        const recentSuccessfulAccessCount = apiLogs.filter((log) => log.status === 'SUCCESS').length;
        const recentDeniedAccessCount = apiLogs.filter((log) => log.status === 'DENIED').length;
        return {
            totalBalance,
            accountCount: accounts.length,
            connectedAppsCount,
            activeConsentCount,
            revokedConsentCount,
            recentSuccessfulAccessCount,
            recentDeniedAccessCount,
        };
    },
    /**
     * Filter transactions with search, type, category, and date range
     */
    filterTransactions(transactions, query, typeFilter, categoryFilter, sortBy) {
        let result = [...transactions];
        if (query.trim()) {
            const q = query.toLowerCase().trim();
            result = result.filter((t) => t.description.toLowerCase().includes(q) ||
                t.merchantName.toLowerCase().includes(q) ||
                t.referenceNumber.toLowerCase().includes(q));
        }
        if (typeFilter !== 'ALL') {
            result = result.filter((t) => t.type === typeFilter);
        }
        if (categoryFilter && categoryFilter !== 'ALL') {
            result = result.filter((t) => t.category === categoryFilter);
        }
        result.sort((a, b) => {
            if (sortBy === 'date-desc') {
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            }
            if (sortBy === 'date-asc') {
                return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            }
            if (sortBy === 'amount-desc') {
                return b.amount - a.amount;
            }
            if (sortBy === 'amount-asc') {
                return a.amount - b.amount;
            }
            return 0;
        });
        return result;
    },
    /**
     * Aggregates monthly spend/income for the Recharts visualization
     */
    getSpendingByCategory(transactions) {
        const categoryTotals = {};
        transactions
            .filter((t) => t.type === 'DEBIT')
            .forEach((t) => {
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        });
        return Object.entries(categoryTotals).map(([name, value]) => ({
            name,
            value: Math.round(value),
        }));
    },
    /**
     * Aggregates daily/weekly inflow vs outflow for charts
     */
    getCashFlowTrend(transactions) {
        const dailyMap = {};
        // Take recent transactions
        const sorted = [...transactions].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        sorted.forEach((t) => {
            const d = new Date(t.timestamp);
            const label = `${d.getDate()} ${d.toLocaleString('en-US', { month: 'short' })}`;
            if (!dailyMap[label]) {
                dailyMap[label] = { income: 0, expense: 0 };
            }
            if (t.type === 'CREDIT') {
                dailyMap[label].income += t.amount;
            }
            else {
                dailyMap[label].expense += t.amount;
            }
        });
        return Object.entries(dailyMap).map(([date, vals]) => ({
            date,
            income: Math.round(vals.income),
            expense: Math.round(vals.expense),
        }));
    },
};
