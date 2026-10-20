import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceRequest } from '../types';
import { SERVICE_CATEGORIES } from '../data/categories';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';
import { TimelineView } from './TimelineView';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Building2, 
  Printer, 
  CheckCircle, 
  ArrowRight,
  Shield,
  HelpCircle,
  FileCheck
} from 'lucide-react';

interface PublicTrackerProps {
  onOpenCertificate: (req: ServiceRequest) => void;
  initialCode?: string;
}

export const PublicTracker: React.FC<PublicTrackerProps> = ({ onOpenCertificate, initialCode = '' }) => {
  const { requests } = useApp();
  const [trackingCode, setTrackingCode] = useState(initialCode);
  const [matchedRequest, setMatchedRequest] = useState<ServiceRequest | null>(() => {
    if (initialCode) {
      return requests.find((r) => r.id.toLowerCase() === initialCode.toLowerCase()) || null;
    }
    return requests[0] || null; // default to first request so page immediately has rich content
  });
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const clean = trackingCode.trim().toLowerCase();
    const found = requests.find((r) => r.id.toLowerCase() === clean);
    setMatchedRequest(found || null);
  };

  const handleSampleClick = (code: string) => {
    setTrackingCode(code);
    const found = requests.find((r) => r.id.toLowerCase() === code.toLowerCase());
    setMatchedRequest(found || null);
    setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0F7FC] border border-[#005EA8]/20 text-[#005EA8] text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>eCitizen CitiWatch Public Tracking Counter</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033]">
          Track Municipal Service Request Status
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Enter your official tracking code (e.g., <code className="font-mono font-bold text-[#005EA8]">REQ-2026-1042</code>) to view live field crew status, dispatch logs, and resolution confirmation.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="Enter Ticket ID (e.g. REQ-2026-1042)"
              className="w-full text-sm rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 font-mono font-medium text-[#172033] focus:ring-2 focus:ring-[#005EA8] focus:border-[#005EA8] focus:outline-hidden shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#005EA8] hover:bg-[#004d8c] text-white rounded-xl text-xs font-bold shadow-md shadow-[#005EA8]/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Track</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick sample chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 text-[11px]">Try sample ticket:</span>
          {requests.slice(0, 4).map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => handleSampleClick(r.id)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-mono font-semibold text-[#172033] hover:border-[#005EA8] hover:text-[#005EA8] cursor-pointer transition-colors shadow-xs"
            >
              {r.id} ({r.status.replace('_', ' ')})
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {matchedRequest ? (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-8 space-y-6 animate-in fade-in duration-200">
          {/* Card Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${SERVICE_CATEGORIES[matchedRequest.category].accentBg} shrink-0`}>
                <CategoryIcon category={matchedRequest.category} className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#005EA8] bg-[#F0F7FC] px-2.5 py-0.5 rounded border border-[#005EA8]/30">
                    {matchedRequest.id}
                  </span>
                  <StatusBadge status={matchedRequest.status} size="sm" />
                  <PriorityBadge priority={matchedRequest.priority} size="sm" />
                </div>
                <h2 className="text-lg font-bold text-[#172033] mt-1">
                  {matchedRequest.title}
                </h2>
              </div>
            </div>

            {matchedRequest.status === 'resolved' && (
              <button
                type="button"
                onClick={() => onOpenCertificate(matchedRequest)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A]/30 hover:bg-[#dcfce7] text-xs font-semibold transition-colors self-start sm:self-center cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                View Resolution Certificate
              </button>
            )}
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-slate-200">
              <span className="text-slate-500 block mb-1">Target Department</span>
              <span className="font-semibold text-[#172033]">
                {matchedRequest.assignedDepartment || SERVICE_CATEGORIES[matchedRequest.category].department}
              </span>
            </div>

            <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-slate-200">
              <span className="text-slate-500 block mb-1">Location & Ward</span>
              <span className="font-semibold text-[#172033] block truncate">
                {matchedRequest.location.address}
              </span>
              <span className="text-slate-500">{matchedRequest.location.wardOrZone}</span>
            </div>

            <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-slate-200">
              <span className="text-slate-500 block mb-1">Response Velocity</span>
              <span className="font-semibold text-[#172033] block">
                {matchedRequest.assignedOfficer ? `Assigned to ${matchedRequest.assignedOfficer}` : 'Pending Officer Assignment'}
              </span>
              <span className="text-slate-500">Lodged: {new Date(matchedRequest.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 text-xs text-[#172033]">
            <strong className="block text-[#172033] mb-1 font-bold">Incident Summary:</strong>
            {matchedRequest.description}
          </div>

          {/* Interactive Stepper & Audit Trail */}
          <TimelineView
            currentStatus={matchedRequest.status}
            timeline={matchedRequest.timeline}
            showInternalLogs={false}
          />
        </div>
      ) : hasSearched ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#172033]">
            Reference code not found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Could not find an incident matching "{trackingCode}". Please verify your ticket reference number or click one of the sample tickets above.
          </p>
        </div>
      ) : null}
    </div>
  );
};
