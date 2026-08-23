import React, { useState } from 'react';
import { 
  Smartphone, 
  Search, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Info
} from 'lucide-react';
import { COMPATIBLE_DEVICES_DATABASE } from '../data/destinations';

interface CompatibilityCheckerProps {
  onGoToStore: () => void;
}

export const CompatibilityChecker: React.FC<CompatibilityCheckerProps> = ({ onGoToStore }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<'all' | 'Apple' | 'Samsung' | 'Google' | 'Others'>('all');

  const filteredDevices = COMPATIBLE_DEVICES_DATABASE.filter((dev) => {
    const matchesSearch = dev.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || dev.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-900 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
          <Smartphone className="w-3.5 h-3.5 text-blue-600" />
          <span>Device Compatibility Diagnostic</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Check if Your Smartphone Supports eSIM
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Almost all modern smartphones released after 2018 (iPhone XS/11/12/13/14/15/16, Samsung S20/S21/S22/S23/S24, Google Pixel 4-9) support eSIM.
        </p>
      </div>

      {/* 10-Second Quick Dial Test */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-600/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-black">
            📱
          </div>
          <div>
            <h3 className="text-lg font-black">The 10-Second EID Dial Test</h3>
            <p className="text-xs text-blue-100">Universal check on any iOS or Android phone:</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs space-y-1">
            <span className="font-bold block text-amber-300">Step 1: Open Phone App</span>
            <p className="text-blue-50">Open your device keypad dialer just like you are about to make a call.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs space-y-1">
            <span className="font-bold block text-amber-300">Step 2: Dial *#06#</span>
            <p className="text-blue-50">Type <strong className="font-mono bg-black/20 px-1 rounded">*#06#</strong> on your keypad.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs space-y-1">
            <span className="font-bold block text-amber-300">Step 3: Look for EID Barcode</span>
            <p className="text-blue-50">If an <strong>EID number</strong> (32 digits) appears on your screen, your device is 100% eSIM compatible!</p>
          </div>
        </div>
      </div>

      {/* Database Search */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search phone model (e.g. iPhone 15, S24, Pixel 8)..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Brand Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['all', 'Apple', 'Samsung', 'Google', 'Others'].map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedBrand === b
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b === 'all' ? 'All Brands' : b}
              </button>
            ))}
          </div>
        </div>

        {/* Devices Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDevices.map((dev, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-bold text-slate-900 block">{dev.model}</span>
                <span className="text-[11px] text-slate-500">{dev.brand} • {dev.notes || 'Full eSIM Support'}</span>
              </div>
              <span className="shrink-0 flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                <CheckCircle2 className="w-3 h-3" />
                <span>Compatible</span>
              </span>
            </div>
          ))}
        </div>

        {filteredDevices.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-500">
            No specific models found matching &quot;{searchTerm}&quot;. Please perform the 10-second *#06# dial test above.
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={onGoToStore}
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-sm shadow-lg shadow-blue-600/30 transition inline-flex items-center gap-2"
        >
          <span>Find eSIM Plans for Your Phone</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
