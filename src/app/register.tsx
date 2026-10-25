import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Body, Button, Field, Screen } from '@/components/ui';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { requireSupabase } from '@/lib/supabase';

export default function RegisterScreen() {
  const { role = 'customer' } = useLocalSearchParams<{ role?: string }>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const isFarmer = role === 'farmer';

  const register = async () => {
    if (!name.trim() || !email.trim() || password.length < 6 || !accepted) return;
    const client = requireSupabase();
    const result = await client.auth.signUp({ email: email.trim(), password });
    if (result.error) {
      Alert.alert('Registration failed', result.error.message);
      return;
    }
    if (!result.data.user) {
      Alert.alert('Check your email', 'Confirm your email address, then sign in.');
      router.replace(`/auth?role=${role}`);
      return;
    }
    const profile = await client.from('profiles').upsert({
      id: result.data.user.id,
      full_name: name.trim(),
      role: isFarmer ? 'farmer' : 'customer',
      location: null,
    });
    if (profile.error) {
      Alert.alert('Profile setup failed', profile.error.message);
      return;
    }
    router.replace(isFarmer ? '/farmer' : '/customer');
  };

  return (
    <Screen>
      <Pressable onPress={() => router.back()}><Text style={styles.back}>← Back</Text></Pressable>
      <View style={styles.intro}><Text style={styles.badge}>{isFarmer ? 'FARMER ACCOUNT' : 'CUSTOMER ACCOUNT'}</Text><Text style={styles.title}>Create your account</Text><Body muted>Join AgriBridge and connect directly with local agriculture.</Body></View>
      <View style={styles.form}>
        <Field label="Full name" value={name} onChangeText={setName} placeholder="Your full name" />
        <Field label="Email address" value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" />
        <Field label="Password" value={password} onChangeText={setPassword} placeholder="At least 6 characters" secureTextEntry />
        <Pressable onPress={() => setAccepted(!accepted)} style={styles.checkRow}><View style={[styles.checkbox, accepted && styles.checked]}>{accepted ? <Text style={styles.check}>✓</Text> : null}</View><Text style={styles.terms}>I agree to the terms and privacy notice</Text></Pressable>
        <Button disabled={!name.trim() || !email.trim() || password.length < 6 || !accepted} onPress={register}>Create account</Button>
      </View>
      <Text style={styles.switch}>Already have an account? <Text onPress={() => router.replace(`/auth?role=${role}`)} style={styles.link}>Sign in</Text></Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { color: Colors.green, fontSize: 16, fontWeight: '800' },
  intro: { gap: Spacing.md, marginTop: Spacing.lg },
  badge: { color: Colors.green, backgroundColor: Colors.limeSoft, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99, fontWeight: '800', fontSize: 12 },
  title: { color: Colors.ink, fontSize: 34, lineHeight: 40, fontWeight: '800', letterSpacing: -1 },
  form: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.line, borderRadius: Radius.lg, padding: Spacing.md, gap: Spacing.md, marginTop: Spacing.lg },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1, borderColor: Colors.line, alignItems: 'center', justifyContent: 'center' },
  checked: { backgroundColor: Colors.green, borderColor: Colors.green },
  check: { color: '#fff', fontWeight: '800' },
  terms: { color: Colors.inkSoft, flex: 1 },
  switch: { color: Colors.inkSoft, textAlign: 'center', marginTop: Spacing.md },
  link: { color: Colors.green, fontWeight: '800' },
});
