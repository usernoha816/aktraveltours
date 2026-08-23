import React from 'react';
import { 
  Layers, 
  Globe2, 
  CheckCircle2, 
  Wifi, 
  ArrowRight, 
  Zap, 
  Sparkles 
} from 'lucide-react';
import { DESTINATIONS_DATA } from '../data/destinations';
import { Destination, CurrencyCode } from '../types';
import { formatPrice } from '../utils/formatters';

interface RegionalPlansViewProps {
  currency: CurrencyCode;
  onSelectDestination: (dest: Destination) => void;
}

export const RegionalPlansView: React.FC<RegionalPlansViewProps> = ({
  currency,
  onSelectDestination,
}) => {
  const regionalPacks = DESTINATIONS_DATA.filter(
    (d) => d.coverageType === 'regional' || d.coverageType === 'global'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
      
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-cyan-400 text-xs font-semibold mb-3 border border-slate-700">
          <Layers className="w-3.5 h-3.5" />
          <span>Multi-Country Multi-Roam</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Cross-Border Regional &amp; Global eSIMs
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Crossing multiple borders? Install one single eSIM profile and enjoy seamless automatic 5G network switching across tens of countries.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {regionalPacks.map((pack) => (
          <div
            key={pack.id}
            onClick={() => onSelectDestination(pack)}
            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 sm:p-7 flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/5 group relative overflow-hidden"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3.5">
                  <span className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">
                    {pack.flagEmoji}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-white text-lg sm:text-xl group-hover:text-emerald-400 transition">
                      {pack.name}
                    </h3>
                    <span className="text-xs text-cyan-400 font-semibold">
                      {pack.coverageType === 'global' ? '140+ Countries Worldwide' : `${pack.countriesIncludedCount} Countries Included`}
                    </span>
                  </div>
                </div>

                <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-0.5 rounded border border-emerald-500/30">
                  {pack.speedTier}
                </span>
              </div>

              {/* Highlights */}
              <ul className="space-y-2 mb-6 text-xs text-slate-300">
                {pack.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {/* Countries snippet */}
              {pack.countriesIncludedList && (
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 mb-6 line-clamp-2">
                  <strong className="text-slate-200">Included destinations: </strong>
                  {pack.countriesIncludedList.join(', ')}
                </div>
              )}
            </div>

            {/* Bottom pricing */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-auto">
              <div>
                <span className="text-xs text-slate-400 block">Plans starting at</span>
                <span className="text-xl font-black text-emerald-400">
                  {formatPrice(pack.startingPriceUsd, currency)}
                </span>
              </div>

              <button className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md group-hover:bg-emerald-400 transition">
                <span>View All Plans</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
