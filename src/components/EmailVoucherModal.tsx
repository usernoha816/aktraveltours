import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  Mail, 
  ShieldCheck, 
  Smartphone, 
  HelpCircle,
  Clock,
  Sparkles,
  Plane,
  CreditCard
} from 'lucide-react';
import { ProvisionedEsim } from '../types';

interface EmailVoucherModalProps {
  esim: ProvisionedEsim | null;
  onClose: () => void;
}

export const EmailVoucherModal: React.FC<EmailVoucherModalProps> = ({ esim, onClose }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!esim) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl shadow-2xl text-slate-900 overflow-hidden relative my-6 animate-in fade-in zoom-in-95">
        
        {/* Top App Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="font-bold text-sm text-white">Email Delivery Certificate Preview</h2>
              <p className="text-[11px] text-slate-400">
                Dispatched to <strong className="text-white">{esim.customerEmail}</strong> within 30 minutes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Email Envelope Container */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto bg-slate-50/50">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Email Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow">
                  <Plane className="w-5 h-5 -rotate-45" />
                </div>
                <div>
                  <h1 className="font-black text-lg text-slate-900">AK TRAVELTOURS</h1>
                  <p className="text-xs text-slate-500">Official eSIM Profile &amp; Roaming Voucher</p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-slate-400 block font-mono">ORDER #{esim.orderNumber}</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                  ✓ Verified by Admin
                </span>
              </div>
            </div>

            {/* Greeting */}
            <div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Dear <strong>{esim.customerName || 'Valued Traveler'}</strong>,
              </p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Thank you for booking your travel data with <strong>AK TRAVELTOURS</strong>. Your payment has been confirmed via Stripe and your high-speed GSMA telecom profile is ready.
              </p>
            </div>

            {/* QR Code & Activation Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
              
              {/* QR Image */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 text-center">
                {esim.qrCodeDataUrl ? (
                  <img
                    src={esim.qrCodeDataUrl}
                    alt="eSIM Activation QR"
                    className="w-44 h-44 mx-auto rounded-lg"
                  />
                ) : (
                  <div className="w-44 h-44 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">
                    Loading QR...
                  </div>
                )}
                <span className="text-[10px] font-bold text-slate-500 mt-2 block">
                  Scan via Phone Camera / Settings
                </span>
              </div>

              {/* eSIM Details & Manual LPA Details */}
              <div className="flex-1 space-y-3 w-full text-xs">
                
                <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Destination</span>
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>{esim.flagEmoji}</span>
                      <span>{esim.destinationName}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Plan Allowance</span>
                    <span className="font-bold text-blue-600 text-sm">
                      {esim.planTier.dataAllowance} ({esim.planTier.durationDays} Days)
                    </span>
                  </div>
                </div>

                {/* SM-DP+ Address */}
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">SM-DP+ Address:</span>
                  <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200 mt-0.5">
                    <span className="font-mono text-[11px] text-slate-800 truncate">{esim.smdpAddress}</span>
                    <button
                      onClick={() => handleCopy(esim.smdpAddress, 'smdp')}
                      className="text-blue-600 hover:text-blue-800 ml-2 shrink-0 font-bold text-[11px]"
                    >
                      {copiedField === 'smdp' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Activation / Matching Code */}
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Activation Code (Matching ID):</span>
                  <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200 mt-0.5">
                    <span className="font-mono text-[11px] text-slate-800 truncate">{esim.matchingId}</span>
                    <button
                      onClick={() => handleCopy(esim.matchingId, 'matching')}
                      className="text-blue-600 hover:text-blue-800 ml-2 shrink-0 font-bold text-[11px]"
                    >
                      {copiedField === 'matching' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Full LPA String */}
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Full LPA String:</span>
                  <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200 mt-0.5">
                    <span className="font-mono text-[10px] text-slate-600 truncate">{esim.lpaString}</span>
                    <button
                      onClick={() => handleCopy(esim.lpaString, 'lpa')}
                      className="text-blue-600 hover:text-blue-800 ml-2 shrink-0 font-bold text-[11px]"
                    >
                      {copiedField === 'lpa' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Quick 3-Step Setup Instructions */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Installation Instructions:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">📱 Apple iOS:</span>
                  <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
                    <li>Go to <strong>Settings</strong> &gt; <strong>Cellular / Mobile Data</strong>.</li>
                    <li>Tap <strong>Add eSIM</strong> &gt; <strong>Use QR Code</strong>.</li>
                    <li>Scan the QR code above and label it <em>"AK Travel"</em>.</li>
                    <li>Turn on <strong>Data Roaming</strong> when arriving in {esim.destinationName}.</li>
                  </ol>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">🤖 Android / Samsung / Pixel:</span>
                  <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
                    <li>Go to <strong>Settings</strong> &gt; <strong>Connections</strong> &gt; <strong>SIM Manager</strong>.</li>
                    <li>Tap <strong>Add Mobile Plan / Add eSIM</strong>.</li>
                    <li>Scan the QR code or enter manual LPA codes.</li>
                    <li>Enable <strong>Data Roaming</strong> on arrival.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Footer Support Info */}
            <div className="pt-4 border-t border-slate-200 text-center text-slate-500 text-xs space-y-1">
              <p>
                Need assistance while traveling? Contact 24/7 support at{' '}
                <strong className="text-blue-600">support@aktraveltours.com</strong> or WhatsApp{' '}
                <strong className="text-emerald-700">+44 7441 421073</strong>
              </p>
              <p className="text-[11px] text-slate-400">
                AK TRAVELTOURS LTD • London, United Kingdom • GSMA RSP Certified Partner
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
