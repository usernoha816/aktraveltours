import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Globe, 
  CheckCircle2, 
  Compass, 
  ArrowRight,
  Calculator,
  Mail,
  CreditCard,
  Lock,
  Plane
} from 'lucide-react';
import { Destination, DurationFilterType, PageTab } from '../types';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectDestination: (dest: Destination) => void;
  destinations: Destination[];
  onOpenQuickDemo: () => void;
  onOpenDataCalc: () => void;
  onSelectDurationFilter: (df: DurationFilterType) => void;
  activeDurationFilter: DurationFilterType;
  onNavigateTab: (tab: PageTab) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  onSelectDestination,
  destinations,
  onOpenQuickDemo,
  onOpenDataCalc,
  onSelectDurationFilter,
  activeDurationFilter,
  onNavigateTab,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const matchingDestinations = destinations
    .filter((d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.popularCity?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5);

  const durationButtons: { id: DurationFilterType; label: string; sub: string; badge?: string }[] = [
    { id: 'all', label: 'All Plans', sub: '150+ Countries' },
    { id: '7days', label: '7 Days Plans', sub: 'Short Trips & Getaways' },
    { id: '10days', label: '10 Days Plans', sub: 'Standard Vacation' },
    { id: '30days', label: '30 Days Plans', sub: 'Extended Travel & Nomads' },
    { id: 'unlimited', label: 'Unlimited Data', sub: 'No Caps 5G Speeds', badge: 'High Speed' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-white pt-10 pb-12 border-b border-slate-200">
      
      {/* Decorative subtle ambient travel grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tag */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200 shadow-xs text-xs font-bold text-blue-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AK TRAVELTOURS • Global eSIM &amp; Tour Marketplace</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-xs">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Email Delivery within 30 Minutes after Admin Review</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Stay Connected Worldwide with <br className="hidden sm:inline" />
            <span className="text-blue-600">High-Speed Travel eSIMs</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Choose from fixed <strong>7-Day</strong>, <strong>10-Day</strong>, <strong>30-Day</strong>, or <strong>Unlimited 5G Data Plans</strong> across 150+ countries. Seamless Stripe credit card checkout with delivery strictly to your email within 30 minutes after admin review.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="max-w-2xl mx-auto mt-8 relative">
          <div className="bg-white rounded-2xl p-2 shadow-xl shadow-slate-200/70 border border-slate-300 flex items-center gap-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>

            <input
              id="input-main-destination-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search destination (e.g. Japan, Europe, United States, Thailand, Bali)..."
              className="flex-1 bg-transparent py-2.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-700 px-2 font-medium"
              >
                Clear
              </button>
            )}

            <button
              onClick={() => {
                if (matchingDestinations.length > 0) {
                  onSelectDestination(matchingDestinations[0]);
                }
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-600/30 transition flex items-center gap-1.5 shrink-0"
            >
              <span>Explore Plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {isFocused && searchQuery.length > 1 && matchingDestinations.length > 0 && (
            <div 
              className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in"
              onMouseLeave={() => setIsFocused(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Matching Destinations
              </div>
              {matchingDestinations.map((dest) => (
                <div
                  key={dest.id}
                  onClick={() => {
                    onSelectDestination(dest);
                    setIsFocused(false);
                    setSearchQuery('');
                  }}
                  className="p-3 hover:bg-blue-50/70 rounded-xl cursor-pointer flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{dest.flagEmoji}</span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-600">
                        {dest.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {dest.popularCity || 'Instant 5G Coverage'} • {dest.speedTier}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">From</span>
                    <span className="font-bold text-blue-600 text-xs sm:text-sm">
                      ${dest.startingPriceUsd.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Duration Filter Pills */}
        <div className="mt-8">
          <div className="text-center text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
            Filter Plans By Trip Duration &amp; Data Type
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {durationButtons.map((btn) => {
              const isActive = activeDurationFilter === btn.id;

              return (
                <button
                  key={btn.id}
                  onClick={() => onSelectDurationFilter(btn.id)}
                  className={`px-4 py-3 rounded-2xl transition text-left flex items-center gap-3 border shadow-xs ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="shrink-0">
                    {btn.id === 'unlimited' ? (
                      <Zap className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-amber-500'}`} />
                    ) : (
                      <Clock className={`w-4 h-4 ${isActive ? 'text-blue-200' : 'text-slate-400'}`} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs sm:text-sm">{btn.label}</span>
                      {btn.badge && (
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                          isActive ? 'bg-white text-blue-900' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {btn.badge}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] block ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                      {btn.sub}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          
          <div className="p-3 bg-white/80 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center">
            <CreditCard className="w-5 h-5 text-blue-600 mb-1.5" />
            <span className="font-bold text-xs text-slate-900">Stripe Payment Gateway</span>
            <span className="text-[11px] text-slate-500">256-Bit SSL Credit Card Checkout</span>
          </div>

          <div className="p-3 bg-white/80 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center">
            <Mail className="w-5 h-5 text-amber-600 mb-1.5" />
            <span className="font-bold text-xs text-slate-900">Delivery Only Via Email</span>
            <span className="text-[11px] text-slate-500">eSIM QR delivered within 30 min</span>
          </div>

          <div className="p-3 bg-white/80 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1.5" />
            <span className="font-bold text-xs text-slate-900">Admin Order Review</span>
            <span className="text-[11px] text-slate-500">Quality-checked GSMA RSP profiles</span>
          </div>

          <div className="p-3 bg-white/80 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center">
            <Zap className="w-5 h-5 text-indigo-600 mb-1.5" />
            <span className="font-bold text-xs text-slate-900">150+ Countries 5G Roaming</span>
            <span className="text-[11px] text-slate-500">Tier-1 Telco networks worldwide</span>
          </div>

        </div>

      </div>

    </section>
  );
};
