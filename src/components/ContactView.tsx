import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Send, 
  CheckCircle2, 
  HelpCircle,
  ShieldCheck,
  Smartphone,
  CreditCard
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    issueType: 'activation',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-900 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
          <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
          <span>24/7 Global Roaming Concierge</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          We&apos;re Here to Help Your Journey
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Have questions about your travel eSIM QR code delivery, Stripe payment, or tour reservation? Our multi-lingual support engineers are on standby 24 hours a day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Channels */}
        <div className="space-y-4">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-black text-base text-slate-900">Email Roaming Desk</h3>
            <p className="text-xs text-slate-500">Official inquiries &amp; eSIM QR delivery questions:</p>
            <p className="text-xs font-mono font-bold text-blue-600">support@aktraveltours.com</p>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold inline-block">
              Average reply &lt; 8 minutes
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="font-black text-base text-slate-900">International Hotline</h3>
            <p className="text-xs text-slate-500">Toll-free emergency traveler assistance:</p>
            <p className="text-xs font-mono font-bold text-slate-900">+1 (800) 792-AKTOUR / +1 (800) 792-2586</p>
            <span className="text-[11px] text-slate-500 block">Available 24 hours a day, 7 days a week</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-black text-base text-slate-900">30-Minute Delivery SLA</h3>
            <p className="text-xs text-slate-500">
              Orders confirmed by admin are dispatched via email within 30 minutes. If you have not received your email, please check your spam folder or contact us.
            </p>
          </div>

        </div>

        {/* Support Ticket Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
          {ticketSubmitted ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-black text-slate-900">Ticket Submitted Successfully!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                We have assigned your inquiry to our priority telecom dispatch queue. An engineer will follow up with you at <strong>{formData.email}</strong> shortly.
              </p>
              <button
                onClick={() => setTicketSubmitted(false)}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-black text-slate-900">Submit a Priority Support Request</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. David Miller"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="david@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Order Ref (Optional)</label>
                  <input
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    placeholder="e.g. AK-9X2L8M1Q"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Topic</label>
                  <select
                    value={formData.issueType}
                    onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="activation">eSIM QR Code Email Delivery</option>
                    <option value="setup">APN &amp; Network Setup Guide</option>
                    <option value="tour">Tour Booking &amp; Reservation</option>
                    <option value="payment">Stripe Payment Inquiry</option>
                    <option value="refund">100% SLA Refund Request</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your issue or destination questions..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition"
              >
                <Send className="w-4 h-4" />
                <span>Submit Support Ticket</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
