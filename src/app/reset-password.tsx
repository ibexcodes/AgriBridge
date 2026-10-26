import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Body, Button, Card, Field, Screen } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { requireSupabase, supabase } from '@/lib/supabase';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase?.auth.getSession().then(({ data }) => setReady(Boolean(data.session))).catch(() => setReady(false));
  }, []);

  const updatePassword = async () => {
    if (password.length < 6) {
      Alert.alert('Password too short', 'Use at least 6 characters.');
      return;
    }
    if (password !== confirmation) {
      Alert.alert('Passwords do not match', 'Enter the same password in both fields.');
      return;
    }

    setSaving(true);
    try {
      const { error } = await requireSupabase().auth.updateUser({ password });
      if (error) throw error;
      Alert.alert('Password updated', 'Your password has been changed. You can now sign in with it.', [
        { text: 'Continue', onPress: () => router.replace('/role') },
      ]);
    } catch (error) {
      Alert.alert('Unable to update password', error instanceof Error ? error.message : 'Your reset link may have expired. Request a new one.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <Pressable onPress={() => router.replace('/')} style={styles.back}>
        <Ionicons name="arrow-back" size={22} color={Colors.green} />
      </Pressable>
      <View style={styles.intro}>
        <Text style={styles.badge}>NEW PASSWORD</Text>
        <Text style={styles.title}>Choose a new password</Text>
        <Body muted>{ready ? 'Use a strong password you have not used elsewhere.' : 'Open this screen from the password reset email to continue.'}</Body>
      </View>
      <Card style={styles.form}>
        <Field label="New password" value={password} onChangeText={setPassword} secureTextEntry placeholder="At least 6 characters" editable={ready && !saving} />
        <Field label="Confirm new password" value={confirmation} onChangeText={setConfirmation} secureTextEntry placeholder="Enter it again" editable={ready && !saving} />
        <Button disabled={!ready || saving || !password || !confirmation} onPress={() => void updatePassword()}>
          {saving ? 'Updating password...' : 'Update password'}
        </Button>
        {!ready ? <Text style={styles.help}>This reset link is invalid or has expired. Request a new link and open it on this device.</Text> : null}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.limeSoft, alignItems: 'center', justifyContent: 'center' },
  intro: { gap: Spacing.md, marginTop: Spacing.lg },
  badge: { color: Colors.green, backgroundColor: Colors.limeSoft, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99, fontWeight: '800', fontSize: 12 },
  title: { color: Colors.ink, fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  form: { marginTop: Spacing.lg },
  help: { color: Colors.red, fontSize: 13, lineHeight: 19 },
});
