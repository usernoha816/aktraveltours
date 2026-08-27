export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD';

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD
}

export type RegionCategory = 'popular' | 'europe' | 'asia' | 'americas' | 'middle-east' | 'africa' | 'global';

export interface EsimPlanTier {
  id: string;
  dataAllowance: string; // e.g. '1 GB', '3 GB', '5 GB', '10 GB', '20 GB', 'Unlimited'
  dataGb: number; // numeric value for calculations (-1 for unlimited)
  durationDays: number;
  priceUsd: number;
  isPopular?: boolean;
  isBestValue?: boolean;
  unlimitedFup?: string; // e.g. "High speed 5G data, 3GB/day then 1Mbps"
  voiceMinutes?: number;
  smsCount?: number;
}

export interface Destination {
  id: string;
  name: string;
  code: string; // ISO 2 or regional code e.g. 'JP', 'US', 'EU35'
  flagEmoji: string;
  category: RegionCategory;
  coverageType: 'local' | 'regional' | 'global';
  countriesIncludedCount?: number;
  countriesIncludedList?: string[];
  networks: string[]; // e.g. ['SoftBank 5G', 'NTT Docomo LTE']
  speedTier: '5G' | '5G Ultra' | '4G/LTE';
  apn: string;
  eKycRequired: boolean;
  hotspotAllowed: boolean;
  plans: EsimPlanTier[];
  highlights: string[];
  popularCity?: string;
  startingPriceUsd: number;
}

export interface CartItem {
  id?: string;
  cartItemId?: string;
  destination: Destination;
  plan: EsimPlanTier;
  quantity: number;
}

export interface StripeCardDetails {
  cardNumber: string;
  expiryMonthYear: string;
  cvc: string;
  cardholderName: string;
  postalCode?: string;
  country?: string;
}

export type PaymentMethodType = 'credit_card' | 'store_credit' | 'paypal' | 'manual_payment' | 'manual_bank' | 'manual_whatsapp';

export type OrderStatus = 
  | 'payment_successful'
  | 'pending_admin_review'
  | 'confirmed_by_admin'
  | 'dispatched_to_email'
  | 'cancelled_fraud_detected'
  | 'cancelled_high_risk'
  | 'refunded';

export interface ProvisionedEsim {
  id: string;
  orderNumber: string;
  destinationName: string;
  destinationCode: string;
  flagEmoji: string;
  planTier: EsimPlanTier;
  iccid: string; // 19-20 digit SIM identifier
  matchingId: string;
  smdpAddress: string;
  lpaString: string; // LPA:1$smdp.example.com$ACTIVATION_CODE
  pinCode: string;
  pukCode: string;
  status: OrderStatus;
  orderedAt: string;
  adminReviewedAt?: string;
  dispatchedToEmailAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  adminCancelledBy?: string;
  estimatedDeliveryWindow: string; // e.g. "Within 30 Minutes"
  expiresAt: string;
  totalDataGb: number;
  usedDataGb: number;
  customerEmail: string;
  customerName: string;
  paymentMethod: string;
  paymentMethodType?: PaymentMethodType;
  cardLast4?: string;
  cardBrand?: string;
  stripePaymentId?: string;
  paypalTransactionId?: string;
  paypalPayerEmail?: string;
  riskScore?: number; // 0-100
  riskLevel?: 'normal' | 'elevated' | 'high_risk';
  fraudFlags?: string[];
  ipAddress?: string;
  networks: string[];
  apn: string;
  qrCodeDataUrl?: string;
}

export interface DeviceModel {
  brand: 'Apple' | 'Samsung' | 'Google' | 'Xiaomi' | 'Oppo' | 'Motorola' | 'Other';
  model: string;
  isCompatible: boolean;
  dualSimNotes: string;
  releaseYear: number;
  instructionsSnippet: string;
}

export type PageTab = 
  | 'home'
  | 'tours'
  | 'unlimited'
  | 'wallet'
  | 'calculator'
  | 'compatibility'
  | 'about'
  | 'contact'
  | 'terms'
  | 'admin';

export type AdminRole = 
  | 'super_admin' 
  | 'risk_officer' 
  | 'support_specialist' 
  | 'dispatch_manager';

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  badgeNumber: string;
  businessEmailSupport?: string;
  domain?: string;
  createdAt: string;
  lastLoginAt: string;
}

export type AdminPortalTab = 
  | 'orders' 
  | 'customers' 
  | 'inventory' 
  | 'analytics' 
  | 'audit-logs' 
  | 'settings';

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  totalOrders: number;
  totalSpendUsd: number;
  activeEsimsCount: number;
  riskRating: 'trusted' | 'standard' | 'elevated' | 'blacklisted';
  lastOrderDate: string;
  preferredPayment: string;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  orderId?: string;
}

export type DurationFilterType = 'all' | '7days' | '10days' | '30days' | 'unlimited';

export interface TourPackage {
  id: string;
  title: string;
  destination: string;
  countryCode: string;
  flagEmoji: string;
  durationDays: number;
  featuredImage: string;
  pricePerPersonUsd: number;
  rating: number;
  reviewsCount: number;
  includedEsimData: string; // e.g. "Free 10GB 5G eSIM Included"
  highlights: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  includedServices: string[];
  groupSize: string;
  nextDeparture: string;
}
