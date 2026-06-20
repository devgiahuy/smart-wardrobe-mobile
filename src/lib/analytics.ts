export const analytics = {
  logEvent: (eventName: string, params?: Record<string, any>) => {
    if (__DEV__) {
      console.log(`[Analytics] ${eventName}`, params);
    }
    // Integrate with actual provider like Firebase Analytics or Mixpanel later
  },
  setUser: (userId: string) => {
    if (__DEV__) {
      console.log(`[Analytics] Set user: ${userId}`);
    }
  },
};
