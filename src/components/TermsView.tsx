import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  Mail, 
  Lock,
  Clock,
  Plane,
  CreditCard
} from 'lucide-react';

export const TermsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-900 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>Policies, Terms of Service &amp; 100% Refund SLA</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Terms of Service &amp; Consumer SLA
        </h1>
        <p className="text-xs text-slate-500">Last updated: August 2026 • AK TRAVELTOURS Global</p>
      </div>

      {/* 100% Refund Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-900/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-emerald-950">100% Money-Back Satisfaction Guarantee</h2>
            <p className="text-xs text-emerald-800">Your travel peace of mind is our highest priority.</p>
          </div>
        </div>
        <p className="text-xs text-emerald-900 leading-relaxed">
          If your purchased eSIM profile encounters network incompatibility or fails to connect in your covered destination due to telecom service failure, AK TRAVELTOURS will issue a full 100% refund to your original Stripe payment card or provide an alternative carrier profile at no cost.
        </p>
      </div>

      {/* Core Policies */}
      <div className="space-y-6 text-xs sm:text-sm text-slate-700 bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
        
        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" />
            <span>1. Email Delivery SLA (Within 30 Minutes)</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All digital travel eSIM QR codes and LPA installation profiles are delivered <strong>strictly via Email</strong>. Upon successful payment processing through Stripe, your order enters a brief telecom verification and admin review queue. Confirmed orders are dispatched directly to the recipient email provided during checkout within 30 minutes.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span>2. Stripe Payment Security &amp; Currency Conversion</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Payments are securely processed through Stripe with end-to-end 256-bit SSL encryption. We accept Visa, Mastercard, American Express, and Discover. Foreign currency conversions shown on our site are calculated live based on standard bank interbank exchange rates.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>3. Validity &amp; Plan Activation</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The validity period (e.g. 7 Days, 10 Days, 30 Days) begins automatically only when your eSIM connects to a supported roaming cell tower in your destination country. You may install the profile prior to departure without using up your active validity days.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            <span>4. Privacy &amp; Data Protection</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            AK TRAVELTOURS never sells or distributes your personal travel data. We do not require identity passport uploads (eKYC) for standard data roaming packages in compliance with regional telecommunications regulations.
          </p>
        </section>

      </div>

    </div>
  );
};
