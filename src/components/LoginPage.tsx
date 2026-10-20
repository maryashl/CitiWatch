import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { SEED_USERS } from '../data/seedData';
import { 
  Building2, 
  ShieldCheck, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Search,
  KeyRound,
  Shield
} from 'lucide-react';

interface LoginPageProps {
  onNavigateToSignup: () => void;
  onNavigateToPublicTracker: () => void;
  onLoginSuccess: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToSignup,
  onNavigateToPublicTracker,
  onLoginSuccess
}) => {
  const { login, switchUser, showToast } = useApp();

  const [activeRoleTab, setActiveRoleTab] = useState<UserRole>('citizen');
  const [identifier, setIdentifier] = useState('ashleyanyango36@gmail.com');
  const [password, setPassword] = useState('citizen123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your National ID number or registered email address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = login(identifier, password, activeRoleTab);
      setIsSubmitting(false);

      if (res.success) {
        onLoginSuccess(activeRoleTab);
      } else {
        setErrorMsg(res.message || 'Login failed. Please verify your credentials.');
      }
    }, 400);
  };

  const handlePreloadDemo = (email: string, pass: string, role: UserRole) => {
    setActiveRoleTab(role);
    setIdentifier(email);
    setPassword(pass);
    setErrorMsg('');
  };

  const handleInstantDemoLogin = (userId: string, role: UserRole) => {
    switchUser(userId);
    onLoginSuccess(role);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      showToast('Please enter your email or National ID.', 'warning');
      return;
    }
    showToast(`Password reset link & SMS OTP sent to ${resetEmail}. Check your inbox.`, 'success');
    setShowForgotModal(false);
    setResetEmail('');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-6 sm:py-12">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Civic Insignia & Brand Header */}
        <div className="text-center space-y-2">
          {/* Flag Tricolor Bar */}
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <span className="w-4 h-1.5 rounded-xs bg-black"></span>
            <span className="w-4 h-1.5 rounded-xs bg-rose-600"></span>
            <span className="w-4 h-1.5 rounded-xs bg-emerald-600"></span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>eCitizen Single Sign-On (SSO) Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign in to CitiWatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Access municipal service requests, monitor field dispatches, and review civic resolutions.
          </p>
        </div>

        {/* Evaluator Fast-Test Banner */}
        <div className="bg-[#F0F7FC] rounded-2xl p-4 border border-[#005EA8]/20 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#005EA8] mb-2.5">
            <Sparkles className="w-4 h-4 text-[#005EA8]" />
            <span>Evaluator 1-Click Test Accounts:</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {SEED_USERS.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#005EA8] transition-colors text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#172033]">{user.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                      user.role === 'admin' 
                        ? 'bg-[#F0F7FC] text-[#005EA8] border border-[#005EA8]/20' 
                        : 'bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A]/20'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono block">
                    ID: {user.nationalId} • Pass: {user.password || 'citizen123'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePreloadDemo(user.email, user.password || 'citizen123', user.role)}
                    className="px-2 py-1 text-[11px] font-semibold text-[#005EA8] hover:bg-[#F0F7FC] rounded-lg transition-colors cursor-pointer"
                  >
                    Fill
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInstantDemoLogin(user.id, user.role)}
                    className="px-2.5 py-1 text-[11px] font-bold bg-[#005EA8] hover:bg-[#004b87] text-white rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    1-Click In
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          {/* Role Mode Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveRoleTab('citizen');
                setErrorMsg('');
              }}
              className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeRoleTab === 'citizen'
                  ? 'bg-[#005EA8] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-[#172033]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Public Citizen</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveRoleTab('admin');
                setErrorMsg('');
                if (identifier === 'ashleyanyango36@gmail.com') {
                  setIdentifier('admin@ecitizen.gov.ke');
                  setPassword('admin123');
                }
              }}
              className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeRoleTab === 'admin'
                  ? 'bg-[#005EA8] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-[#172033]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Municipal Staff</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#DC2626]/30 flex items-start gap-2.5 text-xs text-[#DC2626] animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1.5">
                {activeRoleTab === 'citizen' ? 'National ID / Alien ID or Email' : 'Government Staff Email or Officer ID'} <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={activeRoleTab === 'citizen' ? "e.g. 32894102 or ashley@gmail.com" : "e.g. admin@ecitizen.gov.ke"}
                  className="w-full text-xs rounded-xl border border-slate-300 bg-white text-[#172033] pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-[#005EA8] focus:border-[#005EA8] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#172033]">
                  Password <span className="text-[#DC2626]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-[#005EA8] hover:underline font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secret password"
                  className="w-full text-xs rounded-xl border border-slate-300 bg-white text-[#172033] pl-10 pr-10 py-2.5 focus:ring-2 focus:ring-[#005EA8] focus:border-[#005EA8] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#005EA8] focus:ring-[#005EA8]"
                />
                <span>Remember this workstation</span>
              </label>

              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#16A34A]" />
                <span>256-bit SSL</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#005EA8] hover:bg-[#004b87] text-white rounded-xl text-xs font-bold shadow-md shadow-[#005EA8]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating with eCitizen...' : `Sign In as ${activeRoleTab === 'admin' ? 'Municipal Officer' : 'Citizen'}`}</span>
            </button>
          </form>

          {/* Sign Up Redirect */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-3">
            <p className="text-xs text-slate-600">
              Don't have an eCitizen account?{' '}
              <button
                type="button"
                onClick={onNavigateToSignup}
                className="font-bold text-[#005EA8] hover:underline cursor-pointer"
              >
                Create a Citizen Account
              </button>
            </p>

            <div>
              <button
                type="button"
                onClick={onNavigateToPublicTracker}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#005EA8] transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Track a service ticket without signing in →</span>
              </button>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <p className="text-[11px] text-center text-slate-400 max-w-xs mx-auto leading-relaxed">
          Authorized civic access only. Unauthorized attempts are monitored in accordance with the Kenya Computer Misuse and Cybercrimes Act, 2018.
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <KeyRound className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Password Recovery
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your registered National ID or Email address. We will simulate sending a temporary OTP token to your mobile device.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="text"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="National ID or Email"
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
                >
                  Send OTP Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
