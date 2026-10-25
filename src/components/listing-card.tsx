import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Listing } from '@/lib/types';
import { Colors, Radius, Spacing } from '@/constants/theme';

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Pressable onPress={() => router.push(`/listing/${listing.id}`)} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Image source={listing.image} style={styles.image} />
      <View style={styles.body}>
        <View style={styles.row}><Text style={styles.category}>{listing.category.toUpperCase()}</Text><Text style={styles.favorite}>♡</Text></View>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.unit}>{listing.unit}</Text>
        <Text style={styles.price}>BWP {listing.price.toFixed(2)}</Text>
        <View style={styles.meta}><Text style={styles.muted}>⌖ {listing.location}</Text><Text style={styles.muted}>{listing.mode === 'rent' ? 'For rent' : 'For sale'}</Text></View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.line },
  image: { width: '100%', height: 190 },
  body: { padding: Spacing.md, gap: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  category: { color: Colors.green, fontSize: 12, fontWeight: '800', letterSpacing: 0.4 },
  favorite: { color: Colors.red, fontSize: 26, lineHeight: 22 },
  title: { color: Colors.ink, fontSize: 23, fontWeight: '800' },
  unit: { color: Colors.muted, fontSize: 15 },
  price: { color: Colors.green, fontSize: 21, fontWeight: '800', marginTop: 8 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  muted: { color: Colors.inkSoft, fontSize: 13, fontWeight: '600' },
  pressed: { opacity: 0.85 },
});
