import React from 'react';
import { 
  Wifi, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Check, 
  Globe,
  Signal,
  Mail
} from 'lucide-react';
import { Destination, CurrencyCode } from '../types';
import { formatPrice } from '../utils/formatters';

interface DestinationCardProps {
  destination: Destination;
  currency: CurrencyCode;
  onSelect: (dest: Destination) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  currency,
  onSelect,
}) => {
  const hasUnlimited = destination.plans.some((p) => p.dataAllowance === 'Unlimited' || p.dataGb === -1);
  const planDurations = Array.from(new Set(destination.plans.map((p) => p.durationDays))).sort((a: number, b: number) => a - b);

  return (
    <div 
      onClick={() => onSelect(destination)}
      className="bg-white border border-slate-200 hover:border-blue-400 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col justify-between cursor-pointer group text-slate-800"
    >
      <div>
        {/* Top Flags & Speed Tier */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl filter drop-shadow-sm transition group-hover:scale-110">
              {destination.flagEmoji}
            </span>
            <div>
              <h3 className="font-black text-lg text-slate-900 group-hover:text-blue-600 transition">
                {destination.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {destination.popularCity || `${destination.plans.length} Data Plans Available`}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            <Signal className="w-3 h-3 text-blue-600" />
            <span>{destination.speedTier}</span>
          </span>
        </div>

        {/* Available Durations Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {planDurations.map((days) => (
            <span
              key={days}
              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
            >
              {days} Days
            </span>
          ))}

          {hasUnlimited && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-amber-600" />
              <span>Unlimited</span>
            </span>
          )}
        </div>

        {/* Networks & Key Highlights */}
        <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3 mb-4">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Wifi className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{destination.networks.join(' • ')}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>QR Code sent to email within 30 min</span>
          </div>
        </div>
      </div>

      {/* Footer Price & View Action */}
      <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-medium text-slate-400 block uppercase tracking-wider">Starting From</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900">
              {formatPrice(destination.startingPriceUsd, currency)}
            </span>
          </div>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(destination);
          }}
          className="px-4 py-2 bg-slate-900 hover:bg-blue-600 group-hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
        >
          <span>Select Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
