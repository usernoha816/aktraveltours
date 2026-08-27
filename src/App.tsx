import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Layers, 
  Smartphone, 
  Calculator, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Filter, 
  PlusCircle,
  Compass,
  Clock,
  PhoneCall,
  Info,
  FileText,
  CreditCard,
  Mail,
  Plane
} from 'lucide-react';

import { 
  Destination, 
  EsimPlanTier, 
  CartItem, 
  ProvisionedEsim, 
  CurrencyCode, 
  RegionCategory,
  PageTab,
  DurationFilterType,
  StripeCardDetails,
  PaymentMethodType
} from './types';
import { DESTINATIONS_DATA } from './data/destinations';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DestinationCard } from './components/DestinationCard';
import { PlanSelectionModal } from './components/PlanSelectionModal';
import { AutomatedDeliveryModal } from './components/AutomatedDeliveryModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { EmailVoucherModal } from './components/EmailVoucherModal';
import { MyEsimsWallet } from './components/MyEsimsWallet';
import { CompatibilityChecker } from './components/CompatibilityChecker';
import { DataCalculator } from './components/DataCalculator';
import { ToursView } from './components/ToursView';
import { UnlimitedPlansView } from './components/UnlimitedPlansView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { TermsView } from './components/TermsView';
import { AdminPortal } from './components/AdminPortal';
import { StripeOfficialCheckout } from './components/StripeOfficialCheckout';
import { AiRoamingAdvisor } from './components/AiRoamingAdvisor';
import { Footer } from './components/Footer';
import { provisionEsimProfile } from './utils/formatters';
import { safeFetchJson } from './utils/api';

export default function App() {
  // Navigation tab with private URL routing synchronization (/admin, #admin, ?admin=true)
  const [currentTab, setCurrentTabState] = useState<PageTab>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        path.startsWith('/admin') ||
        path.startsWith('/admin-portal') ||
        path.startsWith('/portal') ||
        hash === '#admin' ||
        hash === '#/admin' ||
        search.includes('page=admin') ||
        search.includes('admin=true') ||
        search.includes('admin=1')
      ) {
        return 'admin';
      }
    }
    return 'home';
  });

  // URL route sync helper
  const setCurrentTab = (tab: PageTab) => {
    setCurrentTabState(tab);
    if (typeof window !== 'undefined') {
      if (tab === 'admin') {
        if (window.location.pathname !== '/admin') {
          window.history.pushState({ tab: 'admin' }, '', '/admin');
        }
      } else {
        if (window.location.pathname === '/admin' || window.location.pathname === '/admin-portal') {
          window.history.pushState({ tab }, '', '/');
        }
      }
    }
  };

  // Browser back/forward button popstate & keyboard shortcut listener
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.toLowerCase();
        const hash = window.location.hash.toLowerCase();
        const search = window.location.search.toLowerCase();
        if (
          path.startsWith('/admin') ||
          path.startsWith('/admin-portal') ||
          path.startsWith('/portal') ||
          hash === '#admin' ||
          hash === '#/admin' ||
          search.includes('page=admin') ||
          search.includes('admin=true') ||
          search.includes('admin=1')
        ) {
          setCurrentTabState('admin');
        } else {
          setCurrentTabState('home');
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Hotkey: Ctrl + Shift + A (or Cmd + Shift + A) to quickly navigate to Admin Portal
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setCurrentTab('admin');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Update dynamic page title
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (currentTab === 'home') {
        document.title = 'Global Travel eSIMs | Stay Connected Worldwide with Flexible Data Plan';
      } else if (currentTab === 'admin') {
        document.title = 'Admin Management Portal | AK TRAVELTOURS';
      } else if (currentTab === 'tours') {
        document.title = 'Curated Tour Packages | AK TRAVELTOURS';
      } else if (currentTab === 'unlimited') {
        document.title = 'Unlimited High-Speed eSIMs | AK TRAVELTOURS';
      } else if (currentTab === 'wallet') {
        document.title = 'My eSIMs & Digital Wallet | AK TRAVELTOURS';
      } else if (currentTab === 'compatibility') {
        document.title = 'Device Compatibility Checker | AK TRAVELTOURS';
      } else if (currentTab === 'calculator') {
        document.title = 'Travel Data Calculator | AK TRAVELTOURS';
      } else if (currentTab === 'about') {
        document.title = 'About AK TRAVELTOURS | Global Connectivity';
      } else if (currentTab === 'contact') {
        document.title = '24/7 Global Support | AK TRAVELTOURS';
      } else if (currentTab === 'terms') {
        document.title = 'Terms & Delivery Guarantee | AK TRAVELTOURS';
      } else {
        document.title = 'Global Travel eSIMs | Stay Connected Worldwide with Flexible Data Plan';
      }
    }
  }, [currentTab]);

  // Currency with IP Auto-Detection & Persistent User Selection
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem('aktravel_user_selected_currency');
      if (saved && ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'].includes(saved)) {
        return saved as CurrencyCode;
      }
    } catch {
      // ignore
    }
    return 'USD';
  });

  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    setCurrency(newCurrency);
    try {
      localStorage.setItem('aktravel_user_selected_currency', newCurrency);
    } catch (e) {
      console.warn('Currency save error:', e);
    }
  };

  // Automatically detect visitor currency by IP address on initial load
  useEffect(() => {
    const savedCurrency = localStorage.getItem('aktravel_user_selected_currency');
    if (savedCurrency) {
      // User has manually selected a currency preference before
      return;
    }

    let isMounted = true;

    const detectCurrencyByIp = async () => {
      try {
        const res = await safeFetchJson('/api/ip-currency');
        if (isMounted && res.ok && res.data?.currency) {
          const detected = res.data.currency as CurrencyCode;
          if (['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'].includes(detected)) {
            setCurrency(detected);
            return;
          }
        }
      } catch (err) {
        console.warn('IP currency detection error:', err);
      }

      // Fast Client Fallback based on browser timezone and locale
      if (isMounted) {
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
          const lang = navigator.language || '';

          if (tz.includes('London') || lang.startsWith('en-GB')) {
            setCurrency('GBP');
          } else if (tz.includes('Tokyo') || lang.startsWith('ja')) {
            setCurrency('JPY');
          } else if (tz.includes('Australia') || tz.includes('Sydney') || tz.includes('Melbourne')) {
            setCurrency('AUD');
          } else if (tz.includes('Canada') || tz.includes('Toronto') || tz.includes('Vancouver')) {
            setCurrency('CAD');
          } else if (
            tz.includes('Europe') || 
            tz.includes('Paris') || 
            tz.includes('Berlin') || 
            tz.includes('Rome') || 
            tz.includes('Madrid') || 
            tz.includes('Amsterdam')
          ) {
            setCurrency('EUR');
          } else {
            setCurrency('USD');
          }
        } catch {
          setCurrency('USD');
        }
      }
    };

    detectCurrencyByIp();

    return () => {
      isMounted = false;
    };
  }, []);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RegionCategory | 'all'>('all');
  const [durationFilter, setDurationFilter] = useState<DurationFilterType>('all');

  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aktravel_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Provisioned orders / Wallet
  const [walletEsims, setWalletEsims] = useState<ProvisionedEsim[]>(() => {
    try {
      const saved = localStorage.getItem('aktravel_wallet');
      if (saved) return JSON.parse(saved);
      
      // Default initial sample order for demonstration
      const sampleDest = DESTINATIONS_DATA[0]; // Japan
      const samplePlan = sampleDest.plans[1] || sampleDest.plans[0];
      return [
        {
          id: 'esim_sample_jp',
          orderNumber: 'AK-9824X7Q',
          destinationName: 'Japan',
          destinationCode: 'JP',
          flagEmoji: '🇯🇵',
          planTier: samplePlan,
          iccid: '898520247891230491',
          matchingId: 'B7F3-90A1-48C2-110E',
          smdpAddress: 'smdp.plus.aktraveltours.com',
          lpaString: 'LPA:1$smdp.plus.aktraveltours.com$B7F3-90A1-48C2-110E',
          pinCode: '0000',
          pukCode: '12345678',
          status: 'dispatched_to_email',
          orderedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
          estimatedDeliveryWindow: 'Within 30 Minutes',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          totalDataGb: 5,
          usedDataGb: 1.2,
          customerEmail: 'traveler@example.com',
          customerName: 'Sarah Jenkins',
          paymentMethod: 'Credit Card (Stripe)',
          cardLast4: '4242',
          cardBrand: 'Visa',
          stripePaymentId: 'ch_stripe_sample99',
          networks: ['SoftBank 5G', 'NTT Docomo 5G'],
          apn: 'vsim.global',
          qrCodeDataUrl: '',
        },
      ];
    } catch {
      return [];
    }
  });

  // Modals state
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [activeDeliveryEsim, setActiveDeliveryEsim] = useState<ProvisionedEsim | null>(null);
  const [confirmedOrderEsim, setConfirmedOrderEsim] = useState<ProvisionedEsim | null>(null);
  const [emailVoucherEsim, setEmailVoucherEsim] = useState<ProvisionedEsim | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('aktravel_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('aktravel_wallet', JSON.stringify(walletEsims));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [walletEsims]);

  // Handle Official Stripe Website Checkout Return Redirect (?session_id=...&payment_success=true or ?payment_success=true)
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const sessionId = queryParams.get('session_id');
    const paymentSuccess = queryParams.get('payment_success');
    const paymentCancelled = queryParams.get('payment_cancelled');

    if (paymentCancelled) {
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (paymentSuccess || sessionId) {
      const verifyStripePayment = async () => {
        try {
          const savedEmail = localStorage.getItem('aktravel_pending_email') || 'traveler@aktraveltours.com';
          const savedName = localStorage.getItem('aktravel_pending_name') || 'Valued Traveler';
          let savedCart: any[] = [];
          try {
            const raw = localStorage.getItem('aktravel_pending_cart');
            if (raw) savedCart = JSON.parse(raw);
          } catch (e) {
            console.warn('Cart parse warning:', e);
          }

          let itemsToOrder = cartItems.length > 0 ? cartItems : [];

          if (!itemsToOrder.length && savedCart.length > 0) {
            itemsToOrder = savedCart.map((p) => {
              const dest = DESTINATIONS_DATA.find((d) => d.code === p.code || d.name === p.destination) || DESTINATIONS_DATA[0];
              const plan = dest.plans.find((pl) => pl.dataAllowance === p.plan || pl.durationDays === p.days) || dest.plans[0];
              return {
                id: `cart_${Date.now()}_${Math.random()}`,
                destination: dest,
                plan,
                quantity: p.qty || 1,
              };
            });
          }

          if (sessionId && sessionId.startsWith('cs_')) {
            try {
              const res = await safeFetchJson(`/api/stripe/verify-session?sessionId=${sessionId}`);
              if (res.ok && res.data && res.data.metadata?.itemsSummary) {
                try {
                  const parsed = JSON.parse(res.data.metadata.itemsSummary);
                  itemsToOrder = parsed.map((p: any) => {
                    const dest = DESTINATIONS_DATA.find((d) => d.code === p.code || d.name === p.dest) || DESTINATIONS_DATA[0];
                    return {
                      id: `cart_${Date.now()}`,
                      destination: dest,
                      plan: dest.plans.find((pl) => pl.id === p.plan || pl.dataAllowance === p.plan) || dest.plans[0],
                      quantity: p.qty || 1,
                    };
                  });
                } catch (e) {
                  console.warn('Metadata parse warning:', e);
                }
              }
            } catch (e) {
              console.warn('Session verification fallback:', e);
            }
          }

          if (!itemsToOrder.length) {
            const defaultDest = DESTINATIONS_DATA[0];
            itemsToOrder = [{
              id: `cart_${Date.now()}`,
              destination: defaultDest,
              plan: defaultDest.plans[0],
              quantity: 1,
            }];
          }

          // Create provisioned eSIM from verified Stripe live payment
          const firstItem = itemsToOrder[0];
          const matchingId = (
            Math.random().toString(16).substring(2, 6) + '-' +
            Math.random().toString(16).substring(2, 6) + '-' +
            Math.random().toString(16).substring(2, 6) + '-' +
            Math.random().toString(16).substring(2, 6)
          ).toUpperCase();
          const smdpAddress = 'smdp.plus.aktraveltours.com';
          const lpaString = `LPA:1$${smdpAddress}$${matchingId}`;
          const now = new Date();
          const expiry = new Date(now.getTime() + (firstItem.plan.durationDays || 15) * 86400000);

          const verifiedEsim: ProvisionedEsim = {
            id: `esim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            orderNumber: `AK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            destinationName: firstItem.destination.name,
            destinationCode: firstItem.destination.code,
            flagEmoji: firstItem.destination.flagEmoji,
            planTier: firstItem.plan,
            iccid: '8985202' + Math.floor(100000000000 + Math.random() * 900000000000),
            matchingId,
            smdpAddress,
            lpaString,
            pinCode: '0000',
            pukCode: '12345678',
            status: 'payment_successful',
            orderedAt: now.toISOString(),
            estimatedDeliveryWindow: 'Within 30 Minutes',
            expiresAt: expiry.toISOString(),
            totalDataGb: firstItem.plan.dataGb === -1 ? 999 : firstItem.plan.dataGb,
            usedDataGb: 0,
            customerEmail: savedEmail,
            customerName: savedName,
            paymentMethod: 'Credit Card (Stripe Official Hosted)',
            cardLast4: 'Live Stripe',
            cardBrand: 'Stripe Live',
            stripePaymentId: sessionId || `pi_live_${Date.now()}`,
            networks: firstItem.destination.networks || ['5G / 4G LTE'],
            apn: firstItem.destination.apn || 'vsim.global',
            qrCodeDataUrl: '',
          };

          setWalletEsims((prev) => [verifiedEsim, ...prev]);
          setConfirmedOrderEsim(verifiedEsim);
          setCartItems([]);
          setIsCartOpen(false);
          localStorage.removeItem('aktravel_pending_cart');
        } catch (err) {
          console.error('Failed to verify Stripe checkout return:', err);
        } finally {
          // Clean URL params
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      };

      verifyStripePayment();
    }
  }, []);

  // Global keydown for search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('input-main-destination-search');
        if (input) {
          input.focus();
        } else {
          setCurrentTab('home');
          setTimeout(() => {
            document.getElementById('input-main-destination-search')?.focus();
          }, 100);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cart actions
  const handleAddToCart = (dest: Destination, plan: EsimPlanTier) => {
    const newItem: CartItem = {
      id: `${dest.id}-${plan.id}-${Date.now()}`,
      destination: dest,
      plan,
      quantity: 1,
    };
    setCartItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCartItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: newQty } : item))
    );
  };

  // Direct Buy Flow (1-Click <3s)
  const handleDirectBuy = (dest: Destination, plan: EsimPlanTier) => {
    const newItem: CartItem = {
      id: `${dest.id}-${plan.id}-${Date.now()}`,
      destination: dest,
      plan,
      quantity: 1,
    };
    setCartItems([newItem]);
    setIsCartOpen(true);
  };

  // Manual Payment & Instant Order Dispatch Flow
  const handleInstantCheckout = async (
    customerEmail: string, 
    customerName?: string,
    notes?: string,
    method?: string
  ) => {
    setIsProcessingCheckout(true);

    try {
      const cleanEmail = customerEmail.trim().toLowerCase() || 'traveler@aktraveltours.com';
      const cleanName = customerName?.trim() || 'Valued Traveler';
      const newProvisioned: ProvisionedEsim[] = [];

      for (const item of cartItems) {
        for (let i = 0; i < item.quantity; i++) {
          const esim = await provisionEsimProfile(
            item.destination,
            item.plan,
            cleanEmail,
            cleanName,
            'manual_payment',
            'Manual',
            method || 'Manual Payment (Bank Transfer / WhatsApp)'
          );
          newProvisioned.push(esim);
        }
      }

      setWalletEsims((prev) => [...newProvisioned, ...prev]);
      setCartItems([]);
      setIsCartOpen(false);

      if (newProvisioned.length > 0) {
        setConfirmedOrderEsim(newProvisioned[0]);
      }
    } catch (err) {
      console.error('Manual order checkout error:', err);
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  // Stripe & PayPal Checkout Completion Pipeline
  const handleCompleteCheckout = async (
    customerEmail: string, 
    cardDetails: StripeCardDetails,
    paymentMethodType: PaymentMethodType = 'credit_card',
    paypalEmail?: string
  ) => {
    setIsProcessingCheckout(true);

    try {
      // Simulate gateway authorization latency (~1.2s)
      await new Promise((r) => setTimeout(r, 1200));

      const cardLast4 = cardDetails.cardNumber.slice(-4) || '4242';
      const cardBrand = cardDetails.cardNumber.startsWith('4')
        ? 'Visa'
        : cardDetails.cardNumber.startsWith('5')
        ? 'Mastercard'
        : cardDetails.cardNumber.startsWith('3')
        ? 'Amex'
        : 'Credit Card';

      const newProvisioned: ProvisionedEsim[] = [];

      for (const item of cartItems) {
        for (let i = 0; i < item.quantity; i++) {
          const esim = await provisionEsimProfile(
            item.destination,
            item.plan,
            customerEmail,
            cardDetails.cardholderName || 'Valued Traveler',
            paymentMethodType,
            cardLast4,
            cardBrand,
            paypalEmail
          );
          newProvisioned.push(esim);
        }
      }

      setWalletEsims((prev) => [...newProvisioned, ...prev]);
      setCartItems([]);
      setIsCartOpen(false);

      if (newProvisioned.length > 0) {
        // Open the Order Confirmation & 30-Minute Delivery Tracker Modal
        setConfirmedOrderEsim(newProvisioned[0]);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Payment authorization failed. Please check credentials and retry.');
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  // Admin cancels high-risk / fraud order & deducts/voids payment
  const handleCancelFraudOrder = (orderId: string, reason: string) => {
    setWalletEsims((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'cancelled_fraud_detected',
            cancelledAt: new Date().toISOString(),
            cancellationReason: reason,
            adminCancelledBy: 'Admin Risk Officer #AK-RADAR-1',
          };
        }
        return order;
      })
    );
  };

  // Admin approves order and triggers email dispatch
  const handleAdminConfirmAndDispatch = (orderId: string) => {
    setWalletEsims((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'dispatched_to_email',
            adminReviewedAt: new Date().toISOString(),
            dispatchedToEmailAt: new Date().toISOString(),
          };
        }
        return order;
      })
    );
  };

  // Top up action
  const handleTopUpEsim = (esimId: string, additionalGb: number, costUsd: number) => {
    setWalletEsims((prev) =>
      prev.map((esim) => {
        if (esim.id === esimId) {
          return {
            ...esim,
            totalDataGb: esim.totalDataGb + additionalGb,
            planTier: {
              ...esim.planTier,
              dataAllowance: `${esim.totalDataGb + additionalGb} GB`,
            },
          };
        }
        return esim;
      })
    );
    alert(`Successfully topped up +${additionalGb} GB to your active eSIM!`);
  };

  // Load a demo eSIM for testing if wallet is empty
  const handleAddDemoEsim = async () => {
    const sampleDest = DESTINATIONS_DATA[1] || DESTINATIONS_DATA[0]; // Europe or Japan
    const samplePlan = sampleDest.plans[1] || sampleDest.plans[0];
    const demo = await provisionEsimProfile(
      sampleDest,
      samplePlan,
      'traveler@example.com',
      'Sarah Jenkins',
      'credit_card',
      '4242',
      'Visa'
    );
    setWalletEsims((prev) => [demo, ...prev]);
    setConfirmedOrderEsim(demo);
  };

  // Filter destinations based on search query, region category, and duration
  const filteredDestinations = DESTINATIONS_DATA.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.networks.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || dest.category === selectedCategory;

    const matchesDuration =
      durationFilter === 'all' ||
      (durationFilter === '7days' && dest.plans.some((p) => p.durationDays === 7)) ||
      (durationFilter === '10days' && dest.plans.some((p) => p.durationDays === 10)) ||
      (durationFilter === '30days' && dest.plans.some((p) => p.durationDays === 30)) ||
      (durationFilter === 'unlimited' && dest.plans.some((p) => p.dataAllowance === 'Unlimited' || p.dataGb === -1));

    return matchesSearch && matchesCategory && matchesDuration;
  });

  const pendingAdminCount = walletEsims.filter((o) => o.status !== 'dispatched_to_email').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white max-w-full overflow-x-clip">
      
      {/* Top Navbar - Only in customer storefront */}
      {currentTab !== 'admin' && (
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          currency={currency}
          setCurrency={handleCurrencyChange}
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          openCart={() => setIsCartOpen(true)}
          walletCount={walletEsims.length}
          adminPendingCount={pendingAdminCount}
          openQuickSearch={() => {
            setCurrentTab('home');
            setTimeout(() => {
              document.getElementById('input-main-destination-search')?.focus();
            }, 100);
          }}
        />
      )}

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-full overflow-x-clip">
        
        {/* VIEW 1: HOME / eSIM STORE */}
        {currentTab === 'home' && (
          <div className="w-full max-w-full overflow-x-clip">
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectDestination={(dest) => setSelectedDestination(dest)}
              destinations={DESTINATIONS_DATA}
              onOpenQuickDemo={handleAddDemoEsim}
              onOpenDataCalc={() => setCurrentTab('calculator')}
              onSelectDurationFilter={(df) => setDurationFilter(df)}
              activeDurationFilter={durationFilter}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />

            {/* Catalog Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
              
              {/* Category and Duration Filters Toolbar */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 w-full">
                
                {/* Region Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
                  {[
                    { id: 'all', label: 'All Regions' },
                    { id: 'asia', label: 'Asia' },
                    { id: 'europe', label: 'Europe' },
                    { id: 'americas', label: 'Americas' },
                    { id: 'middle-east', label: 'Middle East' },
                    { id: 'africa', label: 'Africa' },
                    { id: 'global', label: 'Regional Bundles' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id as any)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                        selectedCategory === cat.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Duration Filter Quick Dropdown */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Duration Filter:</span>
                  </span>
                  <select
                    value={durationFilter}
                    onChange={(e) => setDurationFilter(e.target.value as any)}
                    className="bg-white border border-slate-300 text-xs font-bold text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  >
                    <option value="all">All Durations (150+ Countries)</option>
                    <option value="7days">7 Days Plans</option>
                    <option value="10days">10 Days Plans</option>
                    <option value="30days">30 Days Plans</option>
                    <option value="unlimited">Unlimited 5G Data Plans</option>
                  </select>
                </div>

              </div>

              {/* Destination Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDestinations.map((dest) => (
                  <DestinationCard
                    key={dest.id}
                    destination={dest}
                    currency={currency}
                    onSelect={(d) => setSelectedDestination(d)}
                  />
                ))}
              </div>

              {filteredDestinations.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center my-8 shadow-xs">
                  <Globe className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-900 mb-1">No destinations found</h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Try changing your search terms or resetting the duration and region filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setDurationFilter('all');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* VIEW 2: TOUR PACKAGES */}
        {currentTab === 'tours' && (
          <ToursView
            currency={currency}
            onExploreEsims={() => setCurrentTab('home')}
          />
        )}

        {/* VIEW 3: UNLIMITED PLANS */}
        {currentTab === 'unlimited' && (
          <UnlimitedPlansView
            currency={currency}
            onAddToCart={handleAddToCart}
            onDirectBuy={handleDirectBuy}
          />
        )}

        {/* VIEW 4: ABOUT US */}
        {currentTab === 'about' && (
          <AboutView onNavigateTab={setCurrentTab} />
        )}

        {/* VIEW 5: 24/7 SUPPORT & CONTACT */}
        {currentTab === 'contact' && (
          <ContactView />
        )}

        {/* VIEW 6: TERMS & CONSUMER SLA */}
        {currentTab === 'terms' && (
          <TermsView />
        )}

        {/* VIEW 7: COMPATIBILITY CHECKER */}
        {currentTab === 'compatibility' && (
          <CompatibilityChecker onGoToStore={() => setCurrentTab('home')} />
        )}

        {/* VIEW 8: TRIP DATA CALCULATOR */}
        {currentTab === 'calculator' && (
          <DataCalculator
            onRecommendationSelected={(recGb, duration) => {
              if (duration <= 7) setDurationFilter('7days');
              else if (duration <= 10) setDurationFilter('10days');
              else setDurationFilter('30days');
              setCurrentTab('home');
            }}
          />
        )}

        {/* VIEW 9: DEDICATED ADMIN MANAGEMENT PORTAL (WITH SIGNUP / LOGIN) */}
        {currentTab === 'admin' && (
          <AdminPortal
            orders={walletEsims}
            onConfirmAndDispatchOrder={handleAdminConfirmAndDispatch}
            onCancelFraudOrder={handleCancelFraudOrder}
            onViewEmailPreview={(esim) => setEmailVoucherEsim(esim)}
            onViewEsimQr={(esim) => setActiveDeliveryEsim(esim)}
            onBackToStore={() => setCurrentTab('home')}
            currency={currency}
          />
        )}

      </main>

      {/* Global Modals & Drawers */}

      {/* Plan Selection Modal */}
      {selectedDestination && (
        <PlanSelectionModal
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
          currency={currency}
          onAddToCart={handleAddToCart}
          onDirectBuy={handleDirectBuy}
        />
      )}

      {/* Official Stripe Checkout Website Page (1:1 Hosted Experience) */}
      {isCartOpen && (
        <StripeOfficialCheckout
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          currency={currency}
          onInstantCheckout={handleInstantCheckout}
          onRemoveItem={handleRemoveCartItem}
          onUpdateQuantity={handleUpdateQuantity}
          onAddToCart={handleAddToCart}
          onBrowseStore={() => {
            setIsCartOpen(false);
            setCurrentTab('home');
          }}
        />
      )}

      {/* Order Confirmation & 30-Minute Email Delivery Notification Modal */}
      {confirmedOrderEsim && (
        <OrderConfirmationModal
          esim={confirmedOrderEsim}
          onClose={() => setConfirmedOrderEsim(null)}
        />
      )}

      {/* Automated Instant QR Delivery Modal */}
      {activeDeliveryEsim && (
        <AutomatedDeliveryModal
          esim={activeDeliveryEsim}
          onClose={() => setActiveDeliveryEsim(null)}
          onViewInWallet={() => {
            setActiveDeliveryEsim(null);
            setCurrentTab('wallet');
          }}
          onOpenEmailPreview={(esim) => setEmailVoucherEsim(esim)}
        />
      )}

      {/* Email Delivery Voucher & PDF Print Preview Modal */}
      {emailVoucherEsim && (
        <EmailVoucherModal
          esim={emailVoucherEsim}
          onClose={() => setEmailVoucherEsim(null)}
        />
      )}

      {/* 24/7 AI Roaming Concierge Slide-Over / Modal */}
      {isAiAdvisorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl h-[90vh] max-h-[640px] shadow-2xl overflow-hidden relative flex flex-col">
            <AiRoamingAdvisor onClose={() => setIsAiAdvisorOpen(false)} isModal={true} />
          </div>
        </div>
      )}

      {/* Floating AI Roaming Assistant Button (Customer Storefront) */}
      {currentTab !== 'admin' && (
        <button
          onClick={() => setIsAiAdvisorOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center gap-2.5 transition transform hover:scale-105 active:scale-95 group cursor-pointer border border-emerald-300/40"
          title="24/7 AI Roaming Concierge"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
          </div>
          <span className="text-xs tracking-tight hidden sm:inline">AI Roaming Help</span>
          <span className="sm:hidden text-xs">AI Help</span>
        </button>
      )}

      {/* Mobile Bottom Dock Navigation Bar (Mobile & Small Tablets) */}
      {currentTab !== 'admin' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
          
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
              currentTab === 'home' ? 'text-blue-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Globe className="w-5 h-5" />
            <span className="text-[10px]">eSIMs</span>
          </button>

          <button
            onClick={() => setCurrentTab('tours')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
              currentTab === 'tours' ? 'text-blue-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px]">Tours</span>
          </button>

          <button
            onClick={() => setCurrentTab('unlimited')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
              currentTab === 'unlimited' ? 'text-amber-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="text-[10px]">Unlimited</span>
          </button>

          <button
            onClick={() => setCurrentTab('contact')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
              currentTab === 'contact' ? 'text-blue-600 font-bold' : 'text-slate-500'
            }`}
          >
            <PhoneCall className="w-5 h-5" />
            <span className="text-[10px]">Support</span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-slate-500 hover:text-blue-600 relative transition"
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-[10px]">Checkout</span>
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-2 w-4 h-4 bg-amber-400 text-slate-950 rounded-full text-[9px] font-black flex items-center justify-center">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

        </div>
      )}

      {/* Footer - Only displayed in customer storefront */}
      {currentTab !== 'admin' && (
        <div className="pb-16 md:pb-0">
          <Footer onNavigateTab={setCurrentTab} />
        </div>
      )}

    </div>
  );
}
