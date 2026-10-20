import React from 'react';
import { 
  PhoneCall, 
  AlertTriangle, 
  Flame, 
  Droplets, 
  Lightbulb, 
  ShieldAlert, 
  HelpCircle, 
  FileText, 
  Clock, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/categories';

export const EmergencyHotlines: React.FC = () => {
  const hotlines = [
    {
      agency: 'National Police & Disaster Command',
      number: '999 / 112 / 911',
      desc: 'Immediate life threats, structural collapses, armed security threats',
      icon: ShieldAlert,
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      agency: 'Fire & Municipal Rescue Services',
      number: '+254 (0)20 2222181 / 2344599',
      desc: 'Active fires, gas leaks, road entrapment, hazardous chemical spills',
      icon: Flame,
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    {
      agency: 'City Water & Sewerage Rapid Control',
      number: '+254 703 080 598',
      desc: 'Major distribution trunk bursts, contaminated tap supply, sewer overflows',
      icon: Droplets,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      agency: 'Electrical Emergency & Live Wire Desk',
      number: '97771 / +254 703 070 707',
      desc: 'Fallen live conductors, exploding transformers, sparking feeder pillars',
      icon: Lightbulb,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ];

  const faqs = [
    {
      q: 'Do I need an account to track the status of my service request?',
      a: 'No. Every request receives a unique Tracking Code (e.g., REQ-2026-1042). You can enter this code in the Track Reference counter at any time to inspect live field crew progress, assignment notes, and the official completion certificate.'
    },
    {
      q: 'What is the guaranteed response time under the Service Charter?',
      a: 'Water emergencies and health hazards carry a 24-hour SLA. Streetlighting and park amenities carry a 48-hour SLA. Complex road repaving and culvert reconstructions are scheduled within 72 hours with priority signage erected immediately.'
    },
    {
      q: 'Can I upload photos of the incident?',
      a: 'Yes! Photographic evidence helps triage engineers accurately evaluate required spare parts, vehicles, and manpower before arriving on location.'
    },
    {
      q: 'How do I submit feedback after an issue has been resolved?',
      a: 'Once a ticket is marked "Resolved", open the ticket in your dashboard and leave a 1 to 5-star rating with commentary. This score directly informs county department key performance indicators (KPIs).'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
          <PhoneCall className="w-3.5 h-3.5" />
          <span>24/7 Rapid Response Contacts</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Emergency Hotlines & Citizen Service Charter
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          For acute life-threatening situations, live electric wire contacts, or severe flooding, call the toll-free emergency lines directly.
        </p>
      </div>

      {/* Emergency Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {hotlines.map((h) => {
          const Icon = h.icon;
          return (
            <div
              key={h.agency}
              className={`p-5 rounded-2xl border ${h.color} bg-white dark:bg-slate-900 shadow-sm space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {h.agency}
                </span>
                <Icon className="w-5 h-5 shrink-0" />
              </div>
              <a
                href={`tel:${h.number.split('/')[0].trim()}`}
                className="text-xl font-bold font-mono text-indigo-700 dark:text-indigo-400 block hover:underline"
              >
                {h.number}
              </a>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {h.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Service Charter Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Official Service Level Agreement (SLA) Benchmarks
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Service Incident Domain</th>
                <th className="py-2.5 px-3">Executing Department</th>
                <th className="py-2.5 px-3">Max SLA Turnaround</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {Object.values(SERVICE_CATEGORIES).map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {cat.name}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {cat.department}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {cat.slaHours} Hours
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4 pt-2">
          {faqs.map((faq, i) => (
            <div key={i} className="space-y-1 text-xs">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {faq.q}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
