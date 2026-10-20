import React from 'react';
import { RequestStatus, RequestPriority } from '../types';
import { Clock, CheckCircle2, AlertCircle, XCircle, Flame, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: RequestStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide',
    lg: 'text-sm px-3.5 py-1.5 font-bold tracking-wide'
  };

  switch (status) {
    case 'pending':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#F59E0B]/40 ${sizeClasses[size]}`}>
          <Clock className="w-3.5 h-3.5 text-[#F59E0B] animate-pulse" />
          Pending Triage
        </span>
      );
    case 'in_progress':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-[#F0F7FC] text-[#005EA8] border border-[#005EA8]/30 ${sizeClasses[size]}`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#005EA8] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#005EA8]"></span>
          </span>
          In Progress
        </span>
      );
    case 'resolved':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A]/30 ${sizeClasses[size]}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
          Resolved
        </span>
      );
    case 'rejected':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/30 ${sizeClasses[size]}`}>
          <XCircle className="w-3.5 h-3.5 text-[#DC2626]" />
          Rejected / Closed
        </span>
      );
    default:
      return null;
  }
};

interface PriorityBadgeProps {
  priority: RequestPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5'
  };

  switch (priority) {
    case 'urgent':
      return (
        <span className={`inline-flex items-center gap-1 rounded font-bold uppercase tracking-wider bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/40 ${sizeClasses[size]}`}>
          <Flame className="w-3 h-3 text-[#DC2626] animate-bounce" />
          Urgent SLA
        </span>
      );
    case 'high':
      return (
        <span className={`inline-flex items-center gap-1 rounded font-semibold uppercase tracking-wider bg-[#FFFBEB] text-[#D97706] border border-[#F59E0B]/40 ${sizeClasses[size]}`}>
          <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
          High
        </span>
      );
    case 'medium':
      return (
        <span className={`inline-flex items-center gap-1 rounded font-medium bg-[#F1F5F9] text-[#172033] border border-slate-300 ${sizeClasses[size]}`}>
          Normal
        </span>
      );
    case 'low':
      return (
        <span className={`inline-flex items-center gap-1 rounded font-medium bg-slate-50 text-slate-600 border border-slate-200 ${sizeClasses[size]}`}>
          Low
        </span>
      );
    default:
      return null;
  }
};
