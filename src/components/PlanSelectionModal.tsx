import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Zap, 
  ShieldCheck, 
  ShoppingCart, 
  CreditCard, 
  Signal, 
  Wifi, 
  Clock, 
  Mail,
  Info,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Destination, EsimPlanTier, CurrencyCode } from '../types';
import { formatPrice } from '../utils/formatters';

interface PlanSelectionModalProps {
  destination: Destination | null;
  onClose: () => void;
  currency: CurrencyCode;
  onAddToCart: (dest: Destination, plan: EsimPlanTier) => void;
  onDirectBuy: (dest: Destination, plan: EsimPlanTier) => void;
}

export const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({
  destination,
  onClose,
  currency,
  onAddToCart,
  onDirectBuy,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [durationFilter, setDurationFilter] = useState<'all' | '7days' | '10days' | '30days' | 'unlimited'>('all');

  if (!destination) return null;

  const currentSelectedId = selectedPlanId || destination.plans[0]?.id || '';
  const selectedPlan =
    destination.plans.find((p) => p.id === currentSelectedId) ||
    destination.plans[0];

  const filteredPlans = destination.plans.filter((p) => {
    if (durationFilter === '7days') return p.durationDays === 7;
    if (durationFilter === '10days') return p.durationDays === 10;
    if (durationFilter === '30days') return p.durationDays === 30;
    if (durationFilter === 'unlimited') return p.dataAllowance === 'Unlimited' || p.dataGb === -1;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl text-slate-900 overflow-hidden relative my-6 animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl filter drop-shadow-md">{destination.flagEmoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-xl text-white">{destination.name}</h2>
                <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  {destination.speedTier}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {destination.popularCity || 'Instant 5G Roaming'} • Networks: {destination.networks.join(', ')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Email Delivery SLA Notice Ribbon */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 text-xs text-amber-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Delivery strictly via Email:</strong> eSIM QR code sent to your email within <strong>30 minutes</strong> after payment &amp; admin review.
            </span>
          </div>
          <span className="text-[10px] bg-amber-200/80 text-amber-950 font-bold px-2 py-0.5 rounded-md hidden sm:inline">
            100% Guaranteed
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Duration Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Trip Duration &amp; Data Size
            </label>

            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'all', label: 'All Plans' },
                { id: '7days', label: '7 Days' },
                { id: '10days', label: '10 Days' },
                { id: '30days', label: '30 Days' },
                { id: 'unlimited', label: 'Unlimited' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDurationFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex-1 text-center whitespace-nowrap ${
                    durationFilter === tab.id
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Plan Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredPlans.map((plan) => {
              const isSelected = plan.id === selectedPlan.id;
              const isUnlimited = plan.dataAllowance === 'Unlimited' || plan.dataGb === -1;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between relative ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-600 shadow-md shadow-blue-600/10'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {plan.isPopular && (
                    <span className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Most Popular
                    </span>
                  )}
                  {plan.isBestValue && (
                    <span className="absolute -top-2.5 right-3 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Best Value
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-lg text-slate-900 flex items-center gap-1.5">
                        {isUnlimited && <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />}
                        <span>{plan.dataAllowance}</span>
                      </span>
                      <span className="font-black text-blue-600 text-base">
                        {formatPrice(plan.priceUsd, currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{plan.durationDays} Days Duration</span>
                    </div>

                    {plan.unlimitedFup && (
                      <p className="text-[10px] text-slate-500 mt-2 bg-slate-100 p-1.5 rounded-lg">
                        {plan.unlimitedFup}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">APN: {destination.apn}</span>
                    <span className={`font-bold ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                      {isSelected ? '✓ Selected' : 'Choose'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Features Checklist */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-900">eSIM Highlights &amp; Inclusions:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant 5G/4G network auto-connect</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Mobile Personal Hotspot &amp; Tethering</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero Passport / eKYC hassle</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Top-up anytime via My eSIMs Wallet</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Checkout Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Selected Total</span>
            <span className="text-2xl font-black text-slate-900">
              {formatPrice(selectedPlan.priceUsd, currency)}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onAddToCart(destination, selectedPlan);
                onClose();
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl text-xs border border-slate-300 shadow-2xs transition flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={() => {
                onDirectBuy(destination, selectedPlan);
                onClose();
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black rounded-xl text-xs shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
