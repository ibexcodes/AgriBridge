import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Button, Card, Field, Screen } from '@/components/ui';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppStore } from '@/lib/app-store';

export default function ProfileScreen() {
  const { profile, saveProfile, signOut } = useAppStore();
  const [name, setName] = useState(profile.farm);
  const [location, setLocation] = useState(profile.location);
  return <Screen><Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/')}><Text style={styles.back}>←  Back to home</Text></Pressable><View style={styles.intro}><Text style={styles.title}>Your profile</Text><Text style={styles.subtitle}>Keep your account information up to date.</Text></View><View style={styles.hero}><View style={styles.avatar}><Text style={styles.avatarText}>{name[0] ?? 'A'}</Text></View><Text style={styles.heroName}>{name || 'Your profile'}</Text><Text style={styles.heroLocation}>{location || 'Add your location'}</Text></View><Card><Text style={styles.label}>PERSONAL INFORMATION</Text><Field label="Farm or business name" value={name} onChangeText={setName} /><Field label="Town or district" value={location} onChangeText={setLocation} /><Button onPress={() => saveProfile({ ...profile, farm: name, location })}>Save changes</Button></Card><Button variant="danger" onPress={async () => { await signOut(); router.replace('/'); }}>Sign out</Button></Screen>;
}

const styles = StyleSheet.create({
  back: { color: Colors.green, fontWeight: '800', fontSize: 16 },
  intro: { gap: Spacing.sm, marginTop: Spacing.lg },
  title: { color: Colors.ink, fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  subtitle: { color: Colors.inkSoft, fontSize: 17 },
  hero: { backgroundColor: Colors.green, borderRadius: Radius.xl, alignItems: 'center', padding: Spacing.lg, gap: 5 },
  avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: Colors.lime, alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  avatarText: { color: Colors.greenDeep, fontSize: 32, fontWeight: '800' },
  heroName: { color: '#fff', fontSize: 23, fontWeight: '800' },
  heroLocation: { color: 'rgba(255,255,255,0.75)', fontSize: 16 },
  label: { color: Colors.inkSoft, fontSize: 12, fontWeight: '800', letterSpacing: 0.8 },
});
