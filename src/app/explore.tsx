import { useMemo, useState } from 'react';
import { ScrollView, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

const listings = [
  {
    title: 'Fresh tomatoes',
    category: 'Produce',
    price: '$18',
    unit: 'per crate',
    location: 'Murang’a',
    owner: 'Amina K.',
    delivery: 'Same day',
    accent: '#2e7d32',
  },
  {
    title: '4WD tractor',
    category: 'Machinery',
    price: '$1,450',
    unit: 'per week',
    location: 'Eldoret',
    owner: 'Kipkoech T.',
    delivery: 'Pickup',
    accent: '#f59e0b',
  },
  {
    title: 'Balanced NPK blend',
    category: 'Fertilizer',
    price: '$54',
    unit: 'per 25kg',
    location: 'Mombasa',
    owner: 'Musa Y.',
    delivery: '2 day delivery',
    accent: '#10b981',
  },
  {
    title: 'Cabbage contract',
    category: 'Produce',
    price: '$120',
    unit: 'per acre',
    location: 'Nyeri',
    owner: 'Grace N.',
    delivery: 'Harvest ready',
    accent: '#22c55e',
  },
  {
    title: 'Irrigation pump kit',
    category: 'Machinery',
    price: '$880',
    unit: 'one-time',
    location: 'Nakuru',
    owner: 'Benson J.',
    delivery: 'Install support',
    accent: '#f97316',
  },
  {
    title: 'Compost booster',
    category: 'Fertilizer',
    price: '$39',
    unit: 'per bag',
    location: 'Kisii',
    owner: 'Zawadi S.',
    delivery: 'In stock',
    accent: '#14b8a6',
  },
] as const;

const filters = ['All', 'Produce', 'Machinery', 'Fertilizer'] as const;

export default function ExploreScreen() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('All');

  const filteredListings = useMemo(() => {
    if (activeFilter === 'All') {
      return listings;
    }
    return listings.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.titleRow}>
            <ThemedText type="subtitle">Marketplace</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              96 open listings
            </ThemedText>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {filters.map((filter) => (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[styles.filterButton, activeFilter === filter && styles.filterButtonActive]}
              >
                <ThemedText type="smallBold" style={activeFilter === filter ? styles.filterTextActive : undefined}>
                  {filter}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>

          {filteredListings.map((item) => (
            <ThemedView
              key={`${item.title}-${item.location}`}
              type="backgroundElement"
              style={[styles.listingCard, { borderColor: item.accent }]}
            >
              <View style={styles.cardTopRow}>
                <View>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.category}
                  </ThemedText>
                  <ThemedText type="default" style={styles.cardTitle}>
                    {item.title}
                  </ThemedText>
                </View>
                <View style={[styles.pill, { backgroundColor: `${item.accent}22` }]}>
                  <ThemedText type="smallBold" style={[styles.pillText, { color: item.accent }]}>
                    {item.delivery}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.priceRow}>
                <ThemedText type="subtitle" style={[styles.priceValue, { color: item.accent }]}>
                  {item.price}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {item.unit}
                </ThemedText>
              </View>

              <View style={styles.cardMeta}>
                <ThemedText type="small" themeColor="textSecondary">
                  {item.location}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {item.owner}
                </ThemedText>
              </View>
            </ThemedView>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    gap: Spacing.three,
    paddingBottom: Spacing.five,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  filterRow: {
    gap: Spacing.two,
    paddingRight: Spacing.two,
  },
  filterButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 999,
    backgroundColor: '#edf7ec',
  },
  filterButtonActive: {
    backgroundColor: '#1e7a3d',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  listingCard: {
    borderRadius: 22,
    padding: Spacing.three,
    borderWidth: 1,
    gap: Spacing.two,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  cardTitle: {
    marginTop: Spacing.half,
    fontWeight: 700,
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    alignSelf: 'flex-start',
  },
  pillText: {
    fontSize: 11,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.one,
  },
  priceValue: {
    fontSize: 28,
    lineHeight: 36,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
});
