import React from 'react';
import { TimelineEvent, RequestStatus } from '../types';
import { CheckCircle2, Clock, Wrench, XCircle, User, ShieldCheck } from 'lucide-react';

interface TimelineViewProps {
  currentStatus: RequestStatus;
  timeline: TimelineEvent[];
  showInternalLogs?: boolean;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ currentStatus, timeline, showInternalLogs = false }) => {
  // Filter events if needed
  const visibleEvents = timeline.filter((e) => showInternalLogs || !e.internalOnly);

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'in_progress':
        return <Wrench className="w-4 h-4 text-blue-600" />;
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStepCircleColor = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 border-amber-500 text-amber-700';
      case 'in_progress':
        return 'bg-blue-100 border-blue-500 text-blue-700';
      case 'resolved':
        return 'bg-emerald-100 border-emerald-500 text-emerald-700';
      case 'rejected':
        return 'bg-rose-100 border-rose-500 text-rose-700';
      default:
        return 'bg-slate-100 border-slate-400 text-slate-600';
    }
  };

  // High level 3-stage progression bar
  const stages: { label: string; key: RequestStatus; reached: boolean; active: boolean }[] = [
    {
      label: '1. Lodged & Queued',
      key: 'pending',
      reached: true,
      active: currentStatus === 'pending'
    },
    {
      label: '2. In Progress / Field Crew',
      key: 'in_progress',
      reached: currentStatus === 'in_progress' || currentStatus === 'resolved',
      active: currentStatus === 'in_progress'
    },
    {
      label: currentStatus === 'rejected' ? '3. Rejected / Closed' : '3. Resolved & Verified',
      key: currentStatus === 'rejected' ? 'rejected' : 'resolved',
      reached: currentStatus === 'resolved' || currentStatus === 'rejected',
      active: currentStatus === 'resolved' || currentStatus === 'rejected'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Visual Stepper */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Service Request Lifecycle
        </div>
        <div className="grid grid-cols-3 gap-2 relative">
          {stages.map((stage, idx) => (
            <div key={stage.label} className="flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 mb-1.5 transition-all ${
                  stage.active
                    ? 'border-indigo-600 bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-900/50 shadow-sm'
                    : stage.reached
                    ? 'border-emerald-600 bg-emerald-500 text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400'
                }`}
              >
                {stage.reached && !stage.active ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  idx + 1
                )}
              </div>
              <span
                className={`text-xs font-medium ${
                  stage.active
                    ? 'text-indigo-900 dark:text-indigo-300 font-bold'
                    : stage.reached
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {stage.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Chronological History */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Official Audit Trail & Activity Logs
        </h4>
        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 pl-5 space-y-6">
          {visibleEvents.map((event) => (
            <div key={event.id} className="relative group">
              {/* Event node */}
              <div
                className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-xs bg-white dark:bg-slate-900 ${getStepCircleColor(
                  event.status
                )}`}
              >
                {getStatusIcon(event.status)}
              </div>

              {/* Event card */}
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {event.title}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {new Date(event.timestamp).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                  {event.description}
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                  {event.actorRole === 'admin' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>
                    Logged by <strong className="font-semibold text-slate-700 dark:text-slate-300">{event.actor}</strong>
                    {event.actorRole === 'admin' && ' (Municipal Officer)'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
