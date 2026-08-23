import React from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Mail, 
  PhoneCall, 
  MapPin, 
  Lock, 
  CreditCard, 
  Sparkles,
  Compass,
  Plane,
  Clock,
  Zap
} from 'lucide-react';
import { PageTab } from '../types';

interface FooterProps {
  onNavigateTab: (tab: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      
      {/* Upper Footer: Carrier Partners & Trust Ribbon */}
      <div className="border-b border-slate-800 py-8 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <div>
                <span className="font-black text-sm block tracking-tight">AK TRAVELTOURS GLOBAL</span>
                <span className="text-[11px] text-slate-400">GSMA-Accredited eSIM RSP Delivery Platform</span>
              </div>
            </div>

            {/* Carrier Roaming Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold text-slate-300">
              <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">NTT Docomo 5G</span>
              <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">Vodafone EU</span>
              <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">AT&amp;T USA</span>
              <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">Orange 5G</span>
              <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">Singtel Asia</span>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <span className="font-black text-lg tracking-tight">AK TRAVELTOURS</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Global travel experiences and high-speed digital eSIMs with 7-Day, 10-Day, 30-Day, and Unlimited 5G plans. Automated delivery strictly via email within 30 minutes after admin review.
            </p>
            
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>450 Lexington Ave, Suite 2200, New York, NY 10017</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>support@aktraveltours.com</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>+1 (800) 792-AKTOUR (24/7 Hotline)</span>
              </div>
            </div>
          </div>

          {/* eSIM Plans */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">eSIM Data Plans</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigateTab('home')} className="hover:text-white transition">
                  7-Day Travel eSIMs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('home')} className="hover:text-white transition">
                  10-Day Vacation eSIMs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('home')} className="hover:text-white transition">
                  30-Day Nomad eSIMs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('unlimited')} className="hover:text-white transition text-amber-400 font-bold">
                  Unlimited 5G Data Plans
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('calculator')} className="hover:text-white transition">
                  Trip Data Calculator
                </button>
              </li>
            </ul>
          </div>

          {/* Tours & Company */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Tours &amp; Agency</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigateTab('tours')} className="hover:text-white transition">
                  Signature Tour Packages
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('about')} className="hover:text-white transition">
                  About AK TRAVELTOURS
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('compatibility')} className="hover:text-white transition">
                  Device Compatibility (*#06#)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('contact')} className="hover:text-white transition">
                  Email Delivery Helpdesk
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Support */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Support &amp; Security</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigateTab('contact')} className="hover:text-white transition">
                  24/7 Support Desk
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('terms')} className="hover:text-white transition">
                  100% Refund Policy SLA
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('terms')} className="hover:text-white transition">
                  Email Delivery Timeline (30 Min)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('terms')} className="hover:text-white transition">
                  Stripe Payment Terms
                </button>
              </li>
            </ul>

            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Guaranteed SLA</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 AK TRAVELTOURS Inc. All rights reserved. Registered Travel Tour Operator &amp; GSMA RSP Reseller.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <CreditCard className="w-3.5 h-3.5 text-blue-400" />
              <span>Stripe 256-Bit SSL</span>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Email Delivery &lt; 30m</span>
            </span>
          </div>
        </div>

      </div>

    </footer>
  );
};
