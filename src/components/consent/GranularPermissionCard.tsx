import React from 'react';
import { ConsentScope, ScopeDefinition } from '../../types';
import { SCOPE_DEFINITIONS } from '../../data/seedData';
import { Check, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface GranularPermissionCardProps {
  requestedScopes: ConsentScope[];
  selectedScopes: ConsentScope[];
  onChange: (scopes: ConsentScope[]) => void;
}

export const GranularPermissionCard: React.FC<GranularPermissionCardProps> = ({
  requestedScopes,
  selectedScopes,
  onChange,
}) => {
  const toggleScope = (scopeId: ConsentScope) => {
    if (selectedScopes.includes(scopeId)) {
      onChange(selectedScopes.filter((s) => s !== scopeId));
    } else {
      onChange([...selectedScopes, scopeId]);
    }
  };

  const selectAll = () => {
    onChange([...requestedScopes]);
  };

  const deselectAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Select Granular Permissions</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            You have full control to approve or withhold individual data categories.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Select All
          </button>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={deselectAll}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700"
          >
            Deselect All
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {SCOPE_DEFINITIONS.map((def: ScopeDefinition) => {
          const isRequested = requestedScopes.includes(def.id);
          const isSelected = selectedScopes.includes(def.id);

          return (
            <div
              key={def.id}
              onClick={() => toggleScope(def.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {/* Checkbox custom */}
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 transition-colors flex-shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'border-2 border-slate-300 bg-white'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{def.name}</span>
                    {isRequested && (
                      <span className="text-[10px] font-semibold uppercase bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                        Requested by App
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      def.sensitivity === 'High'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : def.sensitivity === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {def.sensitivity} Sensitivity
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{def.description}</p>

                {/* What it exposes */}
                <div className="mt-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-start gap-2">
                  {isSelected ? (
                    <Eye className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  )}
                  <span>
                    <strong className="text-slate-700">What app will receive: </strong>
                    {def.whatItExposes}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedScopes.length === 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>At least one data permission must be selected to authorize access.</span>
        </div>
      )}
    </div>
  );
};
