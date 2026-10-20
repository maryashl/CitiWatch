import React from 'react';
import { useApp } from '../context/AppContext';
import { SERVICE_CATEGORIES, MUNICIPAL_WARDS } from '../data/categories';
import { ServiceCategory, RequestStatus } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Layers, 
  ShieldCheck,
  Building2,
  Calendar,
  Flame
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { analytics, requests } = useApp();

  // Compute ward activity
  const wardCounts: Record<string, number> = {};
  MUNICIPAL_WARDS.forEach((w) => { wardCounts[w] = 0; });
  requests.forEach((r) => {
    const w = r.location.wardOrZone;
    if (wardCounts[w] !== undefined) {
      wardCounts[w]++;
    } else {
      wardCounts[w] = 1;
    }
  });

  const sortedWards = Object.entries(wardCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4 text-indigo-600" />
          <span>Municipal Performance Metrics & Civic Transparency</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Public Service Request Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Real-time analysis of citizen incident submissions, county response velocity, resolution rates, and department workload distribution.
        </p>
      </div>

      {/* Hero Open vs Resolved Comparison Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Open Cases vs. Resolved Cases
            </h3>
            <p className="text-xs text-slate-500">
              Primary indicator of municipal throughput and maintenance velocity.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-slate-700 dark:text-slate-300">Open ({analytics.openCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-700 dark:text-slate-300">Resolved ({analytics.resolvedCount})</span>
            </div>
            {analytics.rejectedCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="text-slate-700 dark:text-slate-300">Closed/Rejected ({analytics.rejectedCount})</span>
              </div>
            )}
          </div>
        </div>

        {/* Visual segmented comparison bar */}
        <div className="w-full h-7 rounded-xl bg-slate-100 overflow-hidden flex shadow-inner">
          {analytics.totalRequests > 0 ? (
            <>
              <div
                style={{ width: `${(analytics.openCount / analytics.totalRequests) * 100}%` }}
                className="bg-[#F59E0B] hover:opacity-90 transition-all flex items-center justify-center text-white text-[11px] font-bold"
                title={`Open: ${analytics.openCount} (${Math.round((analytics.openCount / analytics.totalRequests) * 100)}%)`}
              >
                {analytics.openCount > 0 && `${Math.round((analytics.openCount / analytics.totalRequests) * 100)}%`}
              </div>
              <div
                style={{ width: `${(analytics.resolvedCount / analytics.totalRequests) * 100}%` }}
                className="bg-[#16A34A] hover:opacity-90 transition-all flex items-center justify-center text-white text-[11px] font-bold"
                title={`Resolved: ${analytics.resolvedCount} (${Math.round((analytics.resolvedCount / analytics.totalRequests) * 100)}%)`}
              >
                {analytics.resolvedCount > 0 && `${Math.round((analytics.resolvedCount / analytics.totalRequests) * 100)}%`}
              </div>
              {analytics.rejectedCount > 0 && (
                <div
                  style={{ width: `${(analytics.rejectedCount / analytics.totalRequests) * 100}%` }}
                  className="bg-[#DC2626] hover:opacity-90 transition-all flex items-center justify-center text-white text-[11px] font-bold"
                  title={`Rejected: ${analytics.rejectedCount}`}
                >
                  {analytics.rejectedCount}
                </div>
              )}
            </>
          ) : (
            <div className="w-full text-center text-xs text-slate-400 py-1.5">No requests recorded</div>
          )}
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
              Resolution Efficiency
            </span>
            <span className="text-2xl font-extrabold font-mono text-[#16A34A]">
              {analytics.resolutionRate}%
            </span>
            <span className="text-[11px] text-slate-400 block">Total cases solved</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
              Avg Turnaround Time
            </span>
            <span className="text-2xl font-extrabold font-mono text-[#005EA8]">
              {analytics.avgResolutionDays} <span className="text-sm font-sans font-semibold">Days</span>
            </span>
            <span className="text-[11px] text-slate-400 block">From report to verification</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
              Pending in Dispatch
            </span>
            <span className="text-2xl font-extrabold font-mono text-[#F59E0B]">
              {analytics.pendingCount}
            </span>
            <span className="text-[11px] text-slate-400 block">Awaiting engineer crew</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
              In-Field Active Crews
            </span>
            <span className="text-2xl font-extrabold font-mono text-[#005EA8]">
              {analytics.inProgressCount}
            </span>
            <span className="text-[11px] text-slate-400 block">Actively under repair</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Categories & Urgencies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Incident Distribution by Category
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {analytics.totalRequests} total
            </span>
          </div>

          <div className="space-y-3.5">
            {(Object.keys(SERVICE_CATEGORIES) as ServiceCategory[]).map((catKey) => {
              const cat = SERVICE_CATEGORIES[catKey];
              const count = analytics.categoryBreakdown[catKey] || 0;
              const percent = analytics.totalRequests > 0 ? Math.round((count / analytics.totalRequests) * 100) : 0;

              return (
                <div key={catKey} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                      <div className={`p-1 rounded-md ${cat.accentBg}`}>
                        <CategoryIcon category={catKey} className="w-3.5 h-3.5" />
                      </div>
                      <span>{cat.name}</span>
                    </div>
                    <span className="font-mono text-slate-600 dark:text-slate-400 font-semibold">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority & Urgency Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-600" />
              Incident Severity & Urgency Tiers
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Priority Ranking
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              {
                id: 'urgent',
                label: 'Critical / Urgent',
                desc: '24h Max SLA Guarantee',
                count: analytics.priorityBreakdown['urgent'] || 0,
                color: 'text-rose-600 dark:text-rose-400',
                border: 'border-rose-200 dark:border-rose-900',
                bg: 'bg-rose-50/60 dark:bg-rose-950/30'
              },
              {
                id: 'high',
                label: 'High Priority',
                desc: 'Disruptive Hazards',
                count: analytics.priorityBreakdown['high'] || 0,
                color: 'text-orange-600 dark:text-orange-400',
                border: 'border-orange-200 dark:border-orange-900',
                bg: 'bg-orange-50/60 dark:bg-orange-950/30'
              },
              {
                id: 'medium',
                label: 'Normal Priority',
                desc: 'Routine Service Charter',
                count: analytics.priorityBreakdown['medium'] || 0,
                color: 'text-indigo-600 dark:text-indigo-400',
                border: 'border-indigo-200 dark:border-indigo-900',
                bg: 'bg-indigo-50/60 dark:bg-indigo-950/30'
              },
              {
                id: 'low',
                label: 'Low Priority',
                desc: 'Minor Cosmetic Works',
                count: analytics.priorityBreakdown['low'] || 0,
                color: 'text-slate-600 dark:text-slate-400',
                border: 'border-slate-200 dark:border-slate-800',
                bg: 'bg-slate-50 dark:bg-slate-800/40'
              }
            ].map((p) => (
              <div
                key={p.id}
                className={`p-4 rounded-xl border ${p.border} ${p.bg} flex flex-col justify-between`}
              >
                <div>
                  <span className={`text-2xl font-bold font-mono ${p.color}`}>
                    {p.count}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1">
                    {p.label}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-2 block">
                  {p.desc}
                </span>
              </div>
            ))}
          </div>

          {/* SLA Performance Callout */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-3">
            <Award className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-slate-700 dark:text-slate-300">
              <strong>County Service Charter Compliance:</strong> 94.2% of issues acknowledged within 4 business hours.
            </div>
          </div>
        </div>
      </div>

      {/* Ward Activity Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-600" />
          Municipal Ward & Sub-County Breakdown
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sortedWards.map(([wardName, count]) => (
            <div
              key={wardName}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
            >
              <span className="font-medium text-slate-700 dark:text-slate-300 truncate mr-2">
                {wardName}
              </span>
              <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 shrink-0">
                {count} {count === 1 ? 'case' : 'cases'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
