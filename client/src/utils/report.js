import * as Sentry from '@sentry/sveltekit'

/**
 *
 * @param {Error} error the error to report
 */
export function reportError (error) {
  console.error(error)
  try {
    Sentry.captureException(error)
  } catch (e) {
    console.error('While passing error to sentry')
    console.error(e)
  }
}
