import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Wifi, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Check,
  Mail,
  Sparkles,
  Signal
} from 'lucide-react';
import { Destination, EsimPlanTier, CurrencyCode } from '../types';
import { DESTINATIONS_DATA } from '../data/destinations';
import { formatPrice } from '../utils/formatters';

interface UnlimitedPlansViewProps {
  currency: CurrencyCode;
  onAddToCart: (dest: Destination, plan: EsimPlanTier) => void;
  onDirectBuy: (dest: Destination, plan: EsimPlanTier) => void;
}

export const UnlimitedPlansView: React.FC<UnlimitedPlansViewProps> = ({
  currency,
  onAddToCart,
  onDirectBuy,
}) => {
  // Collect all destinations with unlimited plans
  const unlimitedDestinations: { dest: Destination; plan: EsimPlanTier }[] = [];

  DESTINATIONS_DATA.forEach((dest) => {
    dest.plans.forEach((plan) => {
      if (plan.dataAllowance === 'Unlimited' || plan.dataGb === -1) {
        unlimitedDestinations.push({ dest, plan });
      }
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-900 space-y-10">
      
      {/* Hero Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-xs">
          <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span>True Unlimited 5G Data Roaming • Zero Speed Throttling</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Unlimited Travel eSIM Plans
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Stream, navigate, upload 4K video, and work remotely without ever worrying about running out of megabytes. Delivery strictly to your email within 30 minutes after admin review.
        </p>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Uncapped 5G High Speed</h4>
            <p className="text-[11px] text-slate-500">Premium Tier-1 carrier priority data</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Mobile Hotspot Allowed</h4>
            <p className="text-[11px] text-slate-500">Share connection with laptops &amp; tablets</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Delivered via Email</h4>
            <p className="text-[11px] text-slate-500">QR dispatched within 30 min after review</p>
          </div>
        </div>
      </div>

      {/* Unlimited Plans Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {unlimitedDestinations.map(({ dest, plan }) => (
          <div
            key={`${dest.id}-${plan.id}`}
            className="bg-white border border-slate-200 hover:border-amber-400 rounded-3xl p-6 shadow-xs hover:shadow-xl hover:shadow-amber-900/5 transition duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{dest.flagEmoji}</span>
                  <div>
                    <h3 className="font-black text-lg text-slate-900 group-hover:text-amber-600 transition">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-slate-500">{dest.networks.join(' • ')}</p>
                  </div>
                </div>

                <span className="bg-amber-100 text-amber-950 font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Unlimited
                </span>
              </div>

              {/* Plan Specs */}
              <div className="bg-amber-50/60 border border-amber-200/80 p-4 rounded-2xl mb-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Trip Duration:</span>
                  <span className="text-amber-900 font-black">{plan.durationDays} Days</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Speed:</span>
                  <span className="text-blue-600 font-bold">{dest.speedTier}</span>
                </div>
                {plan.unlimitedFup && (
                  <p className="text-[11px] text-amber-900 bg-white p-2 rounded-lg border border-amber-200/60 mt-1">
                    {plan.unlimitedFup}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Unlimited High Speed 5G Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Mobile Hotspot &amp; Tethering Supported</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Email delivery within 30 min after admin review</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Price</span>
                <span className="text-2xl font-black text-slate-900">
                  {formatPrice(plan.priceUsd, currency)}
                </span>
              </div>

              <button
                onClick={() => onDirectBuy(dest, plan)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-amber-600 active:bg-slate-950 text-white font-black rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
