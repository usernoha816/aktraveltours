import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Smartphone, 
  Mail, 
  Printer, 
  ShieldCheck, 
  Zap, 
  X,
  Sparkles,
  Plane,
  Clock
} from 'lucide-react';
import { ProvisionedEsim } from '../types';

interface AutomatedDeliveryModalProps {
  esim: ProvisionedEsim | null;
  onClose: () => void;
  onViewInWallet: () => void;
  onOpenEmailPreview: (esim: ProvisionedEsim) => void;
}

export const AutomatedDeliveryModal: React.FC<AutomatedDeliveryModalProps> = ({
  esim,
  onClose,
  onViewInWallet,
  onOpenEmailPreview,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeOsTab, setActiveOsTab] = useState<'ios' | 'samsung' | 'pixel'>('ios');

  useEffect(() => {
    if (esim) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#38bdf8', '#10b981', '#f59e0b'],
        });
      } catch (e) {
        // ignore
      }
    }
  }, [esim]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!esim) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-md overflow-y-auto">
      <div 
        id="automated-delivery-modal"
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl shadow-2xl text-slate-900 overflow-hidden relative my-6 animate-in fade-in zoom-in-95"
      >
        {/* Top Header Bar */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-bold shadow">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">eSIM Profile &amp; QR Voucher</h2>
                <span className="bg-blue-950 text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-700">
                  AK TRAVELTOURS
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Order Ref: <strong className="font-mono text-white">{esim.orderNumber}</strong> • Recipient: {esim.customerEmail}
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
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 text-xs text-amber-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Delivery strictly via Email:</strong> QR code and LPA codes dispatched to <strong>{esim.customerEmail}</strong> within 30 minutes after admin review.
            </span>
          </div>
          <span className="text-[10px] bg-amber-200/70 text-amber-950 font-bold px-2 py-0.5 rounded hidden sm:inline">
            100% SLA Guarantee
          </span>
        </div>

        {/* Modal Main Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Email Delivery Status Banner */}
            <div className="md:col-span-5 flex flex-col items-center bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{esim.flagEmoji}</span>
                <span className="font-bold text-slate-900 text-base">{esim.destinationName}</span>
                <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                  {esim.planTier.dataAllowance}
                </span>
              </div>

              {/* Email Delivery Security Notice */}
              <div className="w-full p-5 bg-white rounded-2xl shadow-sm mb-4 border border-blue-200 text-center space-y-3">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-blue-100">
                  <Mail className="w-7 h-7" />
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Dispatched via Email
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-2">
                    Delivered via support@aktraveltours.com
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    No QR code is displayed on-screen for security. Your official eSIM profile and QR voucher are sent directly to:
                  </p>
                  <p className="text-xs font-mono font-bold text-blue-900 mt-1.5 break-all bg-slate-50 p-2 rounded-xl border border-slate-200">
                    {esim.customerEmail}
                  </p>
                </div>
              </div>

              {/* Email Voucher Preview & Print */}
              <div className="w-full grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => onOpenEmailPreview(esim)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl border border-blue-600 flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Voucher</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl border border-slate-300 flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Print Details</span>
                </button>
              </div>

            </div>

            {/* Right Column: Order Details & Installation Instructions */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Order Reference Card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    eSIM Dispatch Information
                  </h3>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ✓ Paid via Stripe
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Order Number</span>
                    <span className="font-mono font-bold text-slate-800">{esim.orderNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Sender Email</span>
                    <span className="font-mono font-bold text-blue-700">support@aktraveltours.com</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Data Allowance</span>
                    <span className="font-bold text-slate-800">{esim.planTier.dataAllowance}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Validity</span>
                    <span className="font-bold text-slate-800">{esim.planTier.durationDays} Days</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>Delivery Window:</strong> Your high-resolution QR voucher and APN profile instructions are guaranteed to arrive in your email within <strong>30 minutes</strong>.
                  </div>
                </div>
              </div>

              {/* Step-by-Step OS Installation Tabs */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span>How to Install on Your Phone:</span>
                  </span>
                  
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
                    <button
                      onClick={() => setActiveOsTab('ios')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition ${
                        activeOsTab === 'ios' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      iPhone (iOS)
                    </button>
                    <button
                      onClick={() => setActiveOsTab('samsung')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition ${
                        activeOsTab === 'samsung' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Samsung
                    </button>
                    <button
                      onClick={() => setActiveOsTab('pixel')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition ${
                        activeOsTab === 'pixel' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Google Pixel
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5">
                  {activeOsTab === 'ios' && (
                    <ol className="space-y-1 list-decimal list-inside text-slate-700">
                      <li>Go to <strong>Settings</strong> &gt; <strong>Cellular / Mobile Service</strong>.</li>
                      <li>Tap <strong>Add eSIM</strong> &gt; Select <strong>Use QR Code</strong>.</li>
                      <li>Scan the QR code displayed above.</li>
                      <li>Label the plan as <em>&quot;AK Travel Data&quot;</em> and turn <strong>Data Roaming ON</strong> when arriving at your destination.</li>
                    </ol>
                  )}

                  {activeOsTab === 'samsung' && (
                    <ol className="space-y-1 list-decimal list-inside text-slate-700">
                      <li>Open <strong>Settings</strong> &gt; <strong>Connections</strong> &gt; <strong>SIM manager</strong>.</li>
                      <li>Tap <strong>Add eSIM</strong> &gt; <strong>Scan QR code</strong>.</li>
                      <li>Select AK Travel for Cellular Data and enable <strong>Data Roaming</strong>.</li>
                    </ol>
                  )}

                  {activeOsTab === 'pixel' && (
                    <ol className="space-y-1 list-decimal list-inside text-slate-700">
                      <li>Open <strong>Settings</strong> &gt; <strong>Network &amp; internet</strong> &gt; <strong>SIMs (+)</strong>.</li>
                      <li>Tap <strong>Download a SIM instead</strong> &gt; Scan QR code.</li>
                      <li>Turn on Mobile Data and enable <strong>Roaming</strong>.</li>
                    </ol>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Profile saved in your AK TRAVELTOURS Wallet</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onViewInWallet();
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition"
          >
            <Smartphone className="w-4 h-4" />
            <span>View in My eSIMs Wallet</span>
          </button>
        </div>

      </div>
    </div>
  );
};
