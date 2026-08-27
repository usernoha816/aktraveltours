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
  CreditCard,
  MessageCircle,
  ExternalLink
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
          <span>24/7 Global Traveler &amp; eSIM Support Desk</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          We&apos;re Here to Help Your Journey
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Have questions about your travel eSIM QR code delivery, Stripe payment, or tour reservation? Connect directly with our London headquarters or reach our support team on WhatsApp and Email 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Channels */}
        <div className="space-y-4">
          
          {/* WhatsApp Direct */}
          <a
            href="https://wa.me/447441421073"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-emerald-50/80 hover:bg-emerald-100/90 p-6 rounded-3xl border border-emerald-200 shadow-xs transition group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/30">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full group-hover:bg-emerald-200 transition">
                <span>Chat Now</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
            <h3 className="font-black text-base text-slate-900 mt-3">WhatsApp Support</h3>
            <p className="text-xs text-slate-600">Instant messaging for setup, questions &amp; orders:</p>
            <p className="text-sm font-mono font-bold text-emerald-800 mt-1">+44 7441 421073</p>
            <span className="text-[11px] text-emerald-700 mt-2 block font-medium">
              ⚡ Available 24/7 • Instant Response
            </span>
          </a>

          {/* Email Support */}
          <a
            href="mailto:support@aktraveltours.com"
            className="block bg-white hover:bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-xs transition group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[11px] text-blue-600 font-bold flex items-center gap-1">
                <span>Send Email</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
            <h3 className="font-black text-base text-slate-900 mt-3">Email Roaming Desk</h3>
            <p className="text-xs text-slate-500">Official inquiries &amp; eSIM QR delivery:</p>
            <p className="text-xs font-mono font-bold text-blue-600 mt-1">support@aktraveltours.com</p>
            <span className="text-[11px] text-slate-500 mt-2 block">
              Average reply &lt; 8 minutes
            </span>
          </a>

          {/* Office Address */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-black text-base text-slate-900">Headquarters Address</h3>
            <p className="text-xs text-slate-500">Registered Office &amp; Operations:</p>
            <p className="text-xs font-bold text-slate-900">London, United Kingdom</p>
            <span className="text-[11px] text-slate-500 block">AK TRAVELTOURS LTD • UK Registered Tour &amp; Telecom Operator</span>
          </div>

          {/* Delivery SLA Note */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-black text-base text-slate-900">30-Minute Email Delivery</h3>
            <p className="text-xs text-slate-500">
              Orders confirmed by admin are dispatched via email from <strong>support@aktraveltours.com</strong> within 30 minutes. If you have not received your email, check your spam or WhatsApp us directly.
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
                We have assigned your inquiry to our priority telecom dispatch queue. An engineer will follow up with you at <strong>{formData.email}</strong> shortly, or you can message us directly on WhatsApp at <strong>+44 7441 421073</strong>.
              </p>
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://wa.me/447441421073"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp (+44 7441 421073)</span>
                </a>
                <button
                  onClick={() => setTicketSubmitted(false)}
                  className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h2 className="text-xl font-black text-slate-900">Submit a Priority Support Request</h2>
                <a
                  href="https://wa.me/447441421073"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl font-bold border border-emerald-200 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Fast Track: WhatsApp +447441421073</span>
                </a>
              </div>
              
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
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition cursor-pointer"
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
