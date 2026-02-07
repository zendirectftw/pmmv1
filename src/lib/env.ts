/**
 * Server-side env validation. Use in API routes or server components if needed.
 * Client should only use NEXT_PUBLIC_* vars.
 */
function getEnv(key: string): string | undefined {
  return process.env[key];
}

export const env = {
  get databaseUrl() {
    return getEnv("DATABASE_URL");
  },
  get nextAuthUrl() {
    return getEnv("NEXTAUTH_URL") ?? "http://localhost:3000";
  },
  get nextAuthSecret() {
    return getEnv("NEXTAUTH_SECRET");
  },
  get stripeSecretKey() {
    return getEnv("STRIPE_SECRET_KEY");
  },
  get stripeWebhookSecret() {
    return getEnv("STRIPE_WEBHOOK_SECRET");
  },
  get metalsApiKey() {
    return getEnv("METALS_API_KEY");
  },
  get metalsApiUrl() {
    return getEnv("METALS_API_URL");
  },
} as const;
