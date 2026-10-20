import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceRequest, RequestStatus } from '../types';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';
import { SERVICE_CATEGORIES } from '../data/categories';
import { 
  PlusCircle, 
  Search, 
  Clock, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Filter, 
  Star, 
  Printer, 
  ArrowUpRight,
  Shield,
  Layers
} from 'lucide-react';

interface CitizenPortalProps {
  onNewRequest: () => void;
  onSelectRequest: (req: ServiceRequest) => void;
  onOpenCertificate: (req: ServiceRequest) => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  onNewRequest,
  onSelectRequest,
  onOpenCertificate
}) => {
  const { currentUser, requests } = useApp();

  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter requests for current citizen (or all if demo testing)
  const myRequests = requests.filter((r) => {
    // If logged in citizen, match their requests, otherwise show all citizen demo requests
    if (currentUser?.role === 'citizen') {
      return r.citizenId === currentUser.id || r.citizenEmail === currentUser.email;
    }
    return true;
  });

  const filteredRequests = myRequests.filter((r) => {
    // Status filter
    if (filterStatus === 'active' && (r.status === 'resolved' || r.status === 'rejected')) {
      return false;
    }
    if (filterStatus === 'resolved' && r.status !== 'resolved') {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = r.id.toLowerCase().includes(q);
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchLoc = r.location.address.toLowerCase().includes(q);
      const matchCat = SERVICE_CATEGORIES[r.category]?.name.toLowerCase().includes(q);
      return matchId || matchTitle || matchLoc || matchCat;
    }

    return true;
  });

  // Citizen metrics
  const activeCount = myRequests.filter((r) => r.status === 'pending' || r.status === 'in_progress').length;
  const resolvedCount = myRequests.filter((r) => r.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Citizen Profile Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#005EA8] via-[#0b3c68] to-[#172033] rounded-3xl p-6 md:p-8 text-white shadow-xl border border-[#005EA8]/30">
        {/* Subtle decorative civic background accents */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-20 top-4 opacity-10 hidden sm:block pointer-events-none">
          <Shield className="w-48 h-48" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs px-3 py-1 rounded-full border border-white/20 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
              Verified Citizen Profile • Republic of Kenya
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Jambo, {currentUser?.name || 'Citizen'}!
            </h1>
            <p className="text-slate-100 text-xs sm:text-sm max-w-xl leading-relaxed opacity-90">
              Welcome to the CitiWatch Service Hub. Submit incident reports, track dispatch crews in real time, and verify municipal repair completion.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-200 font-mono">
              <span>National ID: <strong>{currentUser?.nationalId || '32894102'}</strong></span>
              <span>•</span>
              <span>Contact: <strong>{currentUser?.phone || '+254 712 345 678'}</strong></span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onNewRequest}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803d] text-white font-bold text-xs shadow-lg shadow-[#16A34A]/25 transition-all cursor-pointer group"
            >
              <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>Report Municipal Issue</span>
            </button>
          </div>
        </div>

        {/* Quick KPI stats strip */}
        <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-3 gap-4 text-center sm:text-left">
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15">
            <span className="text-[11px] uppercase tracking-wider text-slate-200 block font-semibold">Total Lodged</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{myRequests.length}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15">
            <span className="text-[11px] uppercase tracking-wider text-[#F59E0B] block font-semibold">Active In-Flight</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#F59E0B]">{activeCount}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15">
            <span className="text-[11px] uppercase tracking-wider text-[#86EFAC] block font-semibold">Resolved</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#86EFAC]">{resolvedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex-1 sm:flex-none ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Requests ({myRequests.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('active')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex-1 sm:flex-none ${
              filterStatus === 'active'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Active & Pending ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('resolved')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex-1 sm:flex-none ${
              filterStatus === 'resolved'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, keyword, address..."
            className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No matching service requests found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? `No service tickets match "${searchQuery}". Try a different keyword or reset filters.`
                : 'You have not submitted any service incident reports yet.'}
            </p>
            <button
              type="button"
              onClick={onNewRequest}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors mt-2"
            >
              <PlusCircle className="w-4 h-4" />
              Submit First Request
            </button>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const cat = SERVICE_CATEGORIES[req.category];
            const progressPercent =
              req.status === 'resolved'
                ? 100
                : req.status === 'in_progress'
                ? 66
                : req.status === 'rejected'
                ? 100
                : 33;

            return (
              <div
                key={req.id}
                onClick={() => onSelectRequest(req)}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#005EA8] transition-all shadow-xs hover:shadow-md cursor-pointer group text-[#172033]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${cat.accentBg} shrink-0`}>
                      <CategoryIcon category={req.category} className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#005EA8] bg-[#F0F7FC] px-2 py-0.5 rounded border border-[#005EA8]/30">
                          {req.id}
                        </span>
                        <StatusBadge status={req.status} size="sm" />
                        <PriorityBadge priority={req.priority} size="sm" />
                      </div>
                      <h3 className="text-sm font-bold text-[#172033] mt-1 group-hover:text-[#005EA8] transition-colors">
                        {req.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {req.status === 'resolved' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCertificate(req);
                        }}
                        className="p-1.5 text-xs rounded-lg text-[#16A34A] hover:bg-[#F0FDF4] border border-[#16A34A]/30 flex items-center gap-1"
                        title="Download Resolution Certificate"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span className="hidden md:inline font-semibold">Certificate</span>
                      </button>
                    )}
                    <span className="text-slate-400 group-hover:text-[#005EA8] group-hover:translate-x-1 transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                  {req.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-3 bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                    <span>Resolution Workflow</span>
                    <span className="font-mono font-bold text-[#172033]">
                      {req.status === 'pending'
                        ? 'Queued at Dispatch (33%)'
                        : req.status === 'in_progress'
                        ? 'Field Response Crew Active (66%)'
                        : req.status === 'resolved'
                        ? 'Issue Resolved (100%)'
                        : 'Closed / Rejected'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        req.status === 'resolved'
                          ? 'bg-[#16A34A]'
                          : req.status === 'in_progress'
                          ? 'bg-[#005EA8]'
                          : req.status === 'rejected'
                          ? 'bg-[#DC2626]'
                          : 'bg-[#F59E0B]'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Metadata Footnote */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-xs">{req.location.address} ({req.location.wardOrZone})</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {req.assignedOfficer && (
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">
                        Officer: {req.assignedOfficer}
                      </span>
                    )}
                    <span>
                      Lodged {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Citizen Rating Feedback Display if present */}
                {req.feedback && (
                  <div className="mt-2.5 flex items-center gap-2 text-xs bg-amber-50/60 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 p-2 rounded-lg border border-amber-200/50">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= req.feedback!.rating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="italic truncate text-[11px]">"{req.feedback.comment}"</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
