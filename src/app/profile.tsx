import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';

import { Button, Card, Field, Screen } from '@/components/ui';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppStore } from '@/lib/app-store';

export default function ProfileScreen() {
  const { profile, saveProfile, signOut, refreshCurrentLocation, locationLoading } = useAppStore();
  const [name, setName] = useState(profile.role === 'farmer' ? profile.farm : profile.name);
  const [location, setLocation] = useState(profile.location);
  const [saving, setSaving] = useState(false);
  const useLocation = async () => {
    try {
      const next = await refreshCurrentLocation();
      if (next.label) setLocation(next.label);
    } catch (error) {
      Alert.alert('Location unavailable', error instanceof Error ? error.message : 'Unable to determine your location.');
    }
  };
  const save = async () => {
    setSaving(true);
    try {
      const trimmedLocation = location.trim();
      let coordinates = {
        latitude: profile.latitude,
        longitude: profile.longitude,
      };

      if (!trimmedLocation) {
        coordinates = { latitude: undefined, longitude: undefined };
      } else if (trimmedLocation.toLowerCase() !== profile.location.trim().toLowerCase()) {
        const matches = await Location.geocodeAsync(trimmedLocation);
        const match = matches[0];
        if (!match) {
          Alert.alert('Location not found', 'We could not find that town or district. Try a nearby town, district, or a more specific location.');
          return;
        }
        coordinates = { latitude: match.latitude, longitude: match.longitude };
      }

      await saveProfile({
        ...profile,
        name: isFarmer ? profile.name : name,
        farm: isFarmer ? name : profile.farm,
        location: trimmedLocation,
        ...coordinates,
      });
      Alert.alert('Profile saved', coordinates.latitude != null ? 'Your location coordinates are ready for maps and deliveries.' : 'Your profile details were saved.');
    } catch (error) {
      Alert.alert('Unable to save profile', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setSaving(false);
    }
  };
  const isFarmer = profile.role === 'farmer';
  return <Screen><Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/')}><Text style={styles.back}>←  Back to home</Text></Pressable><View style={styles.intro}><Text style={styles.title}>Your profile</Text><Text style={styles.subtitle}>Keep your account information up to date.</Text></View><View style={styles.hero}><View style={styles.avatar}><Text style={styles.avatarText}>{name[0] ?? 'A'}</Text></View><Text style={styles.heroName}>{name || 'Your profile'}</Text><Text style={styles.heroLocation}>{location || 'Add your location'}</Text></View><Card><Text style={styles.label}>PERSONAL INFORMATION</Text><Field label={isFarmer ? 'Farm or business name' : 'Full name'} value={name} onChangeText={setName} /><Field label="Town or district" value={location} onChangeText={setLocation} /><Text style={styles.locationHint}>Type a town or district to map it, or use your phone’s current GPS location.</Text><Button variant="soft" disabled={locationLoading || saving} onPress={useLocation}>{locationLoading ? 'Finding your location…' : 'Use current GPS location'}</Button><Button disabled={saving} onPress={() => void save()}>{saving ? 'Saving location…' : 'Save changes'}</Button></Card><Button variant="danger" onPress={async () => { await signOut(); router.replace('/'); }}>Sign out</Button></Screen>;
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
  locationHint: { color: Colors.muted, fontSize: 13, lineHeight: 19 },
});
