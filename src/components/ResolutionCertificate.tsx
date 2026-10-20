import React from 'react';
import { ServiceRequest } from '../types';
import { SERVICE_CATEGORIES } from '../data/categories';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  Award, 
  CheckCircle, 
  Calendar, 
  Building2, 
  User, 
  MapPin, 
  Star 
} from 'lucide-react';

interface ResolutionCertificateProps {
  request: ServiceRequest | null;
  onClose: () => void;
}

export const ResolutionCertificate: React.FC<ResolutionCertificateProps> = ({ request, onClose }) => {
  if (!request) return null;

  const catInfo = SERVICE_CATEGORIES[request.category];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white text-slate-900 rounded-2xl shadow-2xl border-4 border-double border-amber-600/40 w-full max-w-2xl overflow-hidden print:border-none print:shadow-none print:m-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            Official Service Certificate Preview
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Certificate
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Body */}
        <div className="p-8 sm:p-10 relative bg-[#fdfcf9] font-serif print:p-6">
          {/* Watermark Crest */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <ShieldCheck className="w-96 h-96 text-amber-900" />
          </div>

          <div className="relative z-10 text-center space-y-4">
            {/* National Header */}
            <div className="border-b-2 border-amber-900/30 pb-4">
              <div className="flex items-center justify-center gap-3 mb-1">
                <span className="w-3 h-3 rounded-full bg-black"></span>
                <span className="w-3 h-3 rounded-full bg-rose-600"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              </div>
              <h4 className="text-xs uppercase tracking-widest text-amber-900 font-sans font-bold">
                Republic of Kenya • Ministry of Devolution & Municipal Services
              </h4>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif pt-1">
                PUBLIC SERVICE RESOLUTION CERTIFICATE
              </h1>
              <span className="text-xs font-sans text-slate-600 block mt-1">
                Under the Public Service Delivery & Civic Accountability Charter
              </span>
            </div>

            {/* Cert Ref Code */}
            <div className="flex justify-between items-center text-xs font-sans text-slate-500 py-1 border-b border-dashed border-slate-300">
              <span>CERTIFICATE NO: <strong className="font-mono text-slate-900">CERT-{request.id.replace('REQ-', '')}</strong></span>
              <span>INCIDENT REF: <strong className="font-mono text-indigo-700">{request.id}</strong></span>
            </div>

            {/* Main Text */}
            <div className="py-4 space-y-3 text-slate-800 text-sm leading-relaxed text-left font-serif">
              <p>
                This certifies that the public incident report titled{' '}
                <strong className="font-sans font-bold text-slate-950">"{request.title}"</strong>,
                originally lodged by citizen <strong className="font-sans font-bold text-slate-950">{request.citizenName}</strong>{' '}
                on <span className="font-sans font-semibold">{new Date(request.createdAt).toLocaleDateString()}</span>,
                has been formally inspected, remediated, and verified resolved by the responsible municipal authority.
              </p>

              {/* Boxed Incident Summary */}
              <div className="bg-white p-4 rounded-xl border border-amber-800/20 text-xs font-sans space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 block">Category:</span>
                    <strong className="text-slate-900">{catInfo.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Location:</span>
                    <strong className="text-slate-900 truncate block">{request.location.address}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Executing Agency:</span>
                    <strong className="text-slate-900">{request.assignedDepartment || catInfo.department}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Field Officer:</span>
                    <strong className="text-slate-900">{request.assignedOfficer || 'Municipal Rapid Response Crew'}</strong>
                  </div>
                </div>

                {request.resolutionNotes && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-500 block font-semibold">Technical Remediation Summary:</span>
                    <p className="text-slate-700 italic mt-0.5">"{request.resolutionNotes}"</p>
                  </div>
                )}
              </div>

              {request.feedback && (
                <div className="flex items-center justify-between bg-amber-50/80 p-3 rounded-lg border border-amber-200 text-xs font-sans">
                  <span className="text-amber-900 font-semibold">Citizen Satisfaction Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= request.feedback!.rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                    <span className="font-bold text-amber-900 ml-1">{request.feedback.rating}/5</span>
                  </div>
                </div>
              )}
            </div>

            {/* Official Signatures & Seal */}
            <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-2 gap-6 text-center font-sans">
              <div className="space-y-1">
                <div className="h-10 flex items-center justify-center italic font-serif text-slate-700">
                  Eng. Beatrice Kimani
                </div>
                <div className="border-t border-slate-400 pt-1 text-[11px] text-slate-500">
                  <strong className="block text-slate-800">Director of Public Works & Response</strong>
                  Municipal Service Desk
                </div>
              </div>

              <div className="space-y-1">
                <div className="h-10 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-700/60 flex items-center justify-center text-amber-800 text-[10px] uppercase font-bold tracking-tighter">
                    VERIFIED
                  </div>
                </div>
                <div className="border-t border-slate-400 pt-1 text-[11px] text-slate-500">
                  <strong className="block text-slate-800">Digital Seal & Verification</strong>
                  {request.resolvedAt ? new Date(request.resolvedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 text-center text-[11px] font-sans text-slate-500 print:hidden">
          Official copy stored on the national eCitizen civic database. Authentic document.
        </div>
      </div>
    </div>
  );
};
