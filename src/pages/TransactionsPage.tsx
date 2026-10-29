import React, { useState, useMemo } from 'react';
import { useOpenTrust } from '../context/OpenTrustContext';
import { bankService } from '../services/mock/bankService';
import { formatINR, formatDate } from '../utils/formatters';
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  X,
  Receipt,
  Download,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';

export const TransactionsPage: React.FC = () => {
  const { transactions } = useOpenTrust();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'DEBIT' | 'CREDIT'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>(
    'date-desc'
  );

  // Available unique categories
  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return Array.from(set);
  }, [transactions]);

  // Filtered transactions
  const filtered = useMemo(() => {
    return bankService.filterTransactions(
      transactions,
      searchQuery,
      typeFilter,
      categoryFilter,
      sortBy
    );
  }, [transactions, searchQuery, typeFilter, categoryFilter, sortBy]);

  // Dynamically calculate summary totals from the filtered dataset
  const summaryTotals = useMemo(() => {
    let debits = 0;
    let credits = 0;
    filtered.forEach((t) => {
      if (t.type === 'DEBIT') debits += t.amount;
      else credits += t.amount;
    });
    return { debits, credits, net: credits - debits };
  }, [filtered]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('ALL');
    setCategoryFilter('ALL');
    setSortBy('date-desc');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    typeFilter !== 'ALL' ||
    categoryFilter !== 'ALL' ||
    sortBy !== 'date-desc';

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Transactions Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Granular financial ledger entries available for consented data sharing
          </p>
        </div>

        {/* Download CSV simulation */}
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Download className="w-3.5 h-3.5" />}
          onClick={() => alert('Simulated export: 18 transaction records exported to CSV.')}
        >
          Export CSV (Demo)
        </Button>
      </div>

      {/* Filtered Aggregates Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Matching Transactions
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {filtered.length} <span className="text-xs text-slate-400 font-normal">of {transactions.length}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Total Inflow (Credits)
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            +{formatINR(summaryTotals.credits)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Total Outflow (Debits)
          </span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">
            -{formatINR(summaryTotals.debits)}
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by merchant, description, or reference ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                typeFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('DEBIT')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                typeFilter === 'DEBIT'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Debits
            </button>
            <button
              onClick={() => setTypeFilter('CREDIT')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                typeFilter === 'CREDIT'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Credits
            </button>
          </div>
        </div>

        {/* Row 2: Category and Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Filter className="w-3.5 h-3.5" />
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No transactions found"
          description="None of your seeded transactions matched the selected filters. Try broadening your search or resetting filters."
          action={
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">Transaction Description</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Reference ID</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t) => {
                  const isCredit = t.type === 'CREDIT';
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isCredit
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isCredit ? (
                              <ArrowDownLeft className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">
                              {t.merchantName}
                            </div>
                            <div className="text-slate-500 text-[11px] truncate max-w-xs">
                              {t.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {t.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {formatDate(t.timestamp)}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                        {t.referenceNumber}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-right font-extrabold text-xs sm:text-sm">
                        <span className={isCredit ? 'text-emerald-600' : 'text-slate-900'}>
                          {isCredit ? `+ ${formatINR(t.amount)}` : `- ${formatINR(t.amount)}`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
