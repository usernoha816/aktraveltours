import React, { useState } from 'react';
import { 
  X, 
  Search, 
  QrCode, 
  Smartphone, 
  CheckCircle2, 
  Mail, 
  ArrowRight,
  FileText
} from 'lucide-react';
import { ProvisionedEsim } from '../types';
import { safeFetchJson } from '../utils/api';

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEsim: (esim: ProvisionedEsim) => void;
  walletEsims: ProvisionedEsim[];
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({
  isOpen,
  onClose,
  onSelectEsim,
  walletEsims,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProvisionedEsim[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    const cleanQuery = query.trim().toLowerCase();
    
    // First search in local state wallet
    let matched = walletEsims.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(cleanQuery) ||
        o.customerEmail.toLowerCase().includes(cleanQuery) ||
        o.iccid.includes(cleanQuery) ||
        o.destinationName.toLowerCase().includes(cleanQuery)
    );

    // Also query backend endpoint
    try {
      const res = await safeFetchJson('/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: cleanQuery }),
      });
      if (res.ok && res.data?.orders && res.data.orders.length) {
        // Merge without duplicates
        const existingIds = new Set(matched.map((m) => m.id));
        for (const item of res.data.orders) {
          if (!existingIds.has(item.id)) {
            matched.push(item);
          }
        }
      }
    } catch (err) {
      console.warn('Backend lookup warning:', err);
    }

    setResults(matched);
    setIsSearching(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div 
        id="order-lookup-modal"
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl text-white overflow-hidden relative p-6 space-y-5 animate-in fade-in zoom-in-95"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-lg">Retrieve Your eSIM Order</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Enter your <strong>Order Reference (e.g. AR-XXXX)</strong> or <strong>Email address</strong> to immediately re-display your eSIM QR activation code.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="AR-XXXXXXXX or your@email.com..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition shrink-0"
          >
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Results */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {isSearching && (
            <div className="p-4 text-center text-xs text-slate-400">Searching orders...</div>
          )}

          {!isSearching && hasSearched && results.length === 0 && (
            <div className="p-4 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400">
              No orders found matching &quot;{query}&quot;. Please verify the order reference or email address.
            </div>
          )}

          {!isSearching &&
            results.map((esim) => (
              <div
                key={esim.id}
                onClick={() => {
                  onSelectEsim(esim);
                  onClose();
                }}
                className="bg-slate-950 hover:bg-slate-800/80 p-3 rounded-xl border border-slate-800 cursor-pointer flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{esim.flagEmoji}</span>
                  <div>
                    <h4 className="font-bold text-xs text-white group-hover:text-emerald-400 transition">
                      {esim.destinationName} ({esim.planTier.dataAllowance})
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Ref: {esim.orderNumber} • {esim.customerEmail}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 text-slate-200 text-[11px] font-bold rounded-lg transition flex items-center gap-1">
                  <QrCode className="w-3 h-3" />
                  <span>Show QR</span>
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
