import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { User, ServiceRequest, RequestStatus, AnalyticsSummary, ServiceCategory, RequestPriority, TimelineEvent } from '../types';
import { SEED_USERS, SEED_REQUESTS } from '../data/seedData';
import { SERVICE_CATEGORIES } from '../data/categories';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  requests: ServiceRequest[];
  analytics: AnalyticsSummary;
  toasts: Toast[];
  login: (identifier: string, password?: string, role?: 'citizen' | 'admin') => { success: boolean; message?: string };
  register: (userData: { name: string; email: string; phone: string; nationalId?: string; password?: string; ward?: string; role: 'citizen' | 'admin'; department?: string }) => { success: boolean; message?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  createRequest: (newReq: {
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
    imageUrl?: string;
  }) => ServiceRequest;
  updateRequestStatus: (
    id: string,
    newStatus: RequestStatus,
    comment: string,
    additional?: {
      assignedOfficer?: string;
      assignedDepartment?: string;
      internalNotes?: string;
      resolutionNotes?: string;
      resolutionImageUrl?: string;
    }
  ) => void;
  assignOfficer: (id: string, officerName: string, department: string, notes?: string) => void;
  submitCitizenFeedback: (id: string, rating: number, comment: string) => void;
  deleteRequest: (id: string) => void;
  resetToDefaultData: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_USERS = 'ecitizen_users_v1';
const STORAGE_KEY_REQUESTS = 'ecitizen_requests_v1';
const STORAGE_KEY_CURRENT_USER = 'ecitizen_current_user_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load users
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS);
      return stored ? JSON.parse(stored) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  });

  // Load current user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (stored) return JSON.parse(stored);
      // Default to Ashley Anyango for immediate smooth exploration
      return SEED_USERS[0];
    } catch {
      return SEED_USERS[0];
    }
  });

  // Load requests
  const [requests, setRequests] = useState<ServiceRequest[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REQUESTS);
      return stored ? JSON.parse(stored) : SEED_REQUESTS;
    } catch {
      return SEED_REQUESTS;
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (e) {
      console.warn('LocalStorage save users failed', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
      }
    } catch (e) {
      console.warn('LocalStorage save current user failed', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
    } catch (e) {
      console.warn('LocalStorage save requests failed', e);
    }
  }, [requests]);

  // Auth methods
  const login = (identifier: string, password?: string, role?: 'citizen' | 'admin') => {
    const clean = identifier.trim().toLowerCase();
    
    // Match either by email or national ID
    const found = users.find((u) => {
      const emailMatches = u.email.toLowerCase() === clean;
      const idMatches = u.nationalId && u.nationalId.toLowerCase() === clean;
      const roleMatches = !role || u.role === role;
      return (emailMatches || idMatches) && roleMatches;
    });
    
    if (found) {
      // If a password was provided and user has a configured password, verify it
      if (password && found.password && found.password !== password) {
        return {
          success: false,
          message: 'Incorrect password. Please verify your credentials or use the demo login options.'
        };
      }

      setCurrentUser(found);
      showToast(`Welcome back, ${found.name}! Signed in as ${found.role === 'admin' ? 'Municipal Admin' : 'Verified Citizen'}.`, 'success');
      return { success: true };
    }

    return { 
      success: false, 
      message: 'No account found matching this National ID or Email. Please check your spelling or register a new account.' 
    };
  };

  const register = (userData: { 
    name: string; 
    email: string; 
    phone: string; 
    nationalId?: string; 
    password?: string;
    ward?: string;
    role: 'citizen' | 'admin';
    department?: string;
  }) => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    if (userData.nationalId) {
      const cleanId = userData.nationalId.trim();
      const existingId = users.find((u) => u.nationalId && u.nationalId.trim() === cleanId);
      if (existingId) {
        return { success: false, message: 'An account with this National ID already exists.' };
      }
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name.trim(),
      email: cleanEmail,
      phone: userData.phone.trim(),
      nationalId: userData.nationalId?.trim() || `${Math.floor(10000000 + Math.random() * 90000000)}`,
      password: userData.password?.trim() || 'citizen123',
      ward: userData.ward,
      role: userData.role,
      department: userData.department,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Account successfully registered! Welcome to CitiWatch, ${newUser.name}.`, 'success');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('You have been signed out successfully.', 'info');
  };

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      showToast(`Switched active profile to: ${target.name} (${target.role})`, 'info');
    }
  };

  // Service Request Creation
  const createRequest = (newReq: {
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
    imageUrl?: string;
  }): ServiceRequest => {
    const currentCitizen = currentUser || {
      id: 'guest-citizen',
      name: 'Anonymous Citizen',
      email: 'citizen@ecitizen.gov.ke',
      phone: '+254 700 000 000',
      role: 'citizen' as const,
      joinedDate: new Date().toISOString()
    };

    const categoryDef = SERVICE_CATEGORIES[newReq.category];
    const serial = Math.floor(1000 + Math.random() * 9000);
    const newId = `REQ-2026-${serial}`;
    const now = new Date().toISOString();

    const estDays = Math.ceil(categoryDef.slaHours / 24);
    const estDate = new Date(Date.now() + estDays * 24 * 60 * 60 * 1000).toISOString();

    const initialTimeline: TimelineEvent = {
      id: `tl-${Date.now()}`,
      status: 'pending',
      title: 'Request Lodged & Queued',
      description: 'Request submitted via CitiWatch digital counter. Sent to municipal dispatch pool.',
      timestamp: now,
      actor: currentCitizen.name,
      actorRole: 'citizen'
    };

    const requestItem: ServiceRequest = {
      id: newId,
      citizenId: currentCitizen.id,
      citizenName: currentCitizen.name,
      citizenEmail: currentCitizen.email,
      citizenPhone: currentCitizen.phone,
      category: newReq.category,
      title: newReq.title.trim(),
      description: newReq.description.trim(),
      location: newReq.location,
      priority: newReq.priority,
      status: 'pending',
      imageUrl: newReq.imageUrl,
      createdAt: now,
      updatedAt: now,
      estimatedResolutionDate: estDate,
      assignedDepartment: categoryDef.department,
      timeline: [initialTimeline]
    };

    setRequests((prev) => [requestItem, ...prev]);
    showToast(`Service Request #${newId} submitted successfully! Your tracking code is ${newId}.`, 'success');
    return requestItem;
  };

  // Update request status
  const updateRequestStatus = (
    id: string,
    newStatus: RequestStatus,
    comment: string,
    additional?: {
      assignedOfficer?: string;
      assignedDepartment?: string;
      internalNotes?: string;
      resolutionNotes?: string;
      resolutionImageUrl?: string;
    }
  ) => {
    const now = new Date().toISOString();
    const actorName = currentUser?.name || 'Municipal Admin';

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req;

        const statusTitles: Record<RequestStatus, string> = {
          pending: 'Status Reverted to Pending',
          in_progress: 'Ticket Advanced to In Progress',
          resolved: 'Issue Verified & Marked Resolved',
          rejected: 'Request Rejected / Closed'
        };

        const newTimelineEvent: TimelineEvent = {
          id: `tl-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          status: newStatus,
          title: statusTitles[newStatus],
          description: comment || `Status updated to ${newStatus.replace('_', ' ')} by ${actorName}.`,
          timestamp: now,
          actor: actorName,
          actorRole: 'admin'
        };

        return {
          ...req,
          status: newStatus,
          updatedAt: now,
          assignedOfficer: additional?.assignedOfficer ?? req.assignedOfficer,
          assignedDepartment: additional?.assignedDepartment ?? req.assignedDepartment,
          internalNotes: additional?.internalNotes !== undefined ? additional.internalNotes : req.internalNotes,
          resolutionNotes: additional?.resolutionNotes !== undefined ? additional.resolutionNotes : req.resolutionNotes,
          resolutionImageUrl: additional?.resolutionImageUrl ?? req.resolutionImageUrl,
          resolvedAt: newStatus === 'resolved' ? (req.resolvedAt || now) : (newStatus === 'rejected' ? undefined : req.resolvedAt),
          timeline: [...req.timeline, newTimelineEvent]
        };
      })
    );

    showToast(`Request #${id} status updated to: ${newStatus.toUpperCase().replace('_', ' ')}`, 'success');
  };

  // Assign officer
  const assignOfficer = (id: string, officerName: string, department: string, notes?: string) => {
    const now = new Date().toISOString();
    const actorName = currentUser?.name || 'Dispatch Coordinator';

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req;

        const newTimelineEvent: TimelineEvent = {
          id: `tl-${Date.now()}`,
          status: req.status === 'pending' ? 'in_progress' : req.status,
          title: `Assigned to ${officerName}`,
          description: `Assigned to ${officerName} (${department}). ${notes ? `Note: ${notes}` : ''}`,
          timestamp: now,
          actor: actorName,
          actorRole: 'admin'
        };

        return {
          ...req,
          assignedOfficer: officerName,
          assignedDepartment: department,
          status: req.status === 'pending' ? 'in_progress' : req.status,
          updatedAt: now,
          timeline: [...req.timeline, newTimelineEvent]
        };
      })
    );

    showToast(`Officer ${officerName} assigned to #${id}. Status set to IN PROGRESS.`, 'info');
  };

  // Citizen feedback
  const submitCitizenFeedback = (id: string, rating: number, comment: string) => {
    const now = new Date().toISOString();

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req;

        return {
          ...req,
          feedback: {
            rating,
            comment,
            submittedAt: now
          }
        };
      })
    );

    showToast('Thank you for rating our municipal service! Your feedback has been recorded.', 'success');
  };

  // Delete request
  const deleteRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    showToast(`Request #${id} has been permanently deleted.`, 'warning');
  };

  // Reset data to defaults
  const resetToDefaultData = () => {
    setUsers(SEED_USERS);
    setRequests(SEED_REQUESTS);
    setCurrentUser(SEED_USERS[0]);
    localStorage.removeItem(STORAGE_KEY_USERS);
    localStorage.removeItem(STORAGE_KEY_REQUESTS);
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    showToast('System data reset to original seed dataset.', 'info');
  };

  // Computed Analytics
  const analytics: AnalyticsSummary = useMemo(() => {
    const totalRequests = requests.length;
    let pendingCount = 0;
    let inProgressCount = 0;
    let resolvedCount = 0;
    let rejectedCount = 0;
    let urgentPending = 0;

    const categoryBreakdown: Record<ServiceCategory, number> = {
      streetlights: 0,
      water: 0,
      garbage: 0,
      roads: 0,
      parks: 0,
      health: 0
    };

    const statusBreakdown: Record<RequestStatus, number> = {
      pending: 0,
      in_progress: 0,
      resolved: 0,
      rejected: 0
    };

    const priorityBreakdown: Record<RequestPriority, number> = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0
    };

    let totalResolutionHours = 0;
    let resolvedItemCount = 0;

    requests.forEach((r) => {
      // Status
      if (r.status === 'pending') pendingCount++;
      if (r.status === 'in_progress') inProgressCount++;
      if (r.status === 'resolved') resolvedCount++;
      if (r.status === 'rejected') rejectedCount++;

      statusBreakdown[r.status] = (statusBreakdown[r.status] || 0) + 1;

      // Category
      if (categoryBreakdown[r.category] !== undefined) {
        categoryBreakdown[r.category]++;
      }

      // Priority
      if (priorityBreakdown[r.priority] !== undefined) {
        priorityBreakdown[r.priority]++;
      }

      // Urgent pending
      if ((r.priority === 'urgent' || r.priority === 'high') && r.status === 'pending') {
        urgentPending++;
      }

      // Resolution time
      if (r.status === 'resolved' && r.resolvedAt && r.createdAt) {
        const createdMs = new Date(r.createdAt).getTime();
        const resolvedMs = new Date(r.resolvedAt).getTime();
        const diffHours = (resolvedMs - createdMs) / (1000 * 60 * 60);
        if (diffHours > 0) {
          totalResolutionHours += diffHours;
          resolvedItemCount++;
        }
      }
    });

    const openCount = pendingCount + inProgressCount;
    const resolutionRate = totalRequests > 0 ? Math.round((resolvedCount / totalRequests) * 100) : 0;
    const avgResolutionDays = resolvedItemCount > 0 
      ? Number((totalResolutionHours / (resolvedItemCount * 24)).toFixed(1)) 
      : 1.4;

    return {
      totalRequests,
      pendingCount,
      inProgressCount,
      resolvedCount,
      rejectedCount,
      openCount,
      resolutionRate,
      urgentPending,
      avgResolutionDays,
      categoryBreakdown,
      statusBreakdown,
      priorityBreakdown
    };
  }, [requests]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        requests,
        analytics,
        toasts,
        login,
        register,
        logout,
        switchUser,
        createRequest,
        updateRequestStatus,
        assignOfficer,
        submitCitizenFeedback,
        deleteRequest,
        resetToDefaultData,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
