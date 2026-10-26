import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ListingCard } from '@/components/listing-card';
import { Chip, Screen, Section } from '@/components/ui';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppStore } from '@/lib/app-store';
import { Category } from '@/lib/types';

const categories: (Category | 'All')[] = ['All', 'Fresh produce', 'Machinery', 'Fertilizer'];

export default function CustomerHome() {
  const { listings, profile } = useAppStore();
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => listings.filter((item) => (category === 'All' || item.category === category) && item.title.toLowerCase().includes(query.toLowerCase())), [category, listings, query]);

  return (
    <Screen>
      <View style={styles.header}><View><Text style={styles.greeting}>{profile.name}</Text><Text style={styles.welcome}>Good morning, welcome back</Text></View><Pressable style={styles.bell} onPress={() => router.push('/messages')}><Ionicons name="notifications-outline" size={22} color="#fff" /></Pressable></View>
      <Section title="Explore categories" action={<Text style={styles.seeAll}>See all</Text>}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {categories.map((item) => <Chip key={item} active={category === item} onPress={() => setCategory(item)}><View style={styles.chipContent}><Ionicons name={item === 'Fresh produce' ? 'leaf-outline' : item === 'Machinery' ? 'construct-outline' : item === 'Fertilizer' ? 'flask-outline' : 'grid-outline'} size={15} color={category === item ? '#fff' : Colors.inkSoft} /><Text style={[styles.chipLabel, category === item && styles.activeChipLabel]}>{item}</Text></View></Chip>)}
        </ScrollView>
      </Section>
      <Section title="Browse farm products">
        <Text style={styles.subheading}>Buy fresh produce and equipment directly from local farms.</Text>
        <View style={styles.search}><Ionicons name="search-outline" size={20} color={Colors.muted} /><TextInput value={query} onChangeText={setQuery} placeholder="Search products, equipment or farms" placeholderTextColor={Colors.muted} style={styles.searchInput} /></View>
      </Section>
      <View style={styles.list}>{filtered.map((listing) => <ListingCard key={listing.id} listing={listing} />)}</View>
      <View style={styles.nav}><NavItem icon="chatbubble-ellipses-outline" label="Messages" onPress={() => router.push('/messages')} /><NavItem icon="cart-outline" label="Cart" /><View style={styles.favorite}><Ionicons name="heart" size={24} color={Colors.lime} /></View><NavItem icon="receipt-outline" label="Orders" /><NavItem icon="person-outline" label="Profile" onPress={() => router.push('/profile')} /></View>
    </Screen>
  );
}

function NavItem({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress?: () => void }) {
  return <Pressable onPress={onPress} style={styles.navItem}><Ionicons name={icon} size={22} color={Colors.inkSoft} /><Text style={styles.navLabel}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.green, marginHorizontal: -Spacing.lg, marginTop: -Spacing.lg, padding: Spacing.lg, paddingTop: 22, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { color: Colors.lime, fontSize: 15, fontWeight: '800' },
  welcome: { color: '#fff', fontSize: 17, marginTop: 6 },
  bell: { width: 46, height: 46, borderRadius: 23, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  seeAll: { color: Colors.green, fontWeight: '800' },
  chips: { gap: Spacing.sm },
  chipContent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chipLabel: { color: Colors.inkSoft, fontWeight: '700', fontSize: 14 },
  activeChipLabel: { color: '#fff' },
  subheading: { color: Colors.inkSoft, lineHeight: 22, marginTop: -6 },
  search: { height: 58, borderRadius: Radius.md, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, gap: 10 },
  searchInput: { flex: 1, color: Colors.ink, fontSize: 15 },
  list: { gap: Spacing.md },
  nav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 76, backgroundColor: Colors.surface, borderTopWidth: 1, borderColor: Colors.line, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  navItem: { alignItems: 'center', gap: 4, minWidth: 55 },
  navLabel: { color: Colors.inkSoft, fontSize: 11, fontWeight: '700' },
  favorite: { width: 58, height: 58, marginTop: -28, borderRadius: 29, backgroundColor: Colors.green, borderWidth: 5, borderColor: Colors.canvas, alignItems: 'center', justifyContent: 'center' },
  favoriteText: { color: Colors.lime, fontSize: 24 },
});
