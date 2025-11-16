// Helper function to ensure boolean values
const getBooleanValue = (envVar, defaultValue = false) => {
  if (envVar === undefined || envVar === null) return defaultValue;
  if (typeof envVar === 'boolean') return envVar;
  if (typeof envVar === 'string') {
    return envVar.toLowerCase() === 'true';
  }
  return Boolean(envVar);
};

export default {
  expo: {
    name: 'app',
    slug: 'app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    ios: {
      supportsTablet: getBooleanValue(process.env.EXPO_IOS_SUPPORTS_TABLET, true)
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      }
    },
    web: {
      favicon: './assets/favicon.png'
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    }
  }
};
