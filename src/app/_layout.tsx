import { Stack } from 'expo-router';

import { AppStoreProvider } from '@/lib/app-store';

export default function RootLayout() {
  return (
    <AppStoreProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
    </AppStoreProvider>
  );
}
