import QRCode from 'qrcode';
import { CurrencyCode, ProvisionedEsim, EsimPlanTier, Destination, PaymentMethodType } from '../types';
import { CURRENCY_RATES } from '../data/destinations';

export function formatPrice(amountUsd: number, currency: CurrencyCode = 'USD'): string {
  const rateObj = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = amountUsd * rateObj.rate;
  
  if (currency === 'JPY') {
    return `${rateObj.symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${rateObj.symbol}${converted.toFixed(2)}`;
}

export function generateOrderNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'AK-';
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

export function generateIccid(): string {
  // GSMA standard 89852 (Travel eSIM profile test prefix) + 14 digits
  let iccid = '8985202';
  for (let i = 0; i < 12; i++) {
    iccid += Math.floor(Math.random() * 10);
  }
  return iccid;
}

export function generateMatchingId(): string {
  const hex = '0123456789ABCDEF';
  let str = '';
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) str += '-';
    str += hex.charAt(Math.floor(Math.random() * hex.length));
  }
  return str;
}

export async function generateQrCodeDataUrl(text: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 320,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}

export async function provisionEsimProfile(
  destination: Destination,
  plan: EsimPlanTier,
  customerEmail: string,
  customerName: string = 'Valued Traveler',
  paymentMethodType: PaymentMethodType = 'credit_card',
  cardLast4: string = '4242',
  cardBrand: string = 'Visa',
  paypalPayerEmail?: string
): Promise<ProvisionedEsim> {
  const orderNumber = generateOrderNumber();
  const iccid = generateIccid();
  const matchingId = generateMatchingId();
  const smdpAddress = 'smdp.plus.aktraveltours.com';
  const lpaString = `LPA:1$${smdpAddress}$${matchingId}`;
  
  const qrCodeDataUrl = await generateQrCodeDataUrl(lpaString);

  const now = new Date();
  const orderedAt = now.toISOString();
  const expiryDate = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
  const expiresAt = expiryDate.toISOString();

  // Generate realistic fraud radar evaluation
  const riskScore = Math.floor(Math.random() * 18) + 4; // default low risk 4-22
  const riskLevel: 'normal' | 'elevated' | 'high_risk' = riskScore > 75 ? 'high_risk' : riskScore > 50 ? 'elevated' : 'normal';

  let paymentMethodLabel = 'Manual Payment (Bank Transfer / Faster Payments)';
  let stripePaymentId: string | undefined = undefined;
  let paypalTransactionId: string | undefined = undefined;

  if (paymentMethodType === 'manual_whatsapp') {
    paymentMethodLabel = 'Manual Payment (WhatsApp Direct +447441421073)';
  } else if (paymentMethodType === 'manual_bank' || paymentMethodType === 'manual_payment') {
    paymentMethodLabel = cardBrand && cardBrand !== 'Visa' ? cardBrand : 'Manual Payment (UK Faster Payments / Bank Wire)';
  } else if (paymentMethodType === 'paypal') {
    paymentMethodLabel = 'PayPal Direct Manual Payment';
    paypalTransactionId = `MANUAL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  } else if (paymentMethodType === 'store_credit') {
    paymentMethodLabel = 'Store Travel Credit';
  } else {
    paymentMethodLabel = cardBrand || 'Manual Payment (Settlement Pending)';
  }

  return {
    id: `esim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    orderNumber,
    destinationName: destination.name,
    destinationCode: destination.code,
    flagEmoji: destination.flagEmoji,
    planTier: plan,
    iccid,
    matchingId,
    smdpAddress,
    lpaString,
    pinCode: '0000',
    pukCode: '12345678',
    status: 'pending_admin_review',
    orderedAt,
    estimatedDeliveryWindow: 'Within 30 Minutes',
    expiresAt,
    totalDataGb: plan.dataGb === -1 ? 50 : plan.dataGb,
    usedDataGb: 0,
    customerEmail,
    customerName,
    paymentMethod: paymentMethodLabel,
    paymentMethodType,
    cardLast4: paymentMethodType === 'credit_card' ? cardLast4 : undefined,
    cardBrand: paymentMethodType === 'credit_card' ? cardBrand : undefined,
    stripePaymentId,
    paypalTransactionId,
    paypalPayerEmail: paymentMethodType === 'paypal' ? (paypalPayerEmail || customerEmail) : undefined,
    riskScore,
    riskLevel,
    fraudFlags: ['Address & CVC Verified (3D Secure)', 'Low Velocity IP'],
    ipAddress: `198.51.100.${Math.floor(Math.random() * 250) + 1}`,
    networks: destination.networks,
    apn: destination.apn,
    qrCodeDataUrl,
  };
}
