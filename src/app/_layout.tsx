import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import '../global.css';
import { AppStoreProvider } from '@/lib/app-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppStoreProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
    </AppStoreProvider>
  );
}
