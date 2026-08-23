import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Mail, 
  ShieldCheck, 
  CreditCard, 
  X, 
  ArrowRight, 
  Sparkles, 
  HelpCircle,
  Smartphone,
  Globe,
  Plane
} from 'lucide-react';
import { ProvisionedEsim } from '../types';

interface OrderConfirmationModalProps {
  esim: ProvisionedEsim | null;
  onClose: () => void;
  onViewEmailPreview?: (esim: ProvisionedEsim) => void;
  onGoToAdminOrders?: () => void;
  onGoToWallet?: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  esim,
  onClose,
}) => {
  // 30-minute delivery countdown timer
  const [secondsRemaining, setSecondsRemaining] = useState(1799); // 29m 59s

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!esim) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div 
        id="order-confirmed-modal"
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl text-slate-900 overflow-hidden relative my-6 animate-in fade-in zoom-in-95"
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-900/50">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg text-white">Order Confirmed!</h2>
                <span className="bg-emerald-900/90 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-700">
                  Stripe Payment Verified
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Order Ref: <strong className="font-mono text-white">{esim.orderNumber}</strong> • {esim.destinationName} Travel eSIM
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[78vh] overflow-y-auto">
          
          {/* Highlighted Delivery Policy Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 border-2 border-blue-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-black text-blue-900 uppercase tracking-wider block">
                  Delivery Method: Strictly via Email
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 leading-snug">
                  Your eSIM QR Code will arrive in your email within 30 minutes
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Thank you for your order! Your payment was successfully processed. For security and quality verification, your high-speed 5G eSIM activation QR code is being generated and will be sent directly to:
                </p>
                <div className="mt-3 inline-flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-blue-200 text-xs font-black text-blue-950 font-mono shadow-xs">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>{esim.customerEmail}</span>
                </div>
              </div>
            </div>

            {/* Countdown timer pill */}
            <div className="bg-white p-3.5 rounded-xl border border-blue-100 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
                <span className="font-bold text-slate-700">Guaranteed Delivery Window:</span>
              </div>
              <div className="font-mono font-black text-xs sm:text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                Within 30 Minutes ({timeFormatted} min)
              </div>
            </div>
          </div>

          {/* Quick Package Details */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{esim.flagEmoji}</span>
              <div>
                <h4 className="font-black text-slate-900 text-sm">{esim.destinationName} Travel eSIM</h4>
                <p className="text-slate-500 text-xs mt-0.5">
                  Plan: <strong>{esim.planTier.dataAllowance}</strong> • Validity: <strong>{esim.planTier.durationDays} Days</strong>
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[11px]">
              Paid via Stripe
            </span>
          </div>

          {/* What to do next steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Next Steps for Activation
            </h4>

            <div className="space-y-2.5">
              <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-start gap-3 text-xs shadow-2xs">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <span className="font-bold text-slate-900 block">Check your inbox &amp; spam folder</span>
                  <span className="text-[11px] text-slate-500 leading-relaxed">
                    Look for an email from <strong>support@aktraveltours.com</strong> containing your high-resolution eSIM QR code and SM-DP+ activation code.
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-start gap-3 text-xs shadow-2xs">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <span className="font-bold text-slate-900 block">Scan QR code on your phone</span>
                  <span className="text-[11px] text-slate-500 leading-relaxed">
                    Go to Settings &gt; Cellular / Mobile Data &gt; Add eSIM and scan the QR code received in your email.
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-start gap-3 text-xs shadow-2xs">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <span className="font-bold text-slate-900 block">Turn on Data Roaming at destination</span>
                  <span className="text-[11px] text-slate-500 leading-relaxed">
                    Once you land at your destination, toggle on Data Roaming to automatically connect to Tier-1 local 5G/4G networks.
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AK TRAVELTOURS 100% Delivery SLA Guarantee</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 transition cursor-pointer"
          >
            <span>Back to Store</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
