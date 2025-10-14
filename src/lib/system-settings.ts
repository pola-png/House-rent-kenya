export interface SystemSettings {
  features: {
    enablePropertyListing: boolean;
    enableCallbackRequests: boolean;
    enableMessaging: boolean;
    enableAdvancedSearch: boolean;
    enablePropertyComparison: boolean;
    enableMarketAnalytics: boolean;
    enableAIRecommendations: boolean;
  };
  proFeatures: {
    featuredListings: boolean;
    prioritySupport: boolean;
    advancedAnalytics: boolean;
    unlimitedListings: boolean;
    customBranding: boolean;
  };
  limits: {
    freeListingsLimit: number;
    proListingsLimit: number;
    featuredDuration: number;
  };
  pricing: {
    proMonthly: number;
    proYearly: number;
    featuredListingPrice: number;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
  };
  moderation: {
    autoApproveListings: boolean;
    requireEmailVerification: boolean;
    requirePhoneVerification: boolean;
  };
}

const defaultSettings: SystemSettings = {
  features: {
    enablePropertyListing: true,
    enableCallbackRequests: true,
    enableMessaging: true,
    enableAdvancedSearch: true,
    enablePropertyComparison: true,
    enableMarketAnalytics: true,
    enableAIRecommendations: true,
  },
  proFeatures: {
    featuredListings: true,
    prioritySupport: true,
    advancedAnalytics: true,
    unlimitedListings: true,
    customBranding: true,
  },
  limits: {
    freeListingsLimit: 5,
    proListingsLimit: 999,
    featuredDuration: 30,
  },
  pricing: {
    proMonthly: 2999,
    proYearly: 29999,
    featuredListingPrice: 999,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  },
  moderation: {
    autoApproveListings: false,
    requireEmailVerification: true,
    requirePhoneVerification: false,
  },
};

export const getSystemSettings = (): SystemSettings => {
  if (typeof window === 'undefined') return defaultSettings;
  const saved = localStorage.getItem('systemSettings');
  return saved ? JSON.parse(saved) : defaultSettings;
};

export const saveSystemSettings = (settings: SystemSettings): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('systemSettings', JSON.stringify(settings));
  }
};

export const isFeatureEnabled = (feature: keyof SystemSettings['features']): boolean => {
  const settings = getSystemSettings();
  return settings.features[feature];
};

export const isProFeatureEnabled = (feature: keyof SystemSettings['proFeatures']): boolean => {
  const settings = getSystemSettings();
  return settings.proFeatures[feature];
};
