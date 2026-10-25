import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AppStoreProvider } from '@/lib/app-store';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  return (
    <AppStoreProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
    </AppStoreProvider>
  );
}
