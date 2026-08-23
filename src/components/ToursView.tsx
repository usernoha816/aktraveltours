import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Check, 
  Sparkles, 
  Wifi, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Mail,
  CreditCard
} from 'lucide-react';
import { TourPackage, CurrencyCode } from '../types';
import { TOURS_DATA } from '../data/toursData';
import { formatPrice } from '../utils/formatters';

interface ToursViewProps {
  currency: CurrencyCode;
  onExploreEsims: () => void;
}

export const ToursView: React.FC<ToursViewProps> = ({ currency, onExploreEsims }) => {
  const [selectedTour, setSelectedTour] = useState<TourPackage | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-900 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          <span>Curated Travel Experiences + Complimentary 5G eSIM</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Signature Tour Packages
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Hand-crafted worldwide journeys with verified local guides, 4 &amp; 5-star accommodations, and a complimentary high-speed travel eSIM with QR delivery directly to your email.
        </p>
      </div>

      {/* Tour Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {TOURS_DATA.map((tour) => (
          <div
            key={tour.id}
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:shadow-blue-900/5 transition duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Tour Image Header */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <img
                  src={tour.featuredImage}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-black px-3 py-1 rounded-full shadow-sm">
                    {tour.flagEmoji} {tour.destination}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Wifi className="w-3 h-3" />
                    <span>{tour.includedEsimData}</span>
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-black text-xl leading-tight drop-shadow-sm">{tour.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-200 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{tour.durationDays} Days</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{tour.groupSize}</span>
                    </span>
                    <span className="flex items-center gap-1 text-amber-300 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      <span>{tour.rating} ({tour.reviewsCount} reviews)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Highlights & Inclusions */}
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tour Highlights</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tour.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Free Included eSIM Feature Banner */}
                <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-blue-950">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block">Free {tour.includedEsimData} Included</span>
                    <span className="text-[11px] text-blue-800">
                      Your complimentary eSIM QR code is automatically emailed upon tour confirmation.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Pricing & Booking */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Price Per Traveler</span>
                <span className="text-2xl font-black text-slate-900">
                  {formatPrice(tour.pricePerPersonUsd, currency)}
                </span>
              </div>

              <button
                onClick={() => {
                  setSelectedTour(tour);
                  setBookingSuccess(false);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/20 transition flex items-center gap-1.5"
              >
                <span>View Itinerary &amp; Book</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Tour Detail & Booking Modal */}
      {selectedTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto relative animate-in fade-in">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{selectedTour.destination} Signature Package</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{selectedTour.title}</h2>
              </div>
              <button
                onClick={() => setSelectedTour(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-black text-lg text-emerald-950">Reservation Request Received!</h3>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                  Our travel concierge will confirm your itinerary dates within 2 hours. Your complimentary <strong>{selectedTour.includedEsimData}</strong> will be emailed within 30 minutes of reservation confirmation!
                </p>
                <button
                  onClick={() => setSelectedTour(null)}
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <>
                {/* Day by Day Itinerary */}
                <div className="space-y-3">
                  <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Daily Itinerary Outline</h3>
                  <div className="space-y-2.5">
                    {selectedTour.itinerary.map((day) => (
                      <div key={day.day} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <div className="font-bold text-slate-900 mb-0.5">
                          Day {day.day}: {day.title}
                        </div>
                        <p className="text-slate-600 text-[11px]">{day.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Included Services */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900">Package Inclusions:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    {selectedTour.includedServices.map((svc, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{svc}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 font-bold text-blue-700">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{selectedTour.includedEsimData} (Free via Email)</span>
                    </div>
                  </div>
                </div>

                {/* Submit Booking */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div>
                    <span className="text-xs text-slate-400 block">Total Package:</span>
                    <span className="text-2xl font-black text-slate-900">
                      {formatPrice(selectedTour.pricePerPersonUsd, currency)}
                    </span>
                  </div>

                  <button
                    onClick={() => setBookingSuccess(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/30 transition flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Reserve &amp; Claim Free eSIM</span>
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
