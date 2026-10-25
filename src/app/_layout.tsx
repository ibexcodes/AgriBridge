import { Stack } from 'expo-router';

import '../global.css';
import { AppStoreProvider } from '@/lib/app-store';

export default function RootLayout() {
  return (
    <AppStoreProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
    </AppStoreProvider>
  );
}
