import React, { useState } from 'react';
import { 
  Calculator, 
  MapPin, 
  Clock, 
  Sparkles, 
  Video, 
  MessageSquare, 
  Music, 
  Navigation, 
  Globe, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Mail
} from 'lucide-react';

interface DataCalculatorProps {
  onRecommendationSelected: (gb: number, duration: number) => void;
}

export const DataCalculator: React.FC<DataCalculatorProps> = ({ onRecommendationSelected }) => {
  const [tripDays, setTripDays] = useState(10);
  const [mapHours, setMapHours] = useState(1.5);
  const [socialHours, setSocialHours] = useState(1.0);
  const [videoMinutes, setVideoMinutes] = useState(30);
  const [messagingHours, setMessagingHours] = useState(2.0);

  // Daily MB calculations
  const dailyMapsMb = mapHours * 25; // ~25MB/hour
  const dailySocialMb = socialHours * 120; // ~120MB/hour
  const dailyVideoMb = (videoMinutes / 60) * 800; // ~800MB/hour HD
  const dailyMessagingMb = messagingHours * 10; // ~10MB/hour

  const totalDailyMb = dailyMapsMb + dailySocialMb + dailyVideoMb + dailyMessagingMb + 50; // 50MB background
  const totalTripGb = Math.ceil((totalDailyMb * tripDays) / 1024);

  // Recommended plan package
  const getRecommendation = () => {
    if (totalTripGb <= 3) return { allowance: '3 GB - 5 GB Plan', targetGb: 5, duration: tripDays <= 7 ? 7 : 10, type: 'fixed' };
    if (totalTripGb <= 8) return { allowance: '10 GB Plan', targetGb: 10, duration: tripDays <= 10 ? 10 : 30, type: 'fixed' };
    if (totalTripGb <= 18) return { allowance: '20 GB Plan', targetGb: 20, duration: 30, type: 'fixed' };
    return { allowance: 'Unlimited 5G Data Plan', targetGb: -1, duration: tripDays, type: 'unlimited' };
  };

  const rec = getRecommendation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-900 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
          <Calculator className="w-3.5 h-3.5 text-blue-600" />
          <span>Interactive Bandwidth Estimator</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Trip Data Calculator
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Estimate exactly how many gigabytes you will need for navigation, social media, video calls, and messaging on your trip.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-8">
        
        {/* Sliders Grid */}
        <div className="space-y-6">
          
          {/* Trip duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Trip Duration (Days)</span>
              </span>
              <span className="text-blue-600 font-black text-sm">{tripDays} Days</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={tripDays}
              onChange={(e) => setTripDays(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1 Day</span>
              <span>7 Days</span>
              <span>10 Days</span>
              <span>30 Days</span>
            </div>
          </div>

          {/* Maps / Navigation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-slate-700">
                <Navigation className="w-4 h-4 text-emerald-600" />
                <span>Google Maps / City Navigation (Hours/Day)</span>
              </span>
              <span className="text-slate-900 font-bold">{mapHours} hrs/day</span>
            </div>
            <input
              type="range"
              min={0}
              max={6}
              step={0.5}
              value={mapHours}
              onChange={(e) => setMapHours(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Social Media & Instagram */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-slate-700">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>Social Media &amp; Browsing (Hours/Day)</span>
              </span>
              <span className="text-slate-900 font-bold">{socialHours} hrs/day</span>
            </div>
            <input
              type="range"
              min={0}
              max={6}
              step={0.5}
              value={socialHours}
              onChange={(e) => setSocialHours(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Video Streaming */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-slate-700">
                <Video className="w-4 h-4 text-rose-600" />
                <span>YouTube / Netflix / Video Calls (Minutes/Day)</span>
              </span>
              <span className="text-slate-900 font-bold">{videoMinutes} mins/day</span>
            </div>
            <input
              type="range"
              min={0}
              max={180}
              step={15}
              value={videoMinutes}
              onChange={(e) => setVideoMinutes(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

        </div>

        {/* Recommended Package Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">
                Calculated Consumption
              </span>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                Estimated Need: <span className="text-blue-600">~{totalTripGb} GB</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Recommended Tier: <strong>{rec.allowance}</strong> ({rec.duration} Days)
              </p>
            </div>

            <button
              onClick={() => onRecommendationSelected(rec.targetGb, rec.duration)}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-2xl text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 shrink-0"
            >
              <span>View {rec.allowance}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-3 border-t border-blue-200/80 flex items-center gap-2 text-xs text-blue-900">
            <Mail className="w-4 h-4 text-blue-700 shrink-0" />
            <span>eSIM QR voucher dispatched to your email within 30 minutes after admin review.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
