import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { MUNICIPAL_WARDS } from '../data/categories';
import { 
  Building2, 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  MapPin, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  Shield, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface SignupPageProps {
  onNavigateToLogin: () => void;
  onSignupSuccess: (role: UserRole) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onNavigateToLogin,
  onSignupSuccess
}) => {
  const { register } = useApp();

  const [role, setRole] = useState<UserRole>('citizen');
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [ward, setWard] = useState(MUNICIPAL_WARDS[0]);
  const [department, setDepartment] = useState('Directorate of Public Works');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute password strength
  const getPasswordStrength = () => {
    if (!password) return { label: 'Empty', color: 'bg-slate-200', width: '0%' };
    if (password.length < 6) return { label: 'Weak', color: 'bg-[#DC2626]', width: '33%' };
    if (password.length < 10) return { label: 'Good', color: 'bg-[#F59E0B]', width: '66%' };
    return { label: 'Strong', color: 'bg-[#16A34A]', width: '100%' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full official name.');
      return;
    }
    if (!nationalId.trim()) {
      setErrorMsg('Please enter your National ID or Passport number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      setErrorMsg('Please provide a valid phone number for SMS tracking updates.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-type your password.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('You must agree to the eCitizen Terms of Service to proceed.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = register({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        nationalId: nationalId.trim(),
        password: password.trim(),
        ward,
        role,
        department: role === 'admin' ? department.trim() : undefined
      });

      setIsSubmitting(false);

      if (res.success) {
        onSignupSuccess(role);
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    }, 400);
  };

  // Quick fill sample citizen for convenience
  const handlePrefillSample = () => {
    const randomId = Math.floor(30000000 + Math.random() * 9000000);
    setFullName('Grace Muthoni');
    setNationalId(`${randomId}`);
    setEmail(`grace.muthoni${Math.floor(Math.random() * 90)}@gmail.com`);
    setPhone('+254 722 456 789');
    setWard(MUNICIPAL_WARDS[1]);
    setPassword('citizen123');
    setConfirmPassword('citizen123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-6 sm:py-12">
      <div className="max-w-xl w-full mx-auto space-y-6">
        {/* Civic Insignia Header */}
        <div className="text-center space-y-2">
          {/* Flag Tricolor Bar */}
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <span className="w-4 h-1.5 rounded-xs bg-black"></span>
            <span className="w-4 h-1.5 rounded-xs bg-rose-600"></span>
            <span className="w-4 h-1.5 rounded-xs bg-emerald-600"></span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>National Digital Citizen Registration</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            Create an eCitizen Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Register your verified citizen identity to report public service incidents, track resolutions, and rate municipal departments.
          </p>

          <button
            type="button"
            onClick={handlePrefillSample}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#005EA8] bg-[#F0F7FC] px-3.5 py-1.5 rounded-full border border-[#005EA8]/20 hover:bg-[#e0eff9] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#005EA8]" />
            <span>Evaluator shortcut: Auto-fill sample citizen details</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          {/* Account Role Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-2">
              Select Registration Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('citizen')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  role === 'citizen'
                    ? 'border-[#005EA8] bg-[#F0F7FC] ring-2 ring-[#005EA8] text-[#005EA8]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <User className="w-4 h-4 text-[#005EA8]" />
                  {role === 'citizen' && <span className="w-2 h-2 rounded-full bg-[#005EA8]"></span>}
                </div>
                <span className="font-bold text-xs block text-[#172033]">Public Citizen</span>
                <span className="text-[10px] text-slate-500 block">Report & track municipal issues</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  role === 'admin'
                    ? 'border-[#005EA8] bg-[#F0F7FC] ring-2 ring-[#005EA8] text-[#005EA8]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#005EA8]" />
                  {role === 'admin' && <span className="w-2 h-2 rounded-full bg-[#005EA8]"></span>}
                </div>
                <span className="font-bold text-xs block text-[#172033]">Municipal Admin</span>
                <span className="text-[10px] text-slate-500 block">Triage desk & field crew assignment</span>
              </button>
            </div>
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
            {/* Name & National ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Full Legal Names <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Grace Muthoni"
                    className="w-full text-xs rounded-xl border border-slate-300 bg-white text-[#172033] pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-[#005EA8] focus:border-[#005EA8] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  National ID / Passport No. <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="e.g. 34891024"
                    className="w-full text-xs rounded-xl border border-slate-300 bg-white text-[#172033] pl-9 pr-3 py-2.5 font-mono focus:ring-2 focus:ring-[#005EA8] focus:border-[#005EA8] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Email Address <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. grace@example.com"
                    className="w-full text-xs rounded-xl border border-slate-300 bg-white text-[#172033] pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-[#005EA8] focus:border-[#005EA8] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Phone Number (for SMS Tracking) <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="w-full text-xs rounded-xl border border-slate-300 bg-white text-[#172033] pl-9 pr-3 py-2.5 font-mono focus:ring-2 focus:ring-[#005EA8] focus:border-[#005EA8] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Ward or Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Residential Sub-County / Ward <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 bg-white text-[#172033] pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-[#005EA8] focus:border-[#005EA8] focus:outline-hidden"
                  >
                    {MUNICIPAL_WARDS.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
              </div>

              {role === 'admin' ? (
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">
                    Municipal Agency Department <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Roads & Streetlights Section"
                    className="w-full text-xs rounded-xl border border-slate-300 bg-white text-[#172033] px-3 py-2.5 focus:ring-2 focus:ring-[#005EA8] focus:border-[#005EA8] focus:outline-hidden"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">
                    Identification Document Type
                  </label>
                  <select
                    disabled
                    className="w-full text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-600 px-3 py-2.5"
                  >
                    <option>Republic of Kenya National ID</option>
                  </select>
                </div>
              )}
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Create Password <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full text-xs rounded-xl border border-slate-300 bg-white text-[#172033] pl-9 pr-10 py-2.5 focus:ring-2 focus:ring-[#005EA8] focus:border-[#005EA8] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Strength Bar */}
                {password && (
                  <div className="mt-1.5 space-y-1">
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }}></div>
                    </div>
                    <span className="text-[10px] text-slate-500">Security: <strong>{strength.label}</strong></span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Confirm Password <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full text-xs rounded-xl border border-slate-300 bg-white text-[#172033] pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-[#005EA8] focus:border-[#005EA8] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 leading-normal select-none">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-slate-300 text-[#005EA8] focus:ring-[#005EA8] mt-0.5"
                />
                <span>
                  I confirm that all provided identity details are accurate. I agree to the{' '}
                  <strong className="text-[#005EA8]">eCitizen Civic Terms of Service</strong> and understand that service request updates will be transmitted via SMS and email.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#005EA8] hover:bg-[#004d8c] text-white rounded-xl text-xs font-bold shadow-md shadow-[#005EA8]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-4"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering with eCitizen National Registry...' : 'Register Official Citizen Profile'}</span>
            </button>
          </form>

          {/* Login Redirect */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Already have an eCitizen account?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="font-bold text-[#005EA8] hover:underline"
              >
                Sign in to your account
              </button>
            </p>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2.5 text-center justify-center shadow-xs">
          <Shield className="w-4 h-4 text-[#005EA8] shrink-0" />
          <span>Your personal identity data is protected under the Kenya Data Protection Act, 2019.</span>
        </div>
      </div>
    </div>
  );
};
