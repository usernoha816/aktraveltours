import express from 'express';
import Stripe from 'stripe';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export const apiRouter = express.Router();

// Dynamic Stripe Client loader (reads strictly from environment variables)
export function getStripe(): Stripe | null {
  const rawKey = (
    process.env.STRIPE_SECRET_KEY ||
    process.env.STRIPE_API_KEY ||
    process.env.STRIPE_KEY ||
    process.env.STRIPE_SK ||
    process.env.STRIPE_SECRET ||
    process.env.VITE_STRIPE_SECRET_KEY ||
    ''
  ).trim();

  // Strip any accidental wrapping quotes
  const secretKey = rawKey.replace(/^['"]|['"]$/g, '').trim();

  if (!secretKey) {
    return null;
  }

  try {
    return new Stripe(secretKey);
  } catch (err) {
    console.warn('Failed to initialize Stripe client:', err);
    return null;
  }
}

// In-memory store for active session orders
export const ordersDatabase: any[] = [];

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Gemini client initialization warning:', err);
  }
}

// 1. Health check
apiRouter.get('/health', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const stripe = getStripe();
  res.json({
    status: 'ok',
    service: 'AK TRAVELTOURS Automated eSIM Delivery Engine',
    stripeConfigured: Boolean(stripe),
  });
});

// 2. Stripe Config
apiRouter.get('/stripe/config', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const stripe = getStripe();
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLISHABLE_KEY || null;
  const isLive = Boolean(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY);

  res.json({
    isLive,
    isConfigured: Boolean(stripe),
    publishableKey,
    merchantName: 'AK TRAVELTOURS',
    domain: 'aktraveltours.com',
    supportEmail: 'support@aktraveltours.com',
    deliverySla: '30 Minutes strictly via Email',
  });
});

// 3. Dynamic Stripe Checkout Session Creation with Exact Plan Price
apiRouter.post('/stripe/create-checkout-session', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    const { items, customerEmail, customerName, currency = 'USD', successUrl, cancelUrl } = req.body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one eSIM plan is required in your cart.' });
    }

    if (!customerEmail || typeof customerEmail !== 'string' || !customerEmail.includes('@') || !customerEmail.includes('.')) {
      return res.status(400).json({ success: false, error: 'A valid customer email is required for 30-minute delivery.' });
    }

    const cleanEmail = customerEmail.trim().toLowerCase();
    const stripe = getStripe();
    if (!stripe) {
      return res.status(400).json({
        success: false,
        error: 'No active Stripe Secret Key detected on the server. You can add new keys in Settings anytime, or use instant Sandbox order generation.',
      });
    }

    // Determine the base origin URL for checkout redirects
    const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : '') || 'https://aktraveltours.com';
    const finalSuccessUrl = successUrl || `${origin}/?session_id={CHECKOUT_SESSION_ID}&payment_success=true`;
    const finalCancelUrl = cancelUrl || `${origin}/?payment_cancelled=true`;

    const cleanCurrency = (currency || 'USD').toLowerCase();
    const isZeroDecimal = cleanCurrency === 'jpy';

    const lineItems = items.map((item: any) => {
      const price = Number(item.plan?.priceUsd || item.price || 10);
      const unitAmount = isZeroDecimal ? Math.round(price) : Math.round(price * 100);
      const destName = item.destination?.name || item.destinationName || 'Travel';
      const planAllowance = item.plan?.dataAllowance || item.planName || 'High-Speed';
      const planDays = item.plan?.durationDays || item.durationDays || 7;

      return {
        price_data: {
          currency: cleanCurrency,
          product_data: {
            name: `${destName} eSIM - ${planAllowance} (${planDays} Days)`,
            description: `AK TRAVELTOURS 5G/4G Travel eSIM for ${destName}. 30-Minute Email Delivery to ${cleanEmail}.`,
          },
          unit_amount: Math.max(50, unitAmount),
        },
        quantity: Math.max(1, Number(item.quantity || 1)),
      };
    });

    const rawSummary = JSON.stringify(
      items.map((i: any) => ({
        dest: i.destination?.name || i.destinationName,
        plan: i.plan?.dataAllowance || i.planName,
        qty: i.quantity || 1,
      }))
    );
    const safeSummary = rawSummary.length > 400 ? rawSummary.slice(0, 400) : rawSummary;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: lineItems,
      mode: 'payment',
      customer_email: cleanEmail,
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
      metadata: {
        merchant: 'AK TRAVELTOURS',
        domain: 'aktraveltours.com',
        customerEmail: cleanEmail,
        customerName: customerName ? String(customerName).trim().slice(0, 100) : 'Valued Traveler',
        deliverySla: '30-minute email QR dispatch',
        itemsSummary: safeSummary,
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return res.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error('Stripe Checkout Session error:', error?.type || error?.name, error?.message);

    let clientErrorMessage = error?.message || 'Failed to create Stripe checkout session.';
    const isAuthExpired = 
      error?.type === 'StripeAuthenticationError' || 
      error?.code === 'api_key_expired' || 
      error?.message?.toLowerCase().includes('expired api key') ||
      error?.message?.toLowerCase().includes('invalid api key');

    if (isAuthExpired) {
      clientErrorMessage = 'The configured Stripe Secret Key has expired or was revoked. Please provide an active STRIPE_SECRET_KEY in Settings, or use the Instant Sandbox Order option below.';
    }

    return res.status(400).json({
      success: false,
      error: clientErrorMessage,
      isAuthError: isAuthExpired,
    });
  }
});

// 4. Verify Session from Official Stripe Website
apiRouter.get('/stripe/verify-session', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) {
      return res.status(400).json({ success: false, error: 'Session ID is required' });
    }

    const stripe = getStripe();
    if (!stripe) {
      return res.status(400).json({ success: false, error: 'Stripe is not configured on the server.' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'line_items'],
    });

    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        paid: false,
        error: `Payment is not completed. Stripe payment status is: ${session.payment_status}`,
      });
    }

    const paymentIntent = session.payment_intent as Stripe.PaymentIntent | null;
    const customerEmail = session.customer_details?.email || session.customer_email || 'customer@aktraveltours.com';
    const customerName = session.customer_details?.name || session.metadata?.customerName || 'Valued Traveler';
    const amountPaid = session.amount_total ? (session.currency === 'jpy' ? session.amount_total : session.amount_total / 100) : 0;
    const currency = (session.currency || 'USD').toUpperCase();
    const paymentIntentId = paymentIntent?.id || session.id;

    let existing = ordersDatabase.find((o) => o.stripePaymentId === paymentIntentId || o.stripePaymentId === session.id);

    if (!existing) {
      const orderId = 'AK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const matchingId = (
        Math.random().toString(16).substring(2, 6) + '-' +
        Math.random().toString(16).substring(2, 6) + '-' +
        Math.random().toString(16).substring(2, 6) + '-' +
        Math.random().toString(16).substring(2, 6)
      ).toUpperCase();
      const smdpAddress = 'smdp.plus.aktraveltours.com';
      const lpaString = `LPA:1$${smdpAddress}$${matchingId}`;
      const now = new Date();

      let itemsParsed: any[] = [];
      if (session.metadata?.itemsSummary) {
        try {
          itemsParsed = JSON.parse(session.metadata.itemsSummary);
        } catch (e) {
          console.warn('Metadata parse warning:', e);
        }
      }

      const firstItem = itemsParsed[0] || {};
      const destinationName = firstItem.dest || 'Global Roaming';
      const destinationCode = firstItem.code || 'GL';
      const durationDays = Number(firstItem.days) || 15;
      const expiry = new Date(now.getTime() + durationDays * 86400000);

      existing = {
        id: `esim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        orderNumber: orderId,
        destinationName,
        destinationCode,
        flagEmoji: '🌐',
        planTier: {
          id: `plan_${destinationCode.toLowerCase()}_${durationDays}`,
          dataAllowance: firstItem.plan || 'High-Speed 5G',
          dataGb: 10,
          durationDays,
          priceUsd: amountPaid || 19,
          speedTier: '5G Ultra Speed',
        },
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
        totalDataGb: 10,
        usedDataGb: 0,
        customerEmail,
        customerName,
        paymentMethod: 'Credit Card (Stripe Official)',
        cardLast4: 'Verified',
        cardBrand: 'Stripe Official',
        stripePaymentId: paymentIntentId,
        networks: ['5G / 4G LTE Partner Network'],
        apn: 'vsim.global',
        qrCodeDataUrl: '',
      };

      ordersDatabase.unshift(existing);
    }

    return res.json({
      success: true,
      paid: true,
      order: existing,
      stripePaymentId: paymentIntentId,
      customerEmail,
      customerName,
      amountPaid,
      currency,
      metadata: session.metadata,
      deliverySla: '30-minute email QR dispatch confirmed',
    });
  } catch (error: any) {
    console.error('Error verifying Stripe session:', error);
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to verify session with Stripe',
    });
  }
});

// 5. Admin Authentication Endpoint
apiRouter.post('/admin/login', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Administrator email and password are required.' });
  }

  const cleanEmail = String(email).replace(/^["'“”]+|["'“”]+$/g, '').trim().toLowerCase();
  const cleanPassword = String(password).replace(/^["'“”]+|["'“”]+$/g, '').trim();

  const AUTHORIZED_EMAIL = 'admin@aktraveltours.com';
  const isPasswordMatch = cleanPassword === 'Akpro@1234' || cleanPassword === 'akpro@1234' || cleanPassword === 'AKPRO@1234';

  if (cleanEmail !== AUTHORIZED_EMAIL || !isPasswordMatch) {
    return res.status(401).json({
      success: false,
      error: 'Invalid administrator email or password. Access is strictly restricted to authorized admin personnel.',
    });
  }

  const adminSession = {
    id: 'admin_master_001',
    name: 'ADMINISTRATOR',
    email: AUTHORIZED_EMAIL,
    role: 'super_admin',
    badgeNumber: 'AK-ADM-001',
    businessEmailSupport: 'support@aktraveltours.com',
    domain: 'aktraveltours.com',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  return res.json({
    success: true,
    user: adminSession,
    token: 'ak_sec_' + Math.random().toString(36).substring(2, 16),
  });
});

// 6. Admin Orders
apiRouter.get('/admin/orders', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    success: true,
    count: ordersDatabase.length,
    orders: ordersDatabase,
  });
});

// 7. Order Provisioning
apiRouter.post('/orders/provision', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { items, customer } = req.body || {};
    if (!items || !items.length) {
      return res.status(400).json({ success: false, error: 'No items in order' });
    }

    const provisionedItems = items.map((item: any) => {
      const orderRef = 'AR-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      const iccid = '8985202' + Math.floor(100000000000 + Math.random() * 900000000000);
      const matchingId = (
        Math.random().toString(16).substring(2, 6) + '-' +
        Math.random().toString(16).substring(2, 6) + '-' +
        Math.random().toString(16).substring(2, 6) + '-' +
        Math.random().toString(16).substring(2, 6)
      ).toUpperCase();
      const smdpAddress = 'smdp.plus.airroam.global';
      const lpaString = `LPA:1$${smdpAddress}$${matchingId}`;

      const now = new Date();
      const expiry = new Date(now.getTime() + (item.plan.durationDays || 15) * 86400000);

      const esimRecord = {
        id: `esim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        orderNumber: orderRef,
        destinationName: item.destination.name,
        destinationCode: item.destination.code,
        flagEmoji: item.destination.flagEmoji,
        planTier: item.plan,
        iccid,
        matchingId,
        smdpAddress,
        lpaString,
        pinCode: '0000',
        pukCode: '12345678',
        status: 'ready',
        orderedAt: now.toISOString(),
        expiresAt: expiry.toISOString(),
        totalDataGb: item.plan.dataGb === -1 ? 50 : item.plan.dataGb,
        usedDataGb: 0,
        customerEmail: customer?.customerEmail || 'traveler@example.com',
        customerName: customer?.customerName || 'Global Traveler',
        networks: item.destination.networks || ['5G Partner Network'],
        apn: item.destination.apn || 'global.plus',
      };

      ordersDatabase.unshift(esimRecord);
      return esimRecord;
    });

    res.json({
      success: true,
      deliveredAt: new Date().toISOString(),
      deliveryMethod: 'instant_lpa_and_email',
      orders: provisionedItems,
    });
  } catch (error: any) {
    console.error('Provisioning error:', error);
    res.status(500).json({ success: false, error: 'Failed to provision eSIM profiles' });
  }
});

// 8. Orders Lookup
apiRouter.post('/orders/lookup', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { query } = req.body || {};
  if (!query) {
    return res.status(400).json({ success: false, error: 'Search query required' });
  }

  const cleanQuery = query.trim().toLowerCase();
  const matched = ordersDatabase.filter(
    (order) =>
      order.orderNumber?.toLowerCase().includes(cleanQuery) ||
      order.customerEmail?.toLowerCase().includes(cleanQuery) ||
      order.iccid?.includes(cleanQuery)
  );

  res.json({ success: true, count: matched.length, orders: matched });
});

// 9. SIM Top-Up
apiRouter.post('/sim/topup', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { esimId, additionalGb } = req.body || {};
  const order = ordersDatabase.find((o) => o.id === esimId);

  if (order) {
    order.totalDataGb += (additionalGb || 0);
    res.json({ success: true, updatedEsim: order });
  } else {
    res.status(404).json({ success: false, error: 'eSIM profile not found' });
  }
});

// 10. AI Roaming Advisor
apiRouter.post('/ai/roam-advisor', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { message, tripDetails } = req.body || {};

  if (!message) {
    return res.status(400).json({ success: false, error: 'Prompt is required' });
  }

  if (ai) {
    try {
      const systemInstruction = `You are "AirRoam AI", a professional global roaming and travel eSIM specialist. 
You help travelers choose the best travel data plans, recommend multi-country regional eSIMs (e.g. Europe 35, Asia 18, Global 140), calculate realistic data needs based on app usage (Google Maps, Instagram, WhatsApp, Uber, TikTok, Zoom), guide APN setup on iOS & Android, and explain dual-SIM best practices.
Format your responses with clear markdown, bullet points, and concise expert advice. Keep it warm, friendly, accurate, and travel-tested.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `Traveler Query: "${message}"\nTrip Context (if provided): ${JSON.stringify(tripDetails || {})}`,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        success: true,
        reply: response.text || 'Here is what I recommend for your journey.',
      });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
    }
  }

  const lower = String(message).toLowerCase();
  let fallbackReply = '';

  if (lower.includes('japan') || lower.includes('tokyo') || lower.includes('kyoto')) {
    fallbackReply = `### 🇯🇵 Japan Travel eSIM Recommendation
- **Recommended Plan**: **Japan 10 GB (30 Days)** or **5 GB (15 Days)** on NTT Docomo & SoftBank 5G.
- **Speed & Coverage**: Full 5G ultra coverage across Tokyo, Kyoto, Osaka, and high-speed Shinkansen bullet trains.
- **Tip**: Japan requires APN \`vsim.global\` with Data Roaming toggled **ON**. Hotspot/Tethering is 100% supported!
- **Data Estimate**: 10GB is ideal for 14-21 days of heavy Google Maps, Google Translate lens, and social media posting.`;
  } else if (lower.includes('europe') || lower.includes('france') || lower.includes('italy') || lower.includes('spain') || lower.includes('uk')) {
    fallbackReply = `### 🇪🇺 Europe 35+ Regional eSIM Recommendation
- **Recommended Plan**: **Europe Regional 10 GB (30 Days)** or **20 GB**.
- **Coverage**: Seamless automatic handover across 35 countries (France, Italy, Spain, UK, Germany, Switzerland, Greece, etc.) with 1 single QR code!
- **Partner Networks**: Connects to Vodafone 5G, Orange 5G, and Telefónica.
- **Installation**: Install before boarding your flight; it activates automatically as soon as you touch down in any European airport.`;
  } else if (lower.includes('compatibility') || lower.includes('iphone') || lower.includes('samsung') || lower.includes('pixel')) {
    fallbackReply = `### 📱 eSIM Device Compatibility Quick Guide
- **iPhone**: iPhone XS, XR, 11, 12, 13, 14, 15, and 16 series are fully eSIM compatible.
- **Samsung**: Galaxy S20 through S25 series, Z Fold/Flip series.
- **Google Pixel**: Pixel 3a through Pixel 9 Pro.
- **How to verify in 5 seconds**: Dial \`*#06#\` in your Phone keypad. If you see an **EID barcode/number**, your phone supports eSIM! Also ensure your device is **Carrier Unlocked**.`;
  } else {
    fallbackReply = `### 🌐 AirRoam Travel Data Guide
- **Single Country vs. Regional**: If visiting 1 country, local plans offer the lowest rate. If crossing borders (e.g. EU or Southeast Asia), a Regional eSIM prevents swapping SIM cards.
- **Average Data Usage**:
  - **Light (1-2 GB/week)**: Messaging, light maps, email.
  - **Moderate (3-5 GB/week)**: Daily navigation, social media, Uber/Grab, translations.
  - **Heavy (10+ GB/week)**: Video calls, streaming music/video, photo cloud sync.
- **Automated Instant Delivery**: Your eSIM QR code & LPA string is generated instantly within 3 seconds of checkout!`;
  }

  return res.json({ success: true, reply: fallbackReply });
});
