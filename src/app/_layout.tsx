import { useEffect } from 'react';
import { Linking } from 'react-native';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AppStoreProvider } from '@/lib/app-store';
import { supabase } from '@/lib/supabase';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function getRecoveryTokens(url: string) {
  const fragment = url.split('#')[1] ?? '';
  const query = url.split('?')[1]?.split('#')[0] ?? '';
  const params = new URLSearchParams(`${query}&${fragment}`);
  return {
    accessToken: params.get('access_token'),
    refreshToken: params.get('refresh_token'),
    isRecovery: params.get('type') === 'recovery' || url.includes('reset-password'),
  };
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  useEffect(() => {
    const handleUrl = async (url: string) => {
      const { accessToken, refreshToken, isRecovery } = getRecoveryTokens(url);
      if (!isRecovery || !accessToken || !refreshToken || !supabase) return;
      const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      if (error) {
        console.error('Password recovery session failed:', error);
        return;
      }
      router.replace('/reset-password');
    };

    Linking.getInitialURL().then((url) => {
      if (url) void handleUrl(url);
    }).catch((error) => console.error('Initial auth link failed:', error));
    const subscription = Linking.addEventListener('url', ({ url }) => void handleUrl(url));
    return () => subscription.remove();
  }, []);

  return (
    <AppStoreProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
    </AppStoreProvider>
  );
}
