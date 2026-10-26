import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Body, Button, Field, Screen } from '@/components/ui';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { requireSupabase } from '@/lib/supabase';

export default function AuthScreen() {
  const { role = 'customer' } = useLocalSearchParams<{ role?: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isFarmer = role === 'farmer';

  return (
    <Screen>
      <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/role')} style={styles.back}><Ionicons name="arrow-back" size={22} color={Colors.green} /></Pressable>
      <View style={styles.intro}><Text style={styles.badge}>{isFarmer ? 'FARMER ACCOUNT' : 'CUSTOMER ACCOUNT'}</Text><Text style={styles.title}>Welcome back</Text><Body muted>Sign in to continue your agricultural journey.</Body></View>
      <View style={styles.form}>
        <Field label="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="name@example.com" />
        <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Enter your password" />
        <Pressable onPress={() => router.push('/forgot-password')}><Text style={styles.forgot}>Forgot password?</Text></Pressable>
        <Button onPress={async () => {
          const result = await requireSupabase().auth.signInWithPassword({ email: email.trim(), password });
          if (result.error) {
            Alert.alert('Sign in failed', result.error.message);
            return;
          }
          router.replace(isFarmer ? '/farmer' : '/customer');
        }}>Sign in</Button>
      </View>
      <View style={styles.switch}><Text style={styles.switchText}>Don’t have an account?</Text><Pressable onPress={() => router.push(`/register?role=${role}`)}><Text style={styles.link}> Create an account</Text></Pressable></View>
      <Text style={styles.demo}>Sign in to access your account and manage marketplace activity.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.limeSoft, alignItems: 'center', justifyContent: 'center' },
  intro: { gap: Spacing.md, marginTop: Spacing.lg },
  badge: { color: Colors.green, backgroundColor: Colors.limeSoft, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99, fontWeight: '800', fontSize: 12 },
  title: { color: Colors.ink, fontSize: 38, fontWeight: '800', letterSpacing: -1 },
  form: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.line, borderRadius: Radius.lg, padding: Spacing.md, gap: Spacing.md, marginTop: Spacing.lg },
  forgot: { color: Colors.green, textAlign: 'right', fontWeight: '800' },
  switch: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.sm },
  switchText: { color: Colors.inkSoft },
  link: { color: Colors.green, fontWeight: '800' },
  demo: { color: Colors.muted, textAlign: 'center', fontSize: 12, lineHeight: 18, marginTop: Spacing.md },
});
