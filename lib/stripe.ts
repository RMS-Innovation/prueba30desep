import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  typescript: true,
})

export const formatAmountForDisplay = (amount: number, currency: string): string => {
  const numberFormat = new Intl.NumberFormat(["es-MX"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  })
  return numberFormat.format(amount)
}

export const formatAmountForStripe = (amount: number, currency: string): number => {
  const numberFormat = new Intl.NumberFormat(["es-MX"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  })
  const parts = numberFormat.formatToParts(amount)
  let zeroDecimalCurrency = true
  for (const part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100)
}

// Create or retrieve Stripe customer
export const getOrCreateStripeCustomer = async (userId: string, email: string, name: string) => {
  const customers = await stripe.customers.list({
    email: email,
    limit: 1,
  })

  if (customers.data.length > 0) {
    return customers.data[0]
  }

  return await stripe.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  })
}

// Create subscription
export const createSubscription = async (customerId: string, priceId: string) => {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
  })
}

// Cancel subscription
export const cancelSubscription = async (subscriptionId: string, cancelAtPeriodEnd = true) => {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: cancelAtPeriodEnd,
  })
}

// Create payment intent for one-time course purchase
export const createPaymentIntent = async (amount: number, currency: string, customerId: string, metadata: any) => {
  return await stripe.paymentIntents.create({
    amount: formatAmountForStripe(amount, currency),
    currency,
    customer: customerId,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  })
}
