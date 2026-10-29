import React from 'react';
import { formatDate } from '../../utils/formatters';
import { Clock, Calendar } from 'lucide-react';

interface DurationSelectorProps {
  selectedDuration: number;
  onChange: (days: number) => void;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({
  selectedDuration,
  onChange,
}) => {
  const options = [
    { days: 1, label: '1 Day', note: 'Single-session or short audit' },
    { days: 7, label: '7 Days', note: 'Weekly budgeting trial' },
    { days: 30, label: '30 Days', note: 'Standard monthly finance cycle' },
  ];

  const getCalculatedExpiry = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
  };

  const calculatedExpiry = getCalculatedExpiry(selectedDuration);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Consent Validity Duration</span>
        </label>
        <span className="text-[11px] text-slate-500 font-medium">Non-perpetual validity</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {options.map((opt) => {
          const isSelected = selectedDuration === opt.days;
          return (
            <button
              type="button"
              key={opt.days}
              onClick={() => onChange(opt.days)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-sm font-bold text-slate-900">{opt.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">{opt.note}</div>
            </button>
          );
        })}
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Calculated Expiration Timestamp:</span>
        </div>
        <span className="font-mono font-semibold text-slate-800">
          {formatDate(calculatedExpiry)}
        </span>
      </div>
    </div>
  );
};
