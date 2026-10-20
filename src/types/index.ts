export type UserRole = 'citizen' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationalId?: string;
  password?: string;
  ward?: string;
  role: UserRole;
  department?: string; // For admin officers
  joinedDate: string;
}

export type ServiceCategory = 
  | 'streetlights'
  | 'water'
  | 'garbage'
  | 'roads'
  | 'parks'
  | 'health';

export interface CategoryInfo {
  id: ServiceCategory;
  name: string;
  department: string;
  description: string;
  iconName: string;
  slaHours: number;
  color: string;
  accentBg: string;
  badgeBorder: string;
}

export type RequestPriority = 'low' | 'medium' | 'high' | 'urgent';

export type RequestStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';

export interface TimelineEvent {
  id: string;
  status: RequestStatus;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  actorRole: 'system' | 'citizen' | 'admin';
  internalOnly?: boolean;
}

export interface CitizenFeedback {
  rating: number; // 1 to 5
  comment: string;
  submittedAt: string;
}

export interface ServiceRequest {
  id: string; // e.g. "REQ-2026-8942"
  citizenId: string;
  citizenName: string;
  citizenEmail: string;
  citizenPhone: string;
  category: ServiceCategory;
  title: string;
  description: string;
  location: {
    address: string;
    wardOrZone: string;
    landmark?: string;
    lat?: number;
    lng?: number;
  };
  priority: RequestPriority;
  status: RequestStatus;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  estimatedResolutionDate?: string;
  assignedOfficer?: string;
  assignedDepartment?: string;
  internalNotes?: string;
  resolutionNotes?: string;
  resolutionImageUrl?: string;
  resolvedAt?: string;
  timeline: TimelineEvent[];
  feedback?: CitizenFeedback;
}

export interface AnalyticsSummary {
  totalRequests: number;
  pendingCount: number;
  inProgressCount: number;
  resolvedCount: number;
  rejectedCount: number;
  openCount: number; // pending + in_progress
  resolutionRate: number; // percentage
  urgentPending: number;
  avgResolutionDays: number;
  categoryBreakdown: Record<ServiceCategory, number>;
  statusBreakdown: Record<RequestStatus, number>;
  priorityBreakdown: Record<RequestPriority, number>;
}
