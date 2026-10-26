import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ListingCard } from '@/components/listing-card';
import { Screen } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { useAppStore } from '@/lib/app-store';

export default function FavoritesScreen() {
  const { listings, favoriteIds, loading } = useAppStore();
  const favorites = listings.filter((listing) => listing.isActive && favoriteIds.includes(listing.id));

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Go back" onPress={() => router.canGoBack() ? router.back() : router.replace('/customer')} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.green} />
        </Pressable>
        <View style={styles.heading}>
          <Text style={styles.title}>Saved listings</Text>
          <Text style={styles.subtitle}>{favoriteIds.length} {favoriteIds.length === 1 ? 'listing' : 'listings'} saved</Text>
        </View>
        <Ionicons name="heart" size={26} color={Colors.red} />
      </View>

      {loading ? <Text style={styles.message}>Loading your saved listings…</Text> : null}
      {!loading && favorites.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}><Ionicons name="heart-outline" size={42} color={Colors.green} /></View>
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.message}>Tap the heart on any listing to save it here for quick access later.</Text>
          <Pressable style={styles.browse} onPress={() => router.replace('/customer')}>
            <Text style={styles.browseText}>Browse listings</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.list}>
          {favorites.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingBottom: Spacing.lg },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.limeSoft, alignItems: 'center', justifyContent: 'center' },
  heading: { flex: 1, gap: 3 },
  title: { color: Colors.ink, fontSize: 28, fontWeight: '800' },
  subtitle: { color: Colors.muted, fontSize: 14 },
  list: { gap: Spacing.md },
  empty: { alignItems: 'center', paddingTop: 72, paddingHorizontal: Spacing.lg, gap: Spacing.md },
  emptyIcon: { width: 84, height: 84, borderRadius: 42, backgroundColor: Colors.limeSoft, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: Colors.ink, fontSize: 22, fontWeight: '800' },
  message: { color: Colors.muted, fontSize: 15, lineHeight: 22, textAlign: 'center' },
  browse: { backgroundColor: Colors.green, borderRadius: 24, paddingHorizontal: 22, paddingVertical: 13, marginTop: Spacing.sm },
  browseText: { color: '#fff', fontWeight: '800' },
});
