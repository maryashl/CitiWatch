import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceRequest, RequestStatus, RequestPriority, ServiceCategory } from '../types';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';
import { SERVICE_CATEGORIES, MUNICIPAL_WARDS } from '../data/categories';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowUpDown, 
  RefreshCw, 
  UserCheck, 
  Building2, 
  Eye, 
  Wrench,
  Download,
  Flame,
  Layers,
  ChevronRight,
  Printer
} from 'lucide-react';

interface AdminDashboardProps {
  onSelectRequest: (req: ServiceRequest) => void;
  onOpenCertificate: (req: ServiceRequest) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectRequest,
  onOpenCertificate
}) => {
  const { 
    requests, 
    analytics, 
    updateRequestStatus, 
    resetToDefaultData, 
    showToast 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [wardFilter, setWardFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'date' | 'priority' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
      if (priorityFilter !== 'all' && r.priority !== priorityFilter) return false;
      if (wardFilter !== 'all' && r.location.wardOrZone !== wardFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = r.id.toLowerCase().includes(q);
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchCitizen = r.citizenName.toLowerCase().includes(q) || r.citizenEmail.toLowerCase().includes(q);
        const matchLoc = r.location.address.toLowerCase().includes(q);
        const matchOfficer = r.assignedOfficer?.toLowerCase().includes(q) || false;
        return matchId || matchTitle || matchCitizen || matchLoc || matchOfficer;
      }

      return true;
    }).sort((a, b) => {
      if (sortField === 'date') {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      }
      if (sortField === 'priority') {
        const priorityWeight: Record<RequestPriority, number> = {
          urgent: 4,
          high: 3,
          medium: 2,
          low: 1
        };
        const diff = priorityWeight[b.priority] - priorityWeight[a.priority];
        return sortOrder === 'desc' ? diff : -diff;
      }
      return 0;
    });
  }, [requests, statusFilter, categoryFilter, priorityFilter, wardFilter, searchQuery, sortField, sortOrder]);

  const handleQuickStatusChange = (
    e: React.MouseEvent,
    req: ServiceRequest,
    newStatus: RequestStatus
  ) => {
    e.stopPropagation();
    updateRequestStatus(req.id, newStatus, `Quick triage transition to ${newStatus.replace('_', ' ')}.`);
  };

  const exportCSV = () => {
    const headers = ['Ticket ID', 'Status', 'Category', 'Priority', 'Citizen Name', 'Citizen Phone', 'Location', 'Ward', 'Assigned Officer', 'Created At'];
    const rows = filteredRequests.map((r) => [
      r.id,
      r.status,
      SERVICE_CATEGORIES[r.category]?.name || r.category,
      r.priority,
      `"${r.citizenName}"`,
      r.citizenPhone,
      `"${r.location.address}"`,
      `"${r.location.wardOrZone}"`,
      `"${r.assignedOfficer || 'Unassigned'}"`,
      r.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `municipal_service_requests_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported filtered service requests to CSV format.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#005EA8] text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-[#005EA8]" />
            <span>Municipal Service Desk • Administrative Command</span>
          </div>
          <h1 className="text-2xl font-bold text-[#172033]">
            Incident Triage & Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review live citizen dispatches, transition service lifecycle states, assign field engineers, and monitor municipal SLA compliance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-[#172033] hover:bg-[#F8FAFC] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={resetToDefaultData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 text-slate-600 hover:text-[#172033] transition-colors"
            title="Reset data back to initial seed dataset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* Basic Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Total Logged
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#172033]">
              {analytics.totalRequests}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">All municipal categories</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#F0F7FC] text-[#005EA8] flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Open Cases */}
        <div className="bg-white p-5 rounded-2xl border border-[#F59E0B]/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#B45309] block mb-1">
              Open Cases
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#F59E0B]">
              {analytics.openCount}
            </span>
            <span className="text-[11px] text-[#B45309]/80 block mt-1">
              {analytics.pendingCount} pending • {analytics.inProgressCount} in progress
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FFFBEB] text-[#F59E0B] flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Resolved Cases */}
        <div className="bg-white p-5 rounded-2xl border border-[#16A34A]/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#16A34A] block mb-1">
              Resolved Cases
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#16A34A]">
              {analytics.resolvedCount}
            </span>
            <span className="text-[11px] text-[#16A34A]/80 block mt-1">
              Resolution rate: <strong>{analytics.resolutionRate}%</strong>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Urgent Attention */}
        <div className="bg-white p-5 rounded-2xl border border-[#DC2626]/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#DC2626] block mb-1">
              Urgent SLA Queue
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#DC2626]">
              {analytics.urgentPending}
            </span>
            <span className="text-[11px] text-[#DC2626]/80 block mt-1">
              High / Urgent awaiting crew
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Multi-Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference #, citizen name, address, keywords..."
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Quick Clear Filter */}
          {(statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all' || wardFilter !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all');
                setCategoryFilter('all');
                setPriorityFilter('all');
                setWardFilter('all');
                setSearchQuery('');
              }}
              className="px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors whitespace-nowrap self-end lg:self-center"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Status Lifecycle
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="all">All Statuses ({requests.length})</option>
              <option value="pending">Pending ({analytics.pendingCount})</option>
              <option value="in_progress">In Progress ({analytics.inProgressCount})</option>
              <option value="resolved">Resolved ({analytics.resolvedCount})</option>
              <option value="rejected">Rejected ({analytics.rejectedCount})</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Department / Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              {(Object.keys(SERVICE_CATEGORIES) as ServiceCategory[]).map((catKey) => (
                <option key={catKey} value={catKey}>
                  {SERVICE_CATEGORIES[catKey].name} ({analytics.categoryBreakdown[catKey] || 0})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Priority Urgency
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent SLA</option>
              <option value="high">High</option>
              <option value="medium">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Ward / Sub-County
            </label>
            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="all">All Municipal Wards</option>
              {MUNICIPAL_WARDS.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Ticket Reference</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Incident Title & Location</th>
                <th className="py-3.5 px-4">Citizen Details</th>
                <th className="py-3.5 px-4">Urgency</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned Officer</th>
                <th className="py-3.5 px-4 text-right">Quick Triage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-800 dark:text-slate-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <p className="text-sm font-semibold">No service requests match the active filters.</p>
                    <p className="text-xs mt-1">Try clearing filters or search query.</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const cat = SERVICE_CATEGORIES[req.category];
                  return (
                    <tr
                      key={req.id}
                      onClick={() => onSelectRequest(req)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                    >
                      {/* Ticket Ref */}
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-700 dark:text-indigo-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{req.id}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal block font-sans">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${cat.accentBg}`}>
                            <CategoryIcon category={req.category} className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-semibold block">{cat.name.split('&')[0]}</span>
                            <span className="text-[10px] text-slate-400">{cat.slaHours}h SLA</span>
                          </div>
                        </div>
                      </td>

                      {/* Title & Location */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {req.title}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate">
                          {req.location.address} • {req.location.wardOrZone}
                        </span>
                      </td>

                      {/* Citizen */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold block text-slate-900 dark:text-white">
                          {req.citizenName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {req.citizenPhone}
                        </span>
                      </td>

                      {/* Urgency */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <PriorityBadge priority={req.priority} size="sm" />
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={req.status} size="sm" />
                      </td>

                      {/* Assigned Officer */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {req.assignedOfficer ? (
                          <div className="flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {req.assignedOfficer}
                            </span>
                          </div>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 italic text-[11px]">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {req.status === 'pending' && (
                            <button
                              type="button"
                              onClick={(e) => handleQuickStatusChange(e, req, 'in_progress')}
                              className="px-2.5 py-1 bg-[#F0F7FC] text-[#005EA8] hover:bg-[#005EA8] hover:text-white rounded-lg text-[11px] font-semibold border border-[#005EA8]/30 transition-colors cursor-pointer"
                              title="Advance to In Progress"
                            >
                              Dispatch
                            </button>
                          )}
                          {req.status === 'in_progress' && (
                            <button
                              type="button"
                              onClick={(e) => handleQuickStatusChange(e, req, 'resolved')}
                              className="px-2.5 py-1 bg-[#F0FDF4] text-[#16A34A] hover:bg-[#16A34A] hover:text-white rounded-lg text-[11px] font-semibold border border-[#16A34A]/30 transition-colors cursor-pointer"
                              title="Mark issue resolved"
                            >
                              Resolve
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onSelectRequest(req)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#005EA8] hover:bg-[#F0F7FC] transition-colors"
                            title="Inspect details & logs"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong>{filteredRequests.length}</strong> of <strong>{requests.length}</strong> service incidents
          </span>
          <span className="font-mono text-[11px]">
            Real-time County Dispatch Engine v2.4
          </span>
        </div>
      </div>
    </div>
  );
};
