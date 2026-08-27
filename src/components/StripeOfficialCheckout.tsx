import React, { useState, useId } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Building2, 
  AlertCircle, 
  Mail, 
  Globe, 
  Check, 
  ExternalLink,
  Shield,
  User,
  Sparkles,
  Zap,
  ArrowRight,
  Clock,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Compass,
  CheckCircle2,
  Copy,
  MessageCircle,
  Phone,
  Send,
  CreditCard,
  FileText,
  Lock
} from 'lucide-react';
import { CartItem, CurrencyCode, Destination, EsimPlanTier } from '../types';
import { formatPrice } from '../utils/formatters';
import { DESTINATIONS_DATA } from '../data/destinations';

interface ManualPaymentCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: CurrencyCode;
  onInstantCheckout?: (email: string, customerName?: string, notes?: string, method?: string) => void;
  onRemoveItem?: (index: number) => void;
  onUpdateQuantity?: (index: number, newQty: number) => void;
  onAddToCart?: (dest: Destination, plan: EsimPlanTier) => void;
  onBrowseStore?: () => void;
}

type ManualMethod = 'bank_transfer' | 'whatsapp' | 'wise_revolut';

export const StripeOfficialCheckout: React.FC<ManualPaymentCheckoutProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  onInstantCheckout,
  onRemoveItem,
  onUpdateQuantity,
  onAddToCart,
  onBrowseStore,
}) => {
  const [email, setEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<ManualMethod>('bank_transfer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Generate a consistent order reference for this session
  const [orderRef] = useState(() => 'AK-' + Math.random().toString(36).substring(2, 8).toUpperCase());

  if (!isOpen) return null;

  const totalUsd = cartItems.reduce(
    (acc, item) => acc + item.plan.priceUsd * item.quantity,
    0
  );

  const formattedTotal = formatPrice(totalUsd, currency);

  const popularDestinations = [
    DESTINATIONS_DATA.find((d) => d.id === 'japan') || DESTINATIONS_DATA[0],
    DESTINATIONS_DATA.find((d) => d.id === 'europe-regional') || DESTINATIONS_DATA[1],
    DESTINATIONS_DATA.find((d) => d.id === 'usa') || DESTINATIONS_DATA[2],
  ].filter((d): d is NonNullable<typeof d> => Boolean(d));

  const copyToClipboard = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      // Fallback
    }
  };

  const getWhatsAppMessage = () => {
    const itemsSummary = cartItems
      .map((i) => `${i.quantity}x ${i.destination.name} (${i.plan.dataAllowance}, ${i.plan.durationDays} Days)`)
      .join(', ');

    return encodeURIComponent(
      `Hello AK TRAVELTOURS,\n\nI would like to confirm my eSIM order:\n• Order Ref: ${orderRef}\n• Items: ${itemsSummary || '1x Global 5G eSIM'}\n• Total: ${formattedTotal}\n• Name: ${customerName.trim() || 'Valued Traveler'}\n• Delivery Email: ${email.trim() || 'support@aktraveltours.com'}\n\nPlease share the payment confirmation so my eSIM can be dispatched within 30 minutes. Thank you!`
    );
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setEmailError(null);

    if (!cartItems || cartItems.length === 0) {
      setErrorMessage('Your cart is empty. Please select an eSIM plan before placing an order.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setEmailError('Please enter a valid email address. Your eSIM QR code will be delivered here from support@aktraveltours.com within 30 minutes.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name for order registration.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Store customer metadata locally
      try {
        localStorage.setItem('aktravel_pending_email', cleanEmail);
        localStorage.setItem('aktravel_pending_name', customerName.trim());
        localStorage.setItem('aktravel_pending_phone', phoneNumber.trim());
        localStorage.setItem('aktravel_last_order_ref', orderRef);
      } catch (err) {
        console.warn('Local storage write notice:', err);
      }

      const paymentMethodName = 
        selectedMethod === 'bank_transfer'
          ? 'Manual Payment (UK Faster Payments / Bank Wire)'
          : selectedMethod === 'whatsapp'
          ? 'Manual Payment (WhatsApp Direct Pay)'
          : 'Manual Payment (Wise / Revolut / PayPal)';

      const notes = [
        `Method: ${paymentMethodName}`,
        phoneNumber ? `Phone/WhatsApp: ${phoneNumber}` : null,
        transactionRef ? `Ref/Transaction ID: ${transactionRef}` : null,
        `Order Ref: ${orderRef}`,
      ].filter(Boolean).join(' | ');

      // Trigger order creation & confirmation
      if (onInstantCheckout) {
        onInstantCheckout(cleanEmail, customerName.trim(), notes, paymentMethodName);
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setErrorMessage('Failed to register order. Please retry or contact support on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        id="manual-payment-checkout-modal"
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl shadow-2xl text-slate-900 overflow-hidden relative my-4 sm:my-8 animate-in fade-in zoom-in-95 flex flex-col max-h-[92vh]"
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-600/30">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg text-white">Manual Payment &amp; Order Checkout</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Direct Settlement
                </span>
              </div>
              <p className="text-xs text-slate-400">
                AK TRAVELTOURS LTD • London, United Kingdom • Ref: <span className="font-mono text-white font-bold">{orderRef}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close Checkout"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Email Delivery SLA Guarantee Ribbon */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Guaranteed Email Delivery:</strong> eSIM QR code &amp; activation details will be sent from <strong>support@aktraveltours.com</strong> within <strong>30 minutes</strong> of payment verification.
            </span>
          </div>
          <a
            href="https://wa.me/447441421073"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100/90 hover:bg-emerald-200 px-2 py-0.5 rounded text-[11px] transition"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp: +44 7441 421073</span>
          </a>
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Cart Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-black text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5 text-blue-600" />
                    <span>Order Summary ({cartItems.reduce((s, i) => s + i.quantity, 0)} Items)</span>
                  </h3>
                  <span className="text-xs font-bold text-slate-500">{currency}</span>
                </div>

                {cartItems.length === 0 ? (
                  <div className="py-6 text-center space-y-3">
                    <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-500">Your shopping bag is empty.</p>
                    {onBrowseStore && (
                      <button
                        onClick={onBrowseStore}
                        className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs"
                      >
                        Browse 5G eSIMs
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {cartItems.map((item, idx) => (
                      <div 
                        key={item.id || idx}
                        className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-2xl shrink-0">{item.destination.flagEmoji}</span>
                          <div className="truncate">
                            <h4 className="font-bold text-slate-900 truncate">{item.destination.name}</h4>
                            <p className="text-[11px] text-slate-500">
                              {item.plan.dataAllowance} • {item.plan.durationDays} Days
                            </p>
                            <p className="font-mono font-bold text-blue-600 text-xs">
                              {formatPrice(item.plan.priceUsd * item.quantity, currency)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {onUpdateQuantity && (
                            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                              <button
                                onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 text-slate-600 rounded-l"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 font-mono font-bold text-xs">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 text-slate-600 rounded-r"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          {onRemoveItem && (
                            <button
                              onClick={() => onRemoveItem(idx)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span>{formattedTotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Activation &amp; eSIM Generation:</span>
                    <span className="text-emerald-600 font-bold">FREE ($0.00)</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Email Delivery SLA:</span>
                    <span className="text-blue-600 font-bold">&lt; 30 Minutes</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-slate-900 border-t border-slate-200 pt-2">
                    <span>Total Due:</span>
                    <span className="text-blue-600 text-base">{formattedTotal}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 text-slate-700 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Manual Payment Security</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Direct transfer gives you total control. No credit card stored online. Make your transfer and submit your details below to activate your eSIM profile.
                </p>
              </div>
            </div>

            {/* Right Column: Manual Payment Selection & Customer Details (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Payment Method Selector */}
              <div className="space-y-2.5">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  1. Select Your Preferred Manual Payment Method
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  
                  {/* Bank Transfer Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('bank_transfer')}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      selectedMethod === 'bank_transfer'
                        ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-600/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <Building2 className="w-4 h-4" />
                      </div>
                      {selectedMethod === 'bank_transfer' && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="mt-2">
                      <h4 className="font-bold text-xs text-slate-900">Bank Transfer</h4>
                      <p className="text-[10px] text-slate-500">UK Faster Payments / IBAN Wire</p>
                    </div>
                  </button>

                  {/* WhatsApp Pay Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('whatsapp')}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      selectedMethod === 'whatsapp'
                        ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      {selectedMethod === 'whatsapp' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <div className="mt-2">
                      <h4 className="font-bold text-xs text-slate-900">WhatsApp Pay</h4>
                      <p className="text-[10px] text-slate-500">+44 7441 421073</p>
                    </div>
                  </button>

                  {/* Wise / Revolut / PayPal Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('wise_revolut')}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      selectedMethod === 'wise_revolut'
                        ? 'bg-purple-50/80 border-purple-600 ring-2 ring-purple-600/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      {selectedMethod === 'wise_revolut' && (
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <div className="mt-2">
                      <h4 className="font-bold text-xs text-slate-900">Wise / Revolut</h4>
                      <p className="text-[10px] text-slate-500">PayPal / Direct App Pay</p>
                    </div>
                  </button>

                </div>
              </div>

              {/* Dynamic Payment Instructions Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-3">
                
                {selectedMethod === 'bank_transfer' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span>UK &amp; International Bank Account Details:</span>
                      </span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                        AK TRAVELTOURS LTD
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                      
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Beneficiary Name:</span>
                          <span className="font-bold text-slate-900">AK TRAVELTOURS LTD</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('AK TRAVELTOURS LTD', 'name')}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition"
                          title="Copy name"
                        >
                          {copiedKey === 'name' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Bank Name &amp; Location:</span>
                          <span className="font-bold text-slate-900">Barclays Bank (London, UK)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('Barclays Bank UK', 'bank')}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition"
                          title="Copy bank"
                        >
                          {copiedKey === 'bank' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-slate-400 block text-[10px]">UK Sort Code:</span>
                          <span className="font-mono font-bold text-slate-900">20-00-00</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('20-00-00', 'sort')}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition"
                          title="Copy sort code"
                        >
                          {copiedKey === 'sort' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-slate-400 block text-[10px]">UK Account Number:</span>
                          <span className="font-mono font-bold text-slate-900">83920194</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('83920194', 'acc')}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition"
                          title="Copy account number"
                        >
                          {copiedKey === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between sm:col-span-2">
                        <div>
                          <span className="text-slate-400 block text-[10px]">International IBAN (EUR/GBP/USD):</span>
                          <span className="font-mono font-bold text-slate-900">GB29 BARC 2000 0083 9201 94</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('GB29BARC20000083920194', 'iban')}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition"
                          title="Copy IBAN"
                        >
                          {copiedKey === 'iban' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-slate-400 block text-[10px]">BIC / SWIFT:</span>
                          <span className="font-mono font-bold text-slate-900">BARCGB22</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('BARCGB22', 'bic')}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition"
                          title="Copy BIC"
                        >
                          {copiedKey === 'bic' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
                        <div>
                          <span className="text-blue-600 block text-[10px] font-bold">Transfer Reference (Required):</span>
                          <span className="font-mono font-bold text-blue-950">{orderRef}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(orderRef, 'ref')}
                          className="p-1 hover:bg-blue-100 rounded text-blue-700 transition"
                          title="Copy reference"
                        >
                          {copiedKey === 'ref' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                    </div>
                  </div>
                )}

                {selectedMethod === 'whatsapp' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span>Instant WhatsApp Order Desk (+44 7441 421073):</span>
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Live Agent 24/7
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      You can instantly connect with our London operations team on WhatsApp to place your order, confirm customized payment methods, or request an instant invoice:
                    </p>
                    <a
                      href={`https://wa.me/447441421073?text=${getWhatsAppMessage()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp (+44 7441 421073) with Order #{orderRef}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {selectedMethod === 'wise_revolut' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-purple-600" />
                        <span>Wise / Revolut / PayPal Settlement:</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Wise &amp; PayPal Payee Email:</span>
                          <span className="font-mono font-bold text-slate-900">support@aktraveltours.com</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('support@aktraveltours.com', 'wise_email')}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500"
                        >
                          {copiedKey === 'wise_email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Revolut Tag:</span>
                          <span className="font-mono font-bold text-slate-900">@aktraveltours</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('@aktraveltours', 'revolut_tag')}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500"
                        >
                          {copiedKey === 'revolut_tag' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Customer Contact & Delivery Form */}
              <form onSubmit={handleSubmitOrder} className="space-y-4 pt-1">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  2. Your Contact &amp; eSIM Email Delivery Info
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      WhatsApp / Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. +44 7441 421073"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Delivery Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(null);
                      }}
                      placeholder="e.g. traveler@example.com"
                      className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                        emailError ? 'border-red-500 bg-red-50/30' : 'border-slate-300 bg-white'
                      } focus:outline-none focus:ring-2 focus:ring-blue-600`}
                    />
                  </div>
                  {emailError ? (
                    <p className="text-[11px] text-red-600 mt-1 font-semibold">{emailError}</p>
                  ) : (
                    <p className="text-[10px] text-slate-500 mt-1">
                      Your 5G eSIM activation QR code will be dispatched strictly to this address within 30 minutes.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Transaction ID / Reference / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder={`e.g. Transferred ${formattedTotal} from Barclays / Ref: ${orderRef}`}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || cartItems.length === 0}
                    className={`w-full py-3.5 text-white font-black rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                      isSubmitting || cartItems.length === 0
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-blue-600/30'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Registering Order Ref {orderRef}...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Confirm Order via Manual Payment ({formattedTotal})</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-2">
                    🔒 By confirming, your order is submitted to AK TRAVELTOURS London Dispatch Desk for 30-min email fulfillment.
                  </p>
                </div>

              </form>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default StripeOfficialCheckout;
