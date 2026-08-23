import React from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Award, 
  Clock, 
  Users, 
  MapPin, 
  PhoneCall, 
  Mail, 
  Sparkles, 
  CheckCircle2,
  Compass,
  ArrowRight,
  Plane,
  CreditCard
} from 'lucide-react';
import { PageTab } from '../types';

interface AboutViewProps {
  onNavigateTab: (tab: PageTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-900 space-y-12">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
          <Plane className="w-3.5 h-3.5 text-blue-600 -rotate-45" />
          <span>About AK TRAVELTOURS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Connecting Travelers Globally with Ease
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Founded by global adventurers and telecom engineers, AK TRAVELTOURS provides premium curated tour packages and instant travel eSIMs with 30-minute email delivery across 150+ countries.
        </p>
      </div>

      {/* Core Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Destinations Covered', val: '150+ Countries', sub: 'Instant 5G/4G Roaming' },
          { label: 'Happy Travelers', val: '240,000+', sub: 'Worldwide Customers' },
          { label: 'Email Delivery SLA', val: '< 30 Minutes', sub: 'Admin Quality Checked' },
          { label: 'Customer Satisfaction', val: '99.8%', sub: '24/7 Live Support' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 block">{stat.val}</span>
            <span className="text-xs font-bold text-slate-900 block mt-1">{stat.label}</span>
            <span className="text-[11px] text-slate-500">{stat.sub}</span>
          </div>
        ))}
      </div>

      {/* Mission & Standards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Our Telecom Commitment</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We partner directly with leading Tier-1 carriers worldwide including NTT Docomo, Vodafone, AT&amp;T, Orange, and Singtel. Every eSIM is quality-reviewed and dispatched to your email within 30 minutes of confirmed Stripe checkout.
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero passport or identity photo uploads required</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Personal Hotspot &amp; Tethering fully supported</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Money-back guarantee if eSIM fails to activate</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Curated Tour Packages</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every tour package organized by AK TRAVELTOURS includes boutique hotel accommodations, certified English-speaking local guides, seamless airport transfers, and a complimentary 5G travel eSIM so you can stay in touch from day one.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('tours')}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition"
            >
              <span>Explore Tour Packages</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Global Offices */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-xl font-black text-slate-900">Worldwide Headquarters &amp; Operations</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { city: 'New York HQ', country: 'United States', address: '450 Lexington Ave, Suite 2200, NY 10017' },
            { city: 'London Office', country: 'United Kingdom', address: '1 Canada Square, Canary Wharf, E14 5AA' },
            { city: 'Tokyo Hub', country: 'Japan', address: 'Roppongi Hills Mori Tower, Minato-ku, Tokyo' },
            { city: 'Dubai Bureau', country: 'United Arab Emirates', address: 'DIFC Gate Precinct 4, Level 5, Dubai' },
          ].map((loc, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{loc.city}</span>
              </div>
              <p className="text-slate-500 text-[11px]">{loc.country}</p>
              <p className="text-slate-600 text-[11px] pt-1">{loc.address}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
