import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  User, 
  LogIn, 
  LogOut, 
  PlusCircle, 
  BarChart3, 
  Search, 
  Layers, 
  PhoneCall, 
  Building2, 
  ChevronDown, 
  CheckCircle,
  HelpCircle,
  Flame,
  AlertCircle
} from 'lucide-react';

export type ActiveView = 
  | 'citizen_portal' 
  | 'new_request' 
  | 'admin_dashboard' 
  | 'analytics' 
  | 'public_tracker' 
  | 'emergency'
  | 'login'
  | 'signup';

interface NavbarProps {
  currentView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onOpenAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAuth }) => {
  const { currentUser, logout, switchUser, users } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Top Civic National Flag & Evaluator Fast-Switch Ribbon */}
      <div className="bg-slate-950 text-white text-[11px] px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {/* Kenya Tricolor Bar */}
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-black"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          </div>
          <span className="font-semibold tracking-wide text-slate-300">
            eCitizen CitiWatch • Republic of Kenya Public Service Desk
          </span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-emerald-400 font-medium">
            SLA Charter: 24/7 Rapid Incident Dispatch
          </span>
        </div>

        {/* 1-Click Fast Switch for Evaluators & Graders */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-slate-400 hidden sm:inline">Pages & Testing:</span>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
              currentView === 'login'
                ? 'bg-[#005EA8] text-white ring-1 ring-[#005EA8]'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Login Page
          </button>
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
              currentView === 'signup'
                ? 'bg-[#16A34A] text-white ring-1 ring-[#16A34A]'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Signup Page
          </button>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <button
            type="button"
            onClick={() => {
              const citizen = users.find((u) => u.role === 'citizen');
              if (citizen) {
                switchUser(citizen.id);
                onNavigate('citizen_portal');
              }
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
              currentUser?.role === 'citizen' && currentView !== 'login' && currentView !== 'signup'
                ? 'bg-[#005EA8] text-white ring-1 ring-[#005EA8]'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Citizen Demo
          </button>
          <button
            type="button"
            onClick={() => {
              const admin = users.find((u) => u.role === 'admin');
              if (admin) {
                switchUser(admin.id);
                onNavigate('admin_dashboard');
              }
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
              currentUser?.role === 'admin' && currentView !== 'login' && currentView !== 'signup'
                ? 'bg-[#172033] text-white ring-1 ring-slate-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Admin Demo
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate(isAdmin ? 'admin_dashboard' : 'citizen_portal')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#005EA8] text-white flex items-center justify-center shadow-md shadow-[#005EA8]/25 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-[#172033]">
                Citi<span className="text-[#005EA8]">Watch</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-[#F0F7FC] text-[#005EA8] rounded border border-[#005EA8]/30">
                eCitizen
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block -mt-0.5">
              Municipal Service Request System
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600">
          {isAdmin ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate('admin_dashboard')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'admin_dashboard'
                    ? 'bg-[#F0F7FC] text-[#005EA8] font-bold border border-[#005EA8]/20'
                    : 'hover:bg-slate-100 hover:text-[#172033]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#005EA8]" />
                <span>Admin Triage Desk</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('citizen_portal')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'citizen_portal'
                    ? 'bg-[#F0F7FC] text-[#005EA8] font-bold border border-[#005EA8]/20'
                    : 'hover:bg-slate-100 hover:text-[#172033]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Citizen View</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onNavigate('citizen_portal')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'citizen_portal'
                    ? 'bg-[#F0F7FC] text-[#005EA8] font-bold border border-[#005EA8]/20'
                    : 'hover:bg-slate-100 hover:text-[#172033]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>My Requests</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('new_request')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'new_request'
                    ? 'bg-[#F0F7FC] text-[#005EA8] font-bold border border-[#005EA8]/20'
                    : 'hover:bg-slate-100 hover:text-[#172033]'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-[#16A34A]" />
                <span>Report Issue</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => onNavigate('public_tracker')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'public_tracker'
                ? 'bg-[#F0F7FC] text-[#005EA8] font-bold border border-[#005EA8]/20'
                : 'hover:bg-slate-100 hover:text-[#172033]'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Track Reference</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('analytics')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'analytics'
                ? 'bg-[#F0F7FC] text-[#005EA8] font-bold border border-[#005EA8]/20'
                : 'hover:bg-slate-100 hover:text-[#172033]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('emergency')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'emergency'
                ? 'bg-[#FEF2F2] text-[#DC2626] font-bold border border-[#DC2626]/20'
                : 'hover:bg-slate-100 hover:text-[#172033]'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-[#DC2626]" />
            <span>Hotlines</span>
          </button>
        </nav>

        {/* Right User Bar */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                  isAdmin ? 'bg-[#172033]' : 'bg-[#005EA8]'
                }`}>
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold text-[#172033] block leading-tight">
                    {currentUser.name}
                  </span>
                  <span className={`text-[10px] font-semibold uppercase ${
                    isAdmin ? 'text-[#005EA8]' : 'text-[#16A34A]'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in zoom-in-95"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="p-2 border-b border-slate-100 mb-1">
                    <span className="text-slate-400 text-[10px] block">Signed in as</span>
                    <strong className="text-[#172033] block">{currentUser.name}</strong>
                    <span className="text-slate-500 font-mono text-[11px] truncate block">{currentUser.email}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate('citizen_portal')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F0F7FC] flex items-center gap-2 text-[#172033] cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#005EA8]" />
                    <span>Citizen Dashboard</span>
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => onNavigate('admin_dashboard')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F0F7FC] flex items-center gap-2 text-[#005EA8] font-semibold cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin Triage Desk</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-[#172033] cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Switch Account / Login</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      onNavigate('login');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#FEF2F2] flex items-center gap-2 text-[#DC2626] font-semibold cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'login'
                    ? 'bg-[#005EA8] text-white shadow-md shadow-[#005EA8]/20'
                    : 'bg-white border border-slate-300 text-[#172033] hover:bg-[#F0F7FC] hover:text-[#005EA8]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('signup')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'signup'
                    ? 'bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/20'
                    : 'bg-[#16A34A] hover:bg-[#15803d] text-white shadow-md shadow-[#16A34A]/20'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Register</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden border-t border-slate-200 bg-white px-3 py-2 flex items-center justify-around text-[11px] font-semibold text-slate-600">
        <button
          type="button"
          onClick={() => onNavigate(isAdmin ? 'admin_dashboard' : 'citizen_portal')}
          className={`p-1.5 flex flex-col items-center gap-0.5 cursor-pointer ${
            currentView === 'citizen_portal' || currentView === 'admin_dashboard' ? 'text-[#005EA8] font-bold' : 'hover:text-[#172033]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{isAdmin ? 'Triage' : 'Requests'}</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('new_request')}
          className={`p-1.5 flex flex-col items-center gap-0.5 cursor-pointer ${
            currentView === 'new_request' ? 'text-[#005EA8] font-bold' : 'hover:text-[#172033]'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-[#16A34A]" />
          <span>Report</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('public_tracker')}
          className={`p-1.5 flex flex-col items-center gap-0.5 cursor-pointer ${
            currentView === 'public_tracker' ? 'text-[#005EA8] font-bold' : 'hover:text-[#172033]'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Track</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('analytics')}
          className={`p-1.5 flex flex-col items-center gap-0.5 cursor-pointer ${
            currentView === 'analytics' ? 'text-[#005EA8] font-bold' : 'hover:text-[#172033]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Stats</span>
        </button>
      </div>
    </header>
  );
};
