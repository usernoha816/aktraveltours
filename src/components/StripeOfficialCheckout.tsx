import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  CreditCard, 
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
  HelpCircle
} from 'lucide-react';
import { CartItem, CurrencyCode, Destination, EsimPlanTier } from '../types';
import { formatPrice } from '../utils/formatters';
import { DESTINATIONS_DATA } from '../data/destinations';
import { safeFetchJson } from '../utils/api';
import { getStripeClient } from '../lib/stripe';

interface StripeOfficialCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: CurrencyCode;
  onCompleteCheckout?: (email: string) => void;
  onInstantCheckout?: (email: string, customerName?: string) => void;
  isProcessing?: boolean;
  onRemoveItem?: (index: number) => void;
  onUpdateQuantity?: (index: number, newQty: number) => void;
  onAddToCart?: (dest: Destination, plan: EsimPlanTier) => void;
  onBrowseStore?: () => void;
}

export const StripeOfficialCheckout: React.FC<StripeOfficialCheckoutProps> = ({
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [stripeConfig, setStripeConfig] = useState<{
    isLive: boolean;
    isConfigured: boolean;
    publishableKey: string | null;
    merchantName: string;
    domain: string;
    supportEmail: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      safeFetchJson('/api/stripe/config')
        .then((res) => {
          if (res.ok && res.data) {
            setStripeConfig(res.data);
            if (res.data.publishableKey) {
              getStripeClient(res.data.publishableKey).catch((e) => console.warn('Stripe client preloading notice:', e));
            }
          } else {
            setStripeConfig({
              isLive: false,
              isConfigured: false,
              publishableKey: null,
              merchantName: 'AK TRAVELTOURS',
              domain: 'aktraveltours.com',
              supportEmail: 'support@aktraveltours.com',
            });
          }
        })
        .catch(() => {
          setStripeConfig({
            isLive: false,
            isConfigured: false,
            publishableKey: null,
            merchantName: 'AK TRAVELTOURS',
            domain: 'aktraveltours.com',
            supportEmail: 'support@aktraveltours.com',
          });
        });
    }
  }, [isOpen]);

  const totalUsd = cartItems.reduce(
    (acc, item) => acc + item.plan.priceUsd * item.quantity,
    0
  );

  const [directCheckoutUrl, setDirectCheckoutUrl] = useState<string | null>(null);

  // Quick Add Popular Destinations if cart is empty
  const popularDestinations = [
    DESTINATIONS_DATA.find((d) => d.id === 'japan') || DESTINATIONS_DATA[0],
    DESTINATIONS_DATA.find((d) => d.id === 'europe-regional') || DESTINATIONS_DATA[1],
    DESTINATIONS_DATA.find((d) => d.id === 'usa') || DESTINATIONS_DATA[2],
  ].filter((d): d is NonNullable<typeof d> => Boolean(d));

  // Instant Express Checkout Handler
  const handleInstantDispatch = (e: React.MouseEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setEmailError(null);

    const cleanEmail = email.trim().toLowerCase() || 'traveler@aktraveltours.com';
    if (onInstantCheckout) {
      onInstantCheckout(cleanEmail, customerName);
    }
  };

  // Trigger Dynamic Checkout: uses Stripe when configured, or Instant Direct Dispatch when keys are deleted/not active
  const handleProceedToStripeHosted = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setEmailError(null);
    setDirectCheckoutUrl(null);

    if (!cartItems || cartItems.length === 0) {
      setErrorMessage('Your cart is empty. Please select an eSIM plan before proceeding.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setEmailError('Please enter a valid email address where your eSIM QR code and activation guide will be sent within 30 minutes.');
      return;
    }

    // If Stripe keys are not active or deleted, proceed directly with instant order dispatch
    if (!stripeConfig?.isConfigured) {
      if (onInstantCheckout) {
        onInstantCheckout(cleanEmail, customerName);
      }
      return;
    }

    setIsProcessing(true);

    // 1. Pre-open the new window synchronously inside the user's click gesture to bypass browser popup blockers
    let checkoutWindow: Window | null = null;
    try {
      checkoutWindow = window.open('about:blank', '_blank');
      if (checkoutWindow) {
        checkoutWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Redirecting to Official Stripe Checkout...</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; text-align: center; }
                .spinner { width: 48px; height: 48px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; }
                @keyframes spin { to { transform: rotate(360deg); } }
                h2 { margin: 0 0 8px; font-size: 20px; font-weight: 700; }
                p { margin: 0; color: #94a3b8; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="spinner"></div>
              <h2>Connecting to Secure Stripe Checkout</h2>
              <p>Preparing your 5G Travel eSIM order for ${cleanEmail}...</p>
            </body>
          </html>
        `);
      }
    } catch (e) {
      console.warn('Pre-open window notice:', e);
    }

    // Safe helper to redirect to Stripe
    const navigateToStripe = (url: string) => {
      setDirectCheckoutUrl(url);
      try {
        if (checkoutWindow && !checkoutWindow.closed) {
          checkoutWindow.location.href = url;
          return;
        }
      } catch (e) {
        console.warn('Popup location assign warning:', e);
      }

      // If pre-open failed or was closed
      try {
        const opened = window.open(url, '_blank', 'noopener,noreferrer');
        if (!opened || opened.closed) {
          window.location.href = url;
        }
      } catch {
        window.location.href = url;
      }
    };

    try {
      // Save customer and order details locally for immediate delivery tracking & order registration
      try {
        localStorage.setItem('aktravel_pending_email', cleanEmail);
        localStorage.setItem('aktravel_pending_name', customerName.trim() || 'Valued Traveler');
        localStorage.setItem('aktravel_last_checkout_time', new Date().toISOString());
        localStorage.setItem(
          'aktravel_pending_cart',
          JSON.stringify(
            cartItems.map((item) => ({
              destination: item.destination.name,
              code: item.destination.code,
              flagEmoji: item.destination.flagEmoji,
              plan: item.plan.dataAllowance,
              days: item.plan.durationDays,
              price: item.plan.priceUsd,
              qty: item.quantity,
            }))
          )
        );
      } catch (e) {
        console.warn('Storage sync warning:', e);
      }

      // Call server to create official dynamic Stripe checkout session with live items & exact prices
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://aktraveltours.com';

      const res = await safeFetchJson('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            destination: {
              name: item.destination.name,
              code: item.destination.code,
            },
            plan: {
              dataAllowance: item.plan.dataAllowance,
              durationDays: item.plan.durationDays,
              priceUsd: item.plan.priceUsd,
            },
            quantity: item.quantity || 1,
          })),
          customerEmail: cleanEmail,
          customerName: customerName.trim() || 'Valued Traveler',
          currency,
          successUrl: `${origin}/?session_id={CHECKOUT_SESSION_ID}&payment_success=true`,
          cancelUrl: `${origin}/?payment_cancelled=true`,
        }),
      });

      if (!res.ok || !res.data?.url) {
        if (checkoutWindow && !checkoutWindow.closed) {
          checkoutWindow.close();
        }
        const errorMsg = res.error || 'Failed to initialize Stripe checkout session.';
        setErrorMessage(errorMsg);
        setIsProcessing(false);
        return;
      }

      navigateToStripe(res.data.url);
      setIsProcessing(false);
    } catch (err: any) {
      console.error('Stripe checkout error:', err);
      if (checkoutWindow && !checkoutWindow.closed) {
        checkoutWindow.close();
      }
      setErrorMessage(err.message || 'Unable to connect to Stripe Checkout.');
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in max-w-full">
      <div 
        id="stripe-hosted-checkout-modal"
        className="w-full max-w-4xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-slate-900 flex flex-col my-auto max-w-full"
      >
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close and return to store"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
                {stripeConfig?.isConfigured ? <CreditCard className="w-4 h-4" /> : <Zap className="w-4 h-4 text-amber-300" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black tracking-tight text-white">
                    {stripeConfig?.isConfigured ? 'Official Stripe Checkout' : 'Secure Travel eSIM Checkout'}
                  </h2>
                  <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {stripeConfig?.isConfigured ? 'Live Gateway' : 'Instant Dispatch'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {stripeConfig?.isConfigured 
                    ? 'Secured by Stripe Inc. • 256-Bit SSL • checkout.stripe.com'
                    : '256-Bit SSL Encryption • Instant Automated eSIM QR Provisioning'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Merchant:</span>
            <span className="bg-slate-800 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700">
              AK TRAVELTOURS
            </span>
          </div>
        </div>

        {/* 30-Minute Email Delivery Guaranteed Ribbon */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-200/60 px-5 sm:px-6 py-3 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
              <Mail className="w-3.5 h-3.5 text-amber-700" />
            </div>
            <span>
              <strong>Guaranteed Email Dispatch:</strong> Your eSIM QR code, LPA string, and installation manual are dispatched to your email within <strong>30 minutes</strong> of Stripe payment confirmation.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <span className="inline-flex items-center gap-1 bg-amber-200/80 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3" />
              <span>&lt; 30 MIN SLA</span>
            </span>
          </div>
        </div>

        {/* Main Grid: Cart Summary (Left) & Stripe Checkout Prompt (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          {/* LEFT: Cart & Order Breakdown (5 cols) */}
          <div className="lg:col-span-5 p-5 sm:p-6 bg-slate-50 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2 uppercase tracking-wider text-xs">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  <span>Order Summary ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
                </h3>
                {cartItems.length > 0 && onBrowseStore && (
                  <button
                    onClick={onBrowseStore}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold transition"
                  >
                    + Add More Plans
                  </button>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-8 px-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Globe className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Your cart is currently empty</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Select a high-speed travel eSIM plan for your upcoming journey.
                  </p>
                  
                  {/* Quick Add Suggestions */}
                  <div className="pt-2 space-y-2 text-left">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Popular Choices:
                    </p>
                    {popularDestinations.map((dest) => (
                      <div
                        key={dest.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 transition text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{dest.flagEmoji}</span>
                          <div>
                            <span className="font-bold text-slate-900 block">{dest.name}</span>
                            <span className="text-[10px] text-slate-500">
                              {dest.plans[0]?.dataAllowance} • {dest.plans[0]?.durationDays} Days
                            </span>
                          </div>
                        </div>
                        {onAddToCart && (
                          <button
                            onClick={() => onAddToCart(dest, dest.plans[0])}
                            className="px-2.5 py-1 bg-blue-600 text-white font-bold text-[11px] rounded-lg hover:bg-blue-700 transition"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  {cartItems.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 relative"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl shrink-0">{item.destination.flagEmoji}</span>
                          <div>
                            <h4 className="font-black text-sm text-slate-900 leading-tight">
                              {item.destination.name} eSIM
                            </h4>
                            <span className="text-xs text-blue-600 font-bold">
                              {item.plan.dataAllowance} • {item.plan.durationDays} Days
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-sm text-slate-900 block">
                            {formatPrice(item.plan.priceUsd * item.quantity, currency)}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatPrice(item.plan.priceUsd, currency)} each
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                          {onUpdateQuantity && (
                            <>
                              <button
                                onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                                className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-slate-900 rounded-md hover:bg-white transition"
                                title="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                                className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-slate-900 rounded-md hover:bg-white transition"
                                title="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>

                        {onRemoveItem && (
                          <button
                            onClick={() => onRemoveItem(idx)}
                            className="text-slate-400 hover:text-red-500 text-xs flex items-center gap-1 transition"
                            title="Remove plan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-bold text-slate-900">{formatPrice(totalUsd, currency)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>eSIM GSMA Provisioning &amp; RSP Fee</span>
                <span className="text-emerald-600 font-bold uppercase">Free ($0.00)</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>30-Minute Priority Email Dispatch</span>
                <span className="text-emerald-600 font-bold uppercase">Included</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="font-black text-sm text-slate-900">Total Due</span>
                <span className="font-black text-xl text-blue-600">
                  {formatPrice(totalUsd, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Stripe Official Hosted Checkout Redirection (7 cols) */}
          <div className="lg:col-span-7 p-5 sm:p-8 space-y-6 flex flex-col justify-between">
            <form onSubmit={handleProceedToStripeHosted} className="space-y-6">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span>Traveler Information for eSIM Dispatch</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-500" />
                    <span>256-Bit SSL</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Your eSIM profile QR code and GSMA activation string will be delivered directly to this email address within 30 minutes.
                </p>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Customer Delivery Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(null);
                      }}
                      placeholder="e.g. yourname@example.com"
                      className={`w-full px-4 py-3 pl-11 rounded-xl border text-sm font-medium transition focus:outline-hidden ${
                        emailError
                          ? 'border-red-500 ring-2 ring-red-100 bg-red-50/30'
                          : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                  {emailError ? (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{emailError}</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-1">
                      Important: Double-check your email. The eSIM QR voucher is dispatched here.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Traveler Full Name (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-300 text-sm font-medium transition focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </div>

              {/* Error Message Box */}
              {errorMessage && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Checkout Notice</span>
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                  {onInstantCheckout && (
                    <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between">
                      <span className="text-[11px] text-amber-800">
                        Dispatch your eSIM QR code instantly without delay:
                      </span>
                      <button
                        type="button"
                        onClick={handleInstantDispatch}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Instant Dispatch Now</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Status Ribbon when in direct instant dispatch mode */}
              {!errorMessage && stripeConfig && !stripeConfig.isConfigured && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px]">
                    <strong>Instant eSIM Dispatch Active:</strong> Submitting will immediately generate your eSIM QR profile, ICCID, and activation voucher without checkout delay.
                  </span>
                </div>
              )}

              {/* Trust Badges & Accepted Payment Cards */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span className="font-bold flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>{stripeConfig?.isConfigured ? 'Real-Time Stripe Hosted Protection' : 'Instant 256-Bit SSL Protection'}</span>
                  </span>
                  <span className="text-[11px] text-slate-500">PCI DSS Level 1</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-bold text-blue-800 shadow-2xs">
                    Visa
                  </span>
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-bold text-amber-700 shadow-2xs">
                    Mastercard
                  </span>
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-bold text-sky-700 shadow-2xs">
                    American Express
                  </span>
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-bold text-slate-800 shadow-2xs">
                    Apple Pay
                  </span>
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-bold text-slate-800 shadow-2xs">
                    Google Pay
                  </span>
                </div>

                <ul className="text-[11px] text-slate-500 space-y-1 pt-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      {stripeConfig?.isConfigured 
                        ? 'Hosted on official Stripe infrastructure (checkout.stripe.com)'
                        : 'Immediate GSMA eSIM profile & QR code generation'}
                    </span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Guaranteed delivery to your email in under 30 minutes</span>
                  </li>
                </ul>
              </div>

              {/* Submit CTA Button */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 active:from-blue-800 text-white font-black rounded-2xl text-sm shadow-xl shadow-blue-600/25 transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{stripeConfig?.isConfigured ? 'Opening Official Stripe Checkout...' : 'Provisioning eSIM Profile...'}</span>
                    </>
                  ) : stripeConfig?.isConfigured ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Proceed to Stripe Checkout • {formatPrice(totalUsd, currency)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Complete Order • {formatPrice(totalUsd, currency)} (Instant Dispatch)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center space-y-2">
                  <p className="text-[11px] text-slate-500">
                    {stripeConfig?.isConfigured
                      ? 'Secured by Stripe Inc. • Opens checkout in a new window for aktraveltours.com'
                      : 'Immediate eSIM provisioning • 30-Minute SLA Guaranteed for aktraveltours.com'}
                  </p>

                  {directCheckoutUrl && (
                    <div className="pt-1 animate-in fade-in">
                      <a
                        href={directCheckoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition shadow-2xs"
                      >
                        <span>If window did not open, click here to launch Stripe ↗</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

            </form>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
              <span>Merchant: AK TRAVELTOURS</span>
              <span>Support: support@aktraveltours.com</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
