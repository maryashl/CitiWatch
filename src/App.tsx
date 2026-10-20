import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ServiceRequest } from './types';
import { Navbar } from './components/Navbar';
import { CitizenPortal } from './components/CitizenPortal';
import { CitizenRequestForm } from './components/CitizenRequestForm';
import { AdminDashboard } from './components/AdminDashboard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PublicTracker } from './components/PublicTracker';
import { EmergencyHotlines } from './components/EmergencyHotlines';
import { RequestDetailModal } from './components/RequestDetailModal';
import { ResolutionCertificate } from './components/ResolutionCertificate';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { ToastContainer } from './components/ToastContainer';
import { 
  Building2, 
  ShieldCheck, 
  PhoneCall, 
  FileText, 
  ExternalLink, 
  Heart,
  HelpCircle,
  Clock
} from 'lucide-react';

type ActiveView = 
  | 'citizen_portal' 
  | 'new_request' 
  | 'admin_dashboard' 
  | 'analytics' 
  | 'public_tracker' 
  | 'emergency'
  | 'login'
  | 'signup';

const MainLayout: React.FC = () => {
  const { currentUser } = useApp();

  const [currentView, setCurrentView] = useState<ActiveView>(() => {
    return currentUser?.role === 'admin' ? 'admin_dashboard' : 'citizen_portal';
  });

  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [certificateRequest, setCertificateRequest] = useState<ServiceRequest | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [trackingPreloadCode, setTrackingPreloadCode] = useState('');

  // Handle successful submission from form
  const handleRequestCreated = (req: ServiceRequest) => {
    setSelectedRequest(req);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033] flex flex-col font-sans selection:bg-[#005EA8] selection:text-white">
      {/* Top Civic Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentView === 'citizen_portal' && (
          <CitizenPortal
            onNewRequest={() => setCurrentView('new_request')}
            onSelectRequest={(req) => setSelectedRequest(req)}
            onOpenCertificate={(req) => setCertificateRequest(req)}
          />
        )}

        {currentView === 'new_request' && (
          <CitizenRequestForm
            onSuccess={handleRequestCreated}
            onCancel={() => setCurrentView('citizen_portal')}
          />
        )}

        {currentView === 'admin_dashboard' && (
          <AdminDashboard
            onSelectRequest={(req) => setSelectedRequest(req)}
            onOpenCertificate={(req) => setCertificateRequest(req)}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {currentView === 'public_tracker' && (
          <PublicTracker
            onOpenCertificate={(req) => setCertificateRequest(req)}
            initialCode={trackingPreloadCode}
          />
        )}

        {currentView === 'emergency' && (
          <EmergencyHotlines />
        )}

        {currentView === 'login' && (
          <LoginPage
            onNavigateToSignup={() => setCurrentView('signup')}
            onNavigateToPublicTracker={() => setCurrentView('public_tracker')}
            onLoginSuccess={(role) => setCurrentView(role === 'admin' ? 'admin_dashboard' : 'citizen_portal')}
          />
        )}

        {currentView === 'signup' && (
          <SignupPage
            onNavigateToLogin={() => setCurrentView('login')}
            onSignupSuccess={(role) => setCurrentView(role === 'admin' ? 'admin_dashboard' : 'citizen_portal')}
          />
        )}
      </main>

      {/* Civic Portal Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  CitiWatch • Municipal Public Service Request Desk
                </span>
                <span className="text-[11px] text-slate-400">
                  Republic of Kenya eCitizen Integration Standard • Open Governance Initiative
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
              <button 
                type="button" 
                onClick={() => setCurrentView('public_tracker')} 
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Track Reference Code
              </button>
              <button 
                type="button" 
                onClick={() => setCurrentView('analytics')} 
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Municipal Performance Analytics
              </button>
              <button 
                type="button" 
                onClick={() => setCurrentView('login')} 
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                eCitizen Sign In
              </button>
              <button 
                type="button" 
                onClick={() => setCurrentView('signup')} 
                className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-emerald-600 dark:text-emerald-400"
              >
                Register Citizen Profile
              </button>
              <button 
                type="button" 
                onClick={() => setCurrentView('emergency')} 
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Emergency Hotlines
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <p>
              © {new Date().getFullYear()} Republic of Kenya Municipal Service Commission. Guaranteed 48h Service Charter SLA.
            </p>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Real-time Triage Dispatch Active</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <RequestDetailModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onOpenCertificate={(req) => setCertificateRequest(req)}
      />

      <ResolutionCertificate
        request={certificateRequest}
        onClose={() => setCertificateRequest(null)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
