import * as Sentry from '@sentry/react-native';

export const routingInstrumentation = undefined;

export function initSentry() {
  if (!__DEV__) {
    Sentry.init({
      dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || '',
      tracesSampleRate: 1.0,
      // integrations: [
      //   new Sentry.ReactNativeTracing({
      //     routingInstrumentation,
      //   }),
      // ],
    });
  }
}
