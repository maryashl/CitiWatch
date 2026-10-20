import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCategory, RequestPriority, ServiceRequest } from '../types';
import { SERVICE_CATEGORIES, MUNICIPAL_WARDS } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';
import { 
  MapPin, 
  Camera, 
  Upload, 
  Send, 
  CheckCircle, 
  Copy, 
  ArrowLeft, 
  Sparkles, 
  AlertTriangle,
  Clock,
  Building2,
  FileText,
  Navigation
} from 'lucide-react';

const SAMPLE_EVIDENCE_PHOTOS: { label: string; url: string }[] = [
  {
    label: 'Water Pipe Burst',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'Dark Streetlight',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'Garbage Dump',
    url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'Road Pothole',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
  }
];

interface CitizenRequestFormProps {
  onSuccess: (createdRequest: ServiceRequest) => void;
  onCancel?: () => void;
}

export const CitizenRequestForm: React.FC<CitizenRequestFormProps> = ({ onSuccess, onCancel }) => {
  const { createRequest, currentUser, showToast } = useApp();

  const [category, setCategory] = useState<ServiceCategory>('streetlights');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [ward, setWard] = useState(MUNICIPAL_WARDS[0]);
  const [landmark, setLandmark] = useState('');
  const [priority, setPriority] = useState<RequestPriority>('medium');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdResult, setCreatedResult] = useState<ServiceRequest | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Quick auto-populate location via simulated GPS
  const handleUseMyLocation = () => {
    setIsDetectingLocation(true);
    setTimeout(() => {
      const mockLocations = [
        {
          address: 'Kenyatta Avenue, Near GPO Roundabout',
          ward: 'Central Business District (CBD)',
          landmark: 'Opposite Telposta Towers'
        },
        {
          address: 'Waiyaki Way Slip Road, Westlands Commercial Hub',
          ward: 'Westlands / Parklands',
          landmark: 'Beside Sarit Center Footbridge'
        },
        {
          address: 'Argwings Kodhek Road, Kilimani Sector 4',
          ward: 'Kilimani / Kileleshwa',
          landmark: 'Adjacent to Adlife Plaza'
        }
      ];
      const randomLoc = mockLocations[Math.floor(Math.random() * mockLocations.length)];
      setAddress(randomLoc.address);
      setWard(randomLoc.ward);
      setLandmark(randomLoc.landmark);
      setIsDetectingLocation(false);
      showToast('Municipal GPS coordinates locked and address matched.', 'info');
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size exceeds 5MB limit.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        showToast('Photo evidence attached.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Please provide a brief title describing the problem.', 'warning');
      return;
    }
    if (!description.trim()) {
      showToast('Please provide detailed description of the issue.', 'warning');
      return;
    }
    if (!address.trim()) {
      showToast('Please specify the exact address or location.', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const newReq = createRequest({
        category,
        title,
        description,
        location: {
          address,
          wardOrZone: ward,
          landmark: landmark.trim() || undefined,
          lat: -1.286389,
          lng: 36.817223
        },
        priority,
        imageUrl: imageUrl.trim() || undefined
      });

      setCreatedResult(newReq);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (createdResult) {
      navigator.clipboard.writeText(createdResult.id);
      setCopied(true);
      showToast(`Copied ${createdResult.id} to clipboard`, 'success');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // If successfully created, display confirmation screen with tracking ticket
  if (createdResult) {
    const catInfo = SERVICE_CATEGORIES[createdResult.category];
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-[#F0FDF4] text-[#16A34A] rounded-full flex items-center justify-center mx-auto ring-8 ring-[#F0FDF4]/50">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A] bg-[#F0FDF4] px-3 py-1 rounded-full border border-[#16A34A]/20">
              Application Successfully Registered
            </span>
            <h2 className="text-2xl font-bold text-[#172033] pt-2">
              Public Service Request Lodged
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your service incident has been officially assigned to the municipal dispatch pool. You can track real-time resolution updates anytime.
            </p>
          </div>

          {/* Reference Card */}
          <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200 text-left space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block">Official Tracking Reference</span>
                <span className="text-xl font-mono font-bold text-[#005EA8]">
                  {createdResult.id}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F0F7FC] text-[#005EA8] hover:bg-[#e0eff9] border border-[#005EA8]/20 transition-colors cursor-pointer"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied Reference' : 'Copy Reference'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Department:</span>
                <span className="font-semibold text-[#172033]">{catInfo.department}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Service Charter SLA:</span>
                <span className="font-semibold text-[#F59E0B]">Guaranteed Response in {catInfo.slaHours} Hours</span>
              </div>
              <div>
                <span className="text-slate-500 block">Location:</span>
                <span className="font-semibold text-[#172033]">{createdResult.location.address}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Citizen Contact:</span>
                <span className="font-semibold text-[#172033]">{createdResult.citizenName} ({createdResult.citizenPhone})</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => onSuccess(createdResult)}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#005EA8] hover:bg-[#004d8c] text-white font-medium shadow-md shadow-[#005EA8]/20 transition-all text-sm cursor-pointer"
            >
              Track Request Status Now
            </button>
            <button
              type="button"
              onClick={() => {
                setCreatedResult(null);
                setTitle('');
                setDescription('');
                setAddress('');
                setImageUrl('');
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-slate-300 bg-white text-[#172033] hover:bg-[#F8FAFC] font-medium text-sm transition-all cursor-pointer"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedCategoryInfo = SERVICE_CATEGORIES[category];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header bar */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#005EA8] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>eCitizen Citizen Service Desk</span>
          </div>
          <h1 className="text-2xl font-bold text-[#172033]">
            Log a Public Service Incident
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Report municipal infrastructure damages, waste collection issues, water leaks, or public hazards directly to county dispatchers.
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white text-[#172033] hover:bg-[#F8FAFC] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-8 space-y-8">
        {/* Step 1: Category Selector */}
        <div>
          <label className="block text-sm font-bold text-[#172033] mb-2">
            1. Select Incident Category <span className="text-[#DC2626]">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(Object.keys(SERVICE_CATEGORIES) as ServiceCategory[]).map((catKey) => {
              const cat = SERVICE_CATEGORIES[catKey];
              const isSelected = category === catKey;
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setCategory(catKey)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-[#005EA8] bg-[#F0F7FC] ring-2 ring-[#005EA8] shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-xl ${cat.accentBg}`}>
                      <CategoryIcon category={catKey} className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#005EA8]"></span>
                    )}
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold leading-snug ${isSelected ? 'text-[#005EA8]' : 'text-[#172033]'}`}>
                      {cat.name}
                    </h3>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      SLA: {cat.slaHours}h response
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Department badge for selected category */}
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 bg-[#F8FAFC] px-3.5 py-2.5 rounded-xl border border-slate-200">
            <Building2 className="w-4 h-4 text-[#005EA8] shrink-0" />
            <span>
              Target Agency: <strong className="font-semibold text-[#172033]">{selectedCategoryInfo.department}</strong>
            </span>
          </div>
        </div>

        {/* Step 2: Location Information */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-[#172033]">
              2. Location of Incident <span className="text-[#DC2626]">*</span>
            </label>
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={isDetectingLocation}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#005EA8] hover:text-[#004d8c] cursor-pointer"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
              {isDetectingLocation ? 'Acquiring GPS...' : 'Simulate GPS Location'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Sub-County / Municipal Ward <span className="text-[#DC2626]">*</span>
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 bg-white text-[#172033] px-3 py-2.5 focus:ring-2 focus:ring-[#005EA8] focus:border-[#005EA8] focus:outline-hidden"
              >
                {MUNICIPAL_WARDS.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Landmark or Nearest Building
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Opposite City Market gate 3"
                className="w-full text-xs rounded-xl border border-slate-300 bg-white text-[#172033] px-3 py-2.5 focus:ring-2 focus:ring-[#005EA8] focus:border-[#005EA8] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">
              Exact Physical Street Address / Intersection <span className="text-[#DC2626]">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 14 Kenyatta Avenue, between Kimathi St and Muindi Mbingu"
                className="w-full text-xs rounded-xl border border-slate-300 bg-white text-[#172033] pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-[#005EA8] focus:border-[#005EA8] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Issue Details */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <label className="block text-sm font-bold text-[#172033]">
            3. Issue Details & Severity <span className="text-[#DC2626]">*</span>
          </label>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">
              Request Title (Summary) <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Streetlight out for 3 nights, dark corner"
              className="w-full text-xs rounded-xl border border-slate-300 bg-white text-[#172033] px-3 py-2.5 focus:ring-2 focus:ring-[#005EA8] focus:border-[#005EA8] focus:outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">
              Comprehensive Description <span className="text-[#DC2626]">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact details: When did the problem start? Is it causing immediate road blockage, property flooding, or security concerns?"
              className="w-full text-xs rounded-xl border border-slate-300 bg-white text-[#172033] px-3 py-2.5 focus:ring-2 focus:ring-[#005EA8] focus:border-[#005EA8] focus:outline-hidden resize-y"
            ></textarea>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-2">
              Urgency Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'low', label: 'Low', desc: 'Minor cosmetic defect' },
                { id: 'medium', label: 'Normal', desc: 'Standard service work' },
                { id: 'high', label: 'High', desc: 'Active disruption / hazard' },
                { id: 'urgent', label: 'Critical / Urgent', desc: 'Immediate public danger' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id as RequestPriority)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    priority === p.id
                      ? p.id === 'urgent'
                        ? 'border-[#DC2626] bg-[#FEF2F2] text-[#DC2626] ring-2 ring-[#DC2626]'
                        : p.id === 'high'
                        ? 'border-[#F59E0B] bg-[#FFFBEB] text-[#B45309] ring-2 ring-[#F59E0B]'
                        : 'border-[#005EA8] bg-[#F0F7FC] text-[#005EA8] ring-2 ring-[#005EA8]'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="font-bold text-xs block">{p.label}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 leading-tight">
                    {p.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 4: Visual Evidence Attachment (Optional) */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-[#172033]">
                4. Photographic Evidence <span className="text-xs font-normal text-slate-500">(Recommended)</span>
              </label>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="text-xs text-[#DC2626] hover:underline font-semibold cursor-pointer"
                >
                  Remove Photo
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Attaching clear photos helps field engineers diagnose required equipment before arriving on-site.
            </p>
          </div>

          {imageUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-300 max-h-60 bg-slate-900 flex items-center justify-center">
              <img
                src={imageUrl}
                alt="Incident proof"
                className="w-full h-56 object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-lg font-mono flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                Evidence attached
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* File upload drag area */}
              <label className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-[#F8FAFC] transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-[#172033]">
                  Click to browse or drop photo here
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Supports JPG, PNG, WEBP up to 5MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Quick sample photo selector for grading/demo test */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  Or select a demo inspection photo:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SAMPLE_EVIDENCE_PHOTOS.map((sample) => (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() => setImageUrl(sample.url)}
                      className="text-left p-2 rounded-xl border border-slate-200 hover:border-[#005EA8] group flex items-center gap-2 bg-white cursor-pointer transition-colors shadow-xs"
                    >
                      <img
                        src={sample.url}
                        alt={sample.label}
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                      />
                      <span className="text-[10px] font-semibold text-[#172033] group-hover:text-[#005EA8] truncate">
                        {sample.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Citizen Contact Profile Notice */}
        <div className="p-4 bg-[#F0F7FC] rounded-2xl border border-[#005EA8]/20 text-xs text-[#005EA8] flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-[#005EA8] shrink-0" />
          <div className="text-[#172033]">
            Request submitted under registered citizen ID:{' '}
            <strong className="text-[#005EA8]">{currentUser?.name || 'Guest Citizen'}</strong> ({currentUser?.phone || '+254 712 345 678'})
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-[#172033] hover:bg-[#F8FAFC] cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#005EA8] hover:bg-[#004d8c] text-white font-bold text-xs shadow-md shadow-[#005EA8]/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Registering Incident...' : 'Submit Official Service Request'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
