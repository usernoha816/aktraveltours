import { loadStripe, Stripe as StripeClient } from '@stripe/stripe-js';

let stripePromise: Promise<StripeClient | null> | null = null;

/**
 * Initializes and caches the Stripe.js instance dynamically using the configured publishable key.
 *
 * @param publishableKey - Optional Stripe publishable key override (e.g. from /api/stripe/config).
 * @returns Promise resolving to the initialized Stripe client or null if no key is configured.
 */
export function getStripeClient(publishableKey?: string | null): Promise<StripeClient | null> {
  const key = (
    publishableKey ||
    ((import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY as string) ||
    ''
  ).trim();

  if (!key) {
    return Promise.resolve(null);
  }

  if (!stripePromise) {
    stripePromise = loadStripe(key);
  }

  return stripePromise;
}

/**
 * Redirects the user directly to a created Stripe Checkout Session using either
 * the official session URL or Stripe.js redirectToCheckout client method.
 *
 * @param params - Contains either url, sessionId, and optional publishableKey.
 */
export async function redirectToStripeCheckout(params: {
  url?: string | null;
  sessionId?: string | null;
  publishableKey?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  const { url, sessionId, publishableKey } = params;

  // Modern Stripe recommends direct navigation to the dynamic hosted session URL
  if (url) {
    window.location.href = url;
    return { success: true };
  }

  // Fallback to redirectToCheckout via @stripe/stripe-js
  if (sessionId) {
    const stripe = await getStripeClient(publishableKey);
    if (stripe) {
      const { error } = await (stripe as any).redirectToCheckout({ sessionId });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    }
  }

  return { success: false, error: 'No valid Stripe checkout URL or session ID provided.' };
}
