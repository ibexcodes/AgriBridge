import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Body, Button, Field, Screen } from '@/components/ui';
import { Colors, Radius, Spacing } from '@/constants/theme';

export default function RegisterScreen() {
  const { role = 'customer' } = useLocalSearchParams<{ role?: string }>();
  const [accepted, setAccepted] = useState(false);
  const isFarmer = role === 'farmer';
  return (
    <Screen>
      <Pressable onPress={() => router.back()}><Text style={styles.back}>←  Back</Text></Pressable>
      <View style={styles.intro}><Text style={styles.badge}>{isFarmer ? 'FARMER ACCOUNT' : 'CUSTOMER ACCOUNT'}</Text><Text style={styles.title}>Create your account</Text><Body muted>Join AgriBridge and get more from every season.</Body></View>
      <View style={styles.form}>
        <Field label="Full name" placeholder="Johanson Sebudi" />
        <Field label="Email address" placeholder="name@example.com" keyboardType="email-address" />
        <Field label="Password" placeholder="Create a password" secureTextEntry />
        <Pressable onPress={() => setAccepted(!accepted)} style={styles.checkRow}><View style={[styles.checkbox, accepted && styles.checked]}>{accepted ? <Text style={styles.check}>✓</Text> : null}</View><Text style={styles.terms}>I agree to the terms and privacy notice</Text></Pressable>
        <Button disabled={!accepted} onPress={() => router.replace(isFarmer ? '/farmer' : '/customer')}>Create account</Button>
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
