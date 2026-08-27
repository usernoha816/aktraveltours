import React, { useState } from 'react';
import { 
  QrCode, 
  PlusCircle, 
  Smartphone, 
  Check, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Copy, 
  ChevronRight, 
  Download,
  AlertCircle,
  FileText,
  Mail,
  RefreshCw,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { ProvisionedEsim, CurrencyCode } from '../types';
import { formatPrice } from '../utils/formatters';

interface MyEsimsWalletProps {
  esims: ProvisionedEsim[];
  currency: CurrencyCode;
  onOpenEsimQr: (esim: ProvisionedEsim) => void;
  onOpenEmailVoucher: (esim: ProvisionedEsim) => void;
  onTopUp: (esimId: string, additionalGb: number, costUsd: number) => void;
  onExploreDestinations: () => void;
  onAddDemoEsim: () => void;
}

export const MyEsimsWallet: React.FC<MyEsimsWalletProps> = ({
  esims,
  currency,
  onOpenEsimQr,
  onOpenEmailVoucher,
  onTopUp,
  onExploreDestinations,
  onAddDemoEsim,
}) => {
  const [topUpModalEsim, setTopUpModalEsim] = useState<ProvisionedEsim | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-900 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Digital eSIM Wallet &amp; Data Center</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            My Active Travel eSIMs
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your provisioned eSIMs, monitor data balance, view activation QR codes, and top up roaming allowances on the go.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {esims.length === 0 && (
            <button
              onClick={onAddDemoEsim}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
            >
              + Load Sample eSIM
            </button>
          )}

          <button
            onClick={onExploreDestinations}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/20 transition flex items-center gap-1.5"
          >
            <span>+ Buy New eSIM</span>
          </button>
        </div>
      </div>

      {/* eSIMs List or Empty State */}
      {esims.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Smartphone className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-black text-slate-900">No active eSIMs in your wallet</h3>
            <p className="text-xs text-slate-500">
              When you purchase a travel eSIM via Stripe checkout, your profile will be reviewed by admin and delivered directly to your email within 30 minutes.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onExploreDestinations}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition"
            >
              Browse 150+ Destinations
            </button>
            <button
              onClick={onAddDemoEsim}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
            >
              Load Demo Travel eSIM
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {esims.map((esim) => {
            const isUnlimited = esim.planTier.dataAllowance === 'Unlimited' || esim.planTier.dataGb === -1;
            const remainingGb = isUnlimited ? 999 : Math.max(0, esim.totalDataGb - esim.usedDataGb);
            const percentUsed = isUnlimited ? 15 : Math.round((esim.usedDataGb / esim.totalDataGb) * 100);
            const isDispatched = esim.status === 'dispatched_to_email';

            return (
              <div
                key={esim.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs hover:shadow-xl hover:shadow-blue-900/5 transition duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{esim.flagEmoji}</span>
                      <div>
                        <h3 className="font-black text-base text-slate-900">{esim.destinationName}</h3>
                        <p className="text-[11px] text-slate-500 font-mono">Ref: {esim.orderNumber}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      isDispatched
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {isDispatched ? '✓ Sent to Email' : '⏳ In Admin Review'}
                    </span>
                  </div>

                  {/* Delivery email tag */}
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl mb-4 text-xs flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Delivered to:</span>
                    <span className="font-mono text-[11px] text-slate-900 font-bold truncate max-w-[180px]">
                      {esim.customerEmail}
                    </span>
                  </div>

                  {/* Data Usage Meter */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Data Balance:</span>
                      <span className="text-blue-600">
                        {isUnlimited ? 'Unlimited 5G Data' : `${remainingGb.toFixed(1)} GB remaining`}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${percentUsed}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Total: {esim.planTier.dataAllowance}</span>
                      <span>Expires: {new Date(esim.expiresAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* LPA String */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-4">
                    <span className="text-[10px] text-slate-400 block font-bold">LPA Activation String:</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono text-[10px] text-slate-700 truncate mr-2">
                        {esim.lpaString}
                      </span>
                      <button
                        onClick={() => handleCopy(esim.lpaString, esim.id)}
                        className="text-blue-600 hover:text-blue-800 font-bold text-[11px] shrink-0"
                      >
                        {copiedId === esim.id ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onOpenEsimQr(esim)}
                    className="px-2 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm transition"
                    title="View email delivery status & details"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>Delivery Info</span>
                  </button>

                  <button
                    onClick={() => onOpenEmailVoucher(esim)}
                    className="px-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Email Doc</span>
                  </button>

                  <button
                    onClick={() => setTopUpModalEsim(esim)}
                    className="px-2 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition border border-blue-200"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Top Up</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Top Up Dialog */}
      {topUpModalEsim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg text-slate-900">
                Top Up {topUpModalEsim.destinationName} eSIM
              </h3>
              <button
                onClick={() => setTopUpModalEsim(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Add instant high-speed 5G gigabytes to your active eSIM without installing a new QR code:
            </p>

            <div className="space-y-2">
              {[
                { gb: 1, price: 4.0 },
                { gb: 3, price: 9.0 },
                { gb: 5, price: 14.0 },
                { gb: 10, price: 24.0 },
              ].map((tier) => (
                <button
                  key={tier.gb}
                  onClick={() => {
                    onTopUp(topUpModalEsim.id, tier.gb, tier.price);
                    setTopUpModalEsim(null);
                  }}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 flex items-center justify-between text-xs font-bold transition text-slate-900"
                >
                  <span>+{tier.gb} GB 5G High Speed Data</span>
                  <span className="text-blue-600">{formatPrice(tier.price, currency)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
