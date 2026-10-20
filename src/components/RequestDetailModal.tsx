import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceRequest, RequestStatus } from '../types';
import { SERVICE_CATEGORIES } from '../data/categories';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';
import { TimelineView } from './TimelineView';
import { 
  X, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  ShieldCheck, 
  Star, 
  CheckCircle, 
  Printer, 
  Edit3, 
  Camera, 
  Clock, 
  Trash2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface RequestDetailModalProps {
  request: ServiceRequest | null;
  onClose: () => void;
  onOpenCertificate?: (req: ServiceRequest) => void;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  request,
  onClose,
  onOpenCertificate
}) => {
  const { 
    currentUser, 
    updateRequestStatus, 
    submitCitizenFeedback, 
    deleteRequest, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'admin_action'>('details');
  
  // Admin Action States
  const [adminStatus, setAdminStatus] = useState<RequestStatus>(request?.status || 'pending');
  const [adminComment, setAdminComment] = useState('');
  const [adminOfficer, setAdminOfficer] = useState(request?.assignedOfficer || '');
  const [internalNotes, setInternalNotes] = useState(request?.internalNotes || '');
  const [resolutionNotes, setResolutionNotes] = useState(request?.resolutionNotes || '');
  const [resolutionImageUrl, setResolutionImageUrl] = useState(request?.resolutionImageUrl || '');
  
  // Citizen Feedback States
  const [rating, setRating] = useState(request?.feedback?.rating || 5);
  const [feedbackComment, setFeedbackComment] = useState(request?.feedback?.comment || '');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  if (!request) return null;

  const categoryDef = SERVICE_CATEGORIES[request.category];
  const isAdmin = currentUser?.role === 'admin';
  const isOwner = currentUser?.id === request.citizenId;

  const handleAdminUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateRequestStatus(request.id, adminStatus, adminComment || `Status set to ${adminStatus.replace('_', ' ')}.`, {
      assignedOfficer: adminOfficer.trim() || undefined,
      internalNotes: internalNotes.trim() || undefined,
      resolutionNotes: resolutionNotes.trim() || undefined,
      resolutionImageUrl: resolutionImageUrl.trim() || undefined
    });
    setActiveTab('details');
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) {
      showToast('Please leave a brief comment with your rating.', 'warning');
      return;
    }
    setIsSubmittingFeedback(true);
    try {
      submitCitizenFeedback(request.id, rating, feedbackComment.trim());
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete ticket ${request.id}?`)) {
      deleteRequest(request.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${categoryDef.accentBg} shrink-0`}>
              <CategoryIcon category={request.category} className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                  {request.id}
                </span>
                <StatusBadge status={request.status} size="sm" />
                <PriorityBadge priority={request.priority} size="sm" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">
                {request.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {request.status === 'resolved' && onOpenCertificate && (
              <button
                type="button"
                onClick={() => onOpenCertificate(request)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                title="View Resolution Certificate"
              >
                <Printer className="w-3.5 h-3.5" />
                Official Certificate
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-white dark:bg-slate-900 text-xs font-semibold gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'details'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Incident Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Audit Trail & Timeline</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {request.timeline.length}
            </span>
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setActiveTab('admin_action')}
              className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'admin_action'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-indigo-600/80 hover:text-indigo-700'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Admin Triage & Dispatch Desk</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Description */}
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Incident Description
                </h3>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {request.description}
                </p>
              </div>

              {/* Photos comparison (Reported vs Resolution) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {request.imageUrl && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" /> Citizen Field Evidence
                    </span>
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 h-48">
                      <img
                        src={request.imageUrl}
                        alt="Citizen reported issue"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  </div>
                )}

                {request.resolutionImageUrl && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Municipal Post-Repair Verification
                    </span>
                    <div className="rounded-xl overflow-hidden border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 h-48">
                      <img
                        src={request.resolutionImageUrl}
                        alt="Resolution completed"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location & Agency */}
                <div className="bg-white dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Location & Agency Assignment
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block text-slate-900 dark:text-white">
                          {request.location.address}
                        </span>
                        <span className="text-slate-500">
                          Ward/Subcounty: <strong>{request.location.wardOrZone}</strong>
                        </span>
                        {request.location.landmark && (
                          <span className="block text-slate-500">
                            Landmark: {request.location.landmark}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <Building2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block text-slate-900 dark:text-white">
                          {request.assignedDepartment || categoryDef.department}
                        </span>
                        <span className="text-slate-500">
                          Assigned Officer:{' '}
                          <strong className="text-slate-700 dark:text-slate-300">
                            {request.assignedOfficer || 'Pending Field Officer Allocation'}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Citizen Information & SLA */}
                <div className="bg-white dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Citizen & Service Charter SLA
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {request.citizenName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-slate-600 dark:text-slate-400 font-mono">
                        {request.citizenPhone}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-slate-600 dark:text-slate-400 font-mono">
                        {request.citizenEmail}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-500 block">
                          Reported: {new Date(request.createdAt).toLocaleString()}
                        </span>
                        {request.resolvedAt && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold block">
                            Resolved: {new Date(request.resolvedAt).toLocaleString()}
                          </span>
                        )}
                        <span className="text-slate-500 block">
                          SLA Guarantee: {categoryDef.slaHours} hours response
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resolution Notes if Resolved */}
              {request.resolutionNotes && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider mb-1">
                    <CheckCircle className="w-4 h-4" />
                    Official Resolution Report
                  </div>
                  <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                    {request.resolutionNotes}
                  </p>
                </div>
              )}

              {/* Internal Notes (Admin only) */}
              {isAdmin && request.internalNotes && (
                <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-800 text-xs">
                  <span className="font-bold text-amber-900 dark:text-amber-300 block mb-1">
                    Internal Dispatch & Engineering Note (Staff Only):
                  </span>
                  <p className="text-amber-800 dark:text-amber-200 font-mono">
                    {request.internalNotes}
                  </p>
                </div>
              )}

              {/* Citizen Feedback Section */}
              {request.status === 'resolved' && (
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      Citizen Satisfaction Review
                    </h4>
                  </div>

                  {request.feedback ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= request.feedback!.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 ml-2">
                          {request.feedback.rating} / 5 Stars
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                        "{request.feedback.comment}"
                      </p>
                      <span className="text-[10px] text-slate-400 block">
                        Reviewed on {new Date(request.feedback.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ) : isOwner ? (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        This issue has been resolved! How satisfied are you with the municipal response speed and quality?
                      </p>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setRating(s)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                s <= rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-2">
                          {rating} Stars
                        </span>
                      </div>
                      <textarea
                        required
                        rows={2}
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        placeholder="Add your comments or appreciation for the service crew..."
                        className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      ></textarea>
                      <button
                        type="submit"
                        disabled={isSubmittingFeedback}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                      >
                        Submit Citizen Rating
                      </button>
                    </form>
                  ) : (
                    <span className="text-xs text-slate-500 italic">
                      Awaiting citizen satisfaction rating.
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <TimelineView
              currentStatus={request.status}
              timeline={request.timeline}
              showInternalLogs={isAdmin}
            />
          )}

          {activeTab === 'admin_action' && isAdmin && (
            <form onSubmit={handleAdminUpdate} className="space-y-5">
              <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                    Authorized Officer Triage Mode
                  </h4>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                    Modifying ticket #{request.id}. Updates immediately reflect on the citizen's tracker.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Incident
                </button>
              </div>

              {/* Status Transition Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Update Service Status <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['pending', 'in_progress', 'resolved', 'rejected'] as RequestStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAdminStatus(st)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        adminStatus === st
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 ring-2 ring-indigo-600 font-bold text-indigo-900 dark:text-indigo-200'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span className="capitalize text-xs block">
                        {st.replace('_', ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Assign Officer & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Field Officer
                  </label>
                  <input
                    type="text"
                    value={adminOfficer}
                    onChange={(e) => setAdminOfficer(e.target.value)}
                    placeholder="e.g. Officer Peter Maina (Team 3)"
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Timeline Update Note (Visible to Citizen)
                  </label>
                  <input
                    type="text"
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    placeholder="e.g. Excavator on site; welding replacement pipe."
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Internal Engineering & Dispatch Log (Staff Only)
                </label>
                <textarea
                  rows={2}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Material parts requisitioned, contractor voucher number, supervisor signoff..."
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                ></textarea>
              </div>

              {/* Resolution details if marking resolved */}
              {adminStatus === 'resolved' && (
                <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-3">
                  <h5 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    Resolution Closure Documentation
                  </h5>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-900 dark:text-emerald-300 mb-1">
                      Official Resolution Summary
                    </label>
                    <textarea
                      rows={2}
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="e.g. High-pressure pipe repaired, backfilled, and asphalt restored. Tested pressure 3.2 bar."
                      className="w-full text-xs rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-900 dark:text-emerald-300 mb-1">
                      Post-Repair Photo URL (Verification)
                    </label>
                    <input
                      type="url"
                      value={resolutionImageUrl}
                      onChange={(e) => setResolutionImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full text-xs rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20"
                >
                  Commit Status & Workflow Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500">
          <span>Official Public Service Commission Record</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-medium hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
