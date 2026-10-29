/**
 * Utility functions for Indian FinTech data formatting
 */

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateInput: string | Date | undefined): string {
  if (!dateInput) return '—';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatDateOnly(dateInput: string | Date | undefined): string {
  if (!dateInput) return '—';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatRelativeTime(dateInput: string | Date | undefined): string {
  if (!dateInput) return '—';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '—';

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDateOnly(date);
}

export function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber) return '••••';
  const cleaned = accountNumber.replace(/\s+/g, '');
  if (cleaned.length <= 4) return `•••• ${cleaned}`;
  const lastFour = cleaned.slice(-4);
  return `•••• •••• ${lastFour}`;
}

export function getStatusColorClass(status: string): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'SUCCESS':
    case 'VERIFIED':
      return {
        bg: 'bg-emerald-50 text-emerald-700',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'PENDING':
    case 'WARNING':
      return {
        bg: 'bg-amber-50 text-amber-700',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'EXPIRED':
      return {
        bg: 'bg-slate-100 text-slate-700',
        text: 'text-slate-700',
        border: 'border-slate-300',
        dot: 'bg-slate-400',
      };
    case 'REVOKED':
    case 'DENIED':
    case 'FAILURE':
    case 'FROZEN':
      return {
        bg: 'bg-red-50 text-red-700',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-500',
      };
    default:
      return {
        bg: 'bg-slate-50 text-slate-700',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
      };
  }
}
