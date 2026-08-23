import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  ShoppingCart, 
  Smartphone, 
  Calculator, 
  Menu, 
  X, 
  Compass, 
  Zap, 
  ShieldCheck, 
  PhoneCall, 
  Info, 
  FileText,
  Sparkles,
  Plane,
  CreditCard,
  Mail,
  Lock,
  Clock
} from 'lucide-react';
import { CurrencyCode, PageTab } from '../types';
import { CURRENCY_RATES } from '../data/destinations';

interface NavbarProps {
  currentTab: PageTab;
  setCurrentTab: (tab: PageTab) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  cartCount: number;
  openCart: () => void;
  walletCount: number;
  openQuickSearch: () => void;
  adminPendingCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currency,
  setCurrency,
  cartCount,
  openCart,
  walletCount,
  openQuickSearch,
  adminPendingCount = 0,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

  const navLinks: { id: PageTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'eSIM Store', icon: <Globe className="w-4 h-4" /> },
    { id: 'tours', label: 'Tour Packages', icon: <Compass className="w-4 h-4" />, badge: 'Tours + eSIM' },
    { id: 'unlimited', label: 'Unlimited Plans', icon: <Zap className="w-4 h-4 text-amber-500" />, badge: 'No Limits' },
    { id: 'calculator', label: 'Trip Calculator', icon: <Calculator className="w-4 h-4" /> },
    { id: 'compatibility', label: 'Device Check', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'about', label: 'About Us', icon: <Info className="w-4 h-4" /> },
    { id: 'contact', label: '24/7 Support', icon: <PhoneCall className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-sm">
      
      {/* Top Travel & Delivery Info Announcement Ribbon */}
      <div className="bg-slate-900 text-slate-200 px-3 sm:px-4 py-2 text-xs border-b border-slate-800 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 w-full min-w-0">
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              AK TRAVELTOURS
            </span>
            <div className="flex items-center gap-1.5 text-slate-300 font-medium truncate">
              <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="hidden sm:inline truncate">
                Delivery <strong>Only via Email within 30 Minutes</strong> after payment success &amp; admin order confirmation
              </span>
              <span className="sm:hidden text-[11px] truncate">
                Email Delivery within 30 min
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-300 shrink-0">
            <span className="flex items-center gap-1 text-slate-300">
              <CreditCard className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Stripe 256-Bit SSL Checkout</span>
              <span className="sm:hidden">Stripe SSL</span>
            </span>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-600/30 group-hover:bg-blue-700 transition">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition">
                  AK TRAVELTOURS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">
                Tours &amp; Travel eSIMs
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-bold">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentTab(link.id)}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  currentTab === link.id
                    ? 'bg-blue-50 text-blue-700 font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-md font-bold uppercase tracking-wider">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Utility Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Search */}
            <button
              onClick={openQuickSearch}
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-medium transition"
              title="Search destinations (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search</span>
              <kbd className="text-[10px] bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-mono shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <span className="text-blue-600">{CURRENCY_RATES[currency].symbol}</span>
                <span>{currency}</span>
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-2xl shadow-xl py-1 z-50 text-xs text-slate-700 animate-in fade-in zoom-in-95">
                  {currencies.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setIsCurrencyDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition ${
                        currency === c ? 'text-blue-600 font-black bg-blue-50/60' : ''
                      }`}
                    >
                      <span>{c}</span>
                      <span className="text-slate-400 font-mono">{CURRENCY_RATES[c].symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-600/30 transition flex items-center justify-center cursor-pointer"
              title="Cart & Stripe Checkout"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 bg-slate-100 text-slate-700 rounded-xl"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-1 shadow-xl">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentTab(link.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full px-4 py-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between ${
                currentTab === link.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {link.icon}
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                  {link.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

    </header>
  );
};
