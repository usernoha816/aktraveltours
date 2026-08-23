import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Mail, 
  CheckCircle2, 
  CreditCard, 
  Search, 
  Send, 
  Filter, 
  RefreshCw, 
  Eye, 
  Sparkles,
  Plane,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  XCircle,
  Ban,
  AlertTriangle,
  Wallet,
  Check,
  X
} from 'lucide-react';
import { ProvisionedEsim, CurrencyCode } from '../types';
import { formatPrice } from '../utils/formatters';

interface AdminOrdersViewProps {
  orders: ProvisionedEsim[];
  onConfirmAndDispatchOrder: (orderId: string) => void;
  onCancelFraudOrder: (orderId: string, reason: string) => void;
  onViewEmailPreview: (esim: ProvisionedEsim) => void;
  currency: CurrencyCode;
}

export const AdminOrdersView: React.FC<AdminOrdersViewProps> = ({
  orders,
  onConfirmAndDispatchOrder,
  onCancelFraudOrder,
  onViewEmailPreview,
  currency,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'dispatched' | 'cancelled'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fraud cancellation modal state
  const [selectedFraudOrder, setSelectedFraudOrder] = useState<ProvisionedEsim | null>(null);
  const [fraudReason, setFraudReason] = useState('Stripe Radar Elevated Fraud Score (>80)');
  const [customFraudNote, setCustomFraudNote] = useState('');

  const handleApprove = (order: ProvisionedEsim) => {
    onConfirmAndDispatchOrder(order.id);
    setToastMessage(`Order ${order.orderNumber} confirmed! eSIM QR code dispatched to ${order.customerEmail}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExecuteFraudCancel = () => {
    if (!selectedFraudOrder) return;
    const finalReason = customFraudNote ? `${fraudReason} - ${customFraudNote}` : fraudReason;
    onCancelFraudOrder(selectedFraudOrder.id, finalReason);
    setToastMessage(`Order ${selectedFraudOrder.orderNumber} CANCELLED due to Fraud/High-Risk score. Payment deducted/voided.`);
    setSelectedFraudOrder(null);
    setCustomFraudNote('');
    setTimeout(() => setToastMessage(null), 5000);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.destinationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.cancellationReason && o.cancellationReason.toLowerCase().includes(searchTerm.toLowerCase()));

    const isCancelled = o.status === 'cancelled_fraud_detected' || o.status === 'cancelled_high_risk';
    const isDispatched = o.status === 'dispatched_to_email';
    const isPending = !isCancelled && !isDispatched;

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'pending' && isPending) ||
      (filterStatus === 'dispatched' && isDispatched) ||
      (filterStatus === 'cancelled' && isCancelled);

    return matchesSearch && matchesStatus;
  });

  const pendingCount = orders.filter((o) => o.status !== 'dispatched_to_email' && o.status !== 'cancelled_fraud_detected' && o.status !== 'cancelled_high_risk').length;
  const dispatchedCount = orders.filter((o) => o.status === 'dispatched_to_email').length;
  const cancelledCount = orders.filter((o) => o.status === 'cancelled_fraud_detected' || o.status === 'cancelled_high_risk').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-900 space-y-8">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>AK TRAVELTOURS Admin Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Order Review &amp; Fraud Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Review incoming Stripe &amp; PayPal transactions, inspect automated fraud risk scores, cancel high-risk/fraudulent orders, and dispatch verified eSIM QR profiles within the 30-minute SLA.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl text-center min-w-[100px]">
            <span className="text-xl font-black text-amber-900 block">{pendingCount}</span>
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Pending</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl text-center min-w-[100px]">
            <span className="text-xl font-black text-emerald-900 block">{dispatchedCount}</span>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Dispatched</span>
          </div>

          <div className="bg-rose-50 border border-rose-200 px-4 py-2 rounded-2xl text-center min-w-[100px]">
            <span className="text-xl font-black text-rose-900 block">{cancelledCount}</span>
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Fraud Deducted</span>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order #, Email, Customer, or Fraud reason..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: `All Orders (${orders.length})` },
            { id: 'pending', label: `Pending Review (${pendingCount})` },
            { id: 'dispatched', label: `Dispatched (${dispatchedCount})` },
            { id: 'cancelled', label: `Fraud / Cancelled (${cancelledCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterStatus === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Mail className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No matching orders found</h3>
            <p className="text-xs text-slate-500">
              Transactions processed via Stripe or PayPal will appear here for administrative verification.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[11px] tracking-wider">
                <tr>
                  <th className="px-5 py-4">Order Ref &amp; Time</th>
                  <th className="px-5 py-4">Customer Details</th>
                  <th className="px-5 py-4">eSIM Plan</th>
                  <th className="px-5 py-4">Payment Method</th>
                  <th className="px-5 py-4">Radar Risk Assessment</th>
                  <th className="px-5 py-4">Status &amp; SLA</th>
                  <th className="px-5 py-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const isDispatched = order.status === 'dispatched_to_email';
                  const isCancelled = order.status === 'cancelled_fraud_detected' || order.status === 'cancelled_high_risk';
                  const isPayPal = order.paymentMethodType === 'paypal' || order.paymentMethod?.toLowerCase().includes('paypal');
                  const isStoreCredit = order.paymentMethodType === 'store_credit';

                  return (
                    <tr key={order.id} className={`transition ${isCancelled ? 'bg-rose-50/40' : 'hover:bg-slate-50/80'}`}>
                      
                      {/* Ref & Time */}
                      <td className="px-5 py-4">
                        <span className="font-mono font-black text-slate-900 block">{order.orderNumber}</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(order.orderedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-900 block">{order.customerName || 'Valued Traveler'}</span>
                        <span className="text-[11px] text-blue-600 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[150px]">{order.customerEmail}</span>
                        </span>
                      </td>

                      {/* Plan */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{order.flagEmoji}</span>
                          <div>
                            <span className="font-bold text-slate-900">{order.destinationName}</span>
                            <span className="text-[11px] text-slate-500 block">
                              {order.planTier.dataAllowance} • {order.planTier.durationDays}D
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Payment Method */}
                      <td className="px-5 py-4">
                        {isPayPal ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-[#003087] flex items-center gap-1 text-[11px]">
                              <span className="italic font-serif font-black">P</span> PayPal Express
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[120px]">
                              {order.paypalTransactionId || 'PAYID-AUTH'}
                            </span>
                          </div>
                        ) : isStoreCredit ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-emerald-700 flex items-center gap-1 text-[11px]">
                              <Wallet className="w-3 h-3" /> Store Credit
                            </span>
                            <span className="text-[10px] text-slate-400 block">Account Balance</span>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 font-semibold text-slate-800 text-[11px]">
                              <CreditCard className="w-3 h-3 text-blue-600" />
                              <span>{order.cardBrand || 'Visa'} •••• {order.cardLast4 || '4242'}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[120px]">
                              {order.stripePaymentId || 'ch_stripe_live'}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Radar Risk Assessment */}
                      <td className="px-5 py-4">
                        {isCancelled ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded">
                              <Ban className="w-3 h-3" /> Fraud Deducted
                            </span>
                            <span className="text-[10px] text-rose-600 block max-w-[140px] truncate" title={order.cancellationReason}>
                              {order.cancellationReason || 'Risk Radar Triggered'}
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${
                                (order.riskScore || 10) > 75 
                                  ? 'bg-rose-500' 
                                  : (order.riskScore || 10) > 40 
                                  ? 'bg-amber-500' 
                                  : 'bg-emerald-500'
                              }`} />
                              <span className="font-bold text-slate-800 text-[11px]">
                                Score: {order.riskScore || 8}/100
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              IP: {order.ipAddress || '198.51.100.24'}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Status & SLA */}
                      <td className="px-5 py-4">
                        {isCancelled ? (
                          <div className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-full font-bold text-[10px]">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Cancelled (Payment Voided)</span>
                          </div>
                        ) : isDispatched ? (
                          <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-bold text-[10px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Dispatched to Email</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-bold text-[10px] animate-pulse">
                            <Clock className="w-3 h-3" />
                            <span>Pending Review (&lt;30m)</span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                        {!isCancelled && (
                          <button
                            onClick={() => onViewEmailPreview(order)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition inline-flex items-center gap-1"
                            title="Preview Customer Email Voucher"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span className="hidden sm:inline">Preview</span>
                          </button>
                        )}

                        {!isCancelled && !isDispatched && (
                          <>
                            <button
                              onClick={() => handleApprove(order)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-sm inline-flex items-center gap-1 transition"
                            >
                              <Send className="w-3 h-3" />
                              <span>Dispatch QR</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedFraudOrder(order);
                                setFraudReason('Stripe Radar Elevated Fraud Score (>80)');
                              }}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-lg text-xs inline-flex items-center gap-1 transition"
                              title="Cancel High Risk Order & Deduct Fraud"
                            >
                              <ShieldAlert className="w-3 h-3 text-rose-600" />
                              <span className="hidden sm:inline">Fraud Cancel</span>
                            </button>
                          </>
                        )}

                        {!isCancelled && isDispatched && (
                          <button
                            onClick={() => handleApprove(order)}
                            className="px-2.5 py-1.5 bg-slate-50 text-slate-500 hover:text-slate-700 font-medium rounded-lg text-xs transition border border-slate-200 inline-flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Resend</span>
                          </button>
                        )}

                        {isCancelled && (
                          <span className="text-[10px] font-mono text-rose-500 bg-rose-50 px-2 py-1 rounded border border-rose-200">
                            Revoked &amp; Blacklisted
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* MODAL: Cancel Order for Fraud & Deduct/Void Payment */}
      {selectedFraudOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Cancel Order &amp; Deduct Fraud</h3>
                  <p className="text-xs text-slate-500">Order Ref: {selectedFraudOrder.orderNumber}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedFraudOrder(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Warning Callout */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>High-Risk Payment Interception Notice</span>
              </div>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                Cancelling will permanently revoke the eSIM profile allocation, block QR activation, void the transaction on the payment gateway (Stripe/PayPal), and add the email/IP to the suspicious fraud blacklist.
              </p>
            </div>

            {/* Order snapshot */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900">{selectedFraudOrder.customerName} ({selectedFraudOrder.customerEmail})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="font-bold text-slate-900">{selectedFraudOrder.destinationName} ({selectedFraudOrder.planTier.dataAllowance})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="font-mono text-slate-900 font-bold">{selectedFraudOrder.paymentMethod}</span>
              </div>
            </div>

            {/* Select Reason */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Select Fraud / High-Risk Reason:
              </label>
              <select
                value={fraudReason}
                onChange={(e) => setFraudReason(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="Stripe Radar Elevated Fraud Score (>80)">Stripe Radar Elevated Fraud Score (&gt;80)</option>
                <option value="Stolen Credit Card / Chargeback Alert">Stolen Credit Card / Chargeback Alert</option>
                <option value="Geo-IP & VPN Country Mismatch">Geo-IP &amp; VPN Proxy Country Mismatch</option>
                <option value="Disputed PayPal Account / Unauthorized Claim">Disputed PayPal Account / Unauthorized Claim</option>
                <option value="Disposable / Temporary Email Domain">Disposable / Temporary Email Domain</option>
                <option value="Card Velocity Exceeded / Multiple Declined Attempts">Card Velocity Exceeded / Multiple Declined Attempts</option>
                <option value="Manual Admin Policy Rejection">Manual Admin Policy Rejection</option>
              </select>
            </div>

            {/* Additional Notes */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                Internal Admin Risk Notes (Optional):
              </label>
              <input
                type="text"
                value={customFraudNote}
                onChange={(e) => setCustomFraudNote(e.target.value)}
                placeholder="e.g. Card issuing country is UA but billing IP is located in CN..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedFraudOrder(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel / Keep Order
              </button>

              <button
                type="button"
                onClick={handleExecuteFraudCancel}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Confirm Fraud Cancellation &amp; Void</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
