import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Body, Button, Card, Field, Screen } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { requireSupabase } from '@/lib/supabase';

const recoveryRedirect = 'agribridge://reset-password';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const sendResetLink = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      Alert.alert('Email required', 'Enter the email address linked to your AgriBridge account.');
      return;
    }

    setSending(true);
    try {
      const { error } = await requireSupabase().auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: recoveryRedirect,
      });
      if (error) throw error;
      Alert.alert('Check your email', 'We sent a secure password reset link. Open it on this device to choose a new password.', [
        { text: 'Back to sign in', onPress: () => router.replace('/auth') },
      ]);
    } catch (error) {
      Alert.alert('Unable to send reset link', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Screen>
      <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/auth')} style={styles.back}>
        <Ionicons name="arrow-back" size={22} color={Colors.green} />
      </Pressable>
      <View style={styles.intro}>
        <Text style={styles.badge}>ACCOUNT RECOVERY</Text>
        <Text style={styles.title}>Reset your password</Text>
        <Body muted>Enter your email and we’ll send you a secure link to create a new password.</Body>
      </View>
      <Card style={styles.form}>
        <Field
          label="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="name@example.com"
          editable={!sending}
        />
        <Button disabled={sending || !email.trim()} onPress={() => void sendResetLink()}>
          {sending ? 'Sending link...' : 'Send reset link'}
        </Button>
      </Card>
      <Text style={styles.help}>If you don’t see the email, check your spam folder and confirm that the address is correct.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.limeSoft, alignItems: 'center', justifyContent: 'center' },
  intro: { gap: Spacing.md, marginTop: Spacing.lg },
  badge: { color: Colors.green, backgroundColor: Colors.limeSoft, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99, fontWeight: '800', fontSize: 12 },
  title: { color: Colors.ink, fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  form: { marginTop: Spacing.lg },
  help: { color: Colors.muted, textAlign: 'center', fontSize: 13, lineHeight: 19, marginTop: Spacing.md },
});
