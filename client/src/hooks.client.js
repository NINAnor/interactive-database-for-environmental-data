import { handleErrorWithSentry } from '@sentry/sveltekit'
import * as Sentry from '@sentry/sveltekit'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_SENTRY_ENV,
  enabled: import.meta.env.VITE_SENTRY_ENV === 'production',
  // Performance Monitoring
  tracesSampleRate: 0.05 //  Capture 100% of the transactions
})

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
