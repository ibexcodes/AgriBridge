import { ScrollView, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

type Category = {
  name: string;
  icon: string;
  label: string;
  accent: string;
};

type Listing = {
  title: string;
  category: 'Produce' | 'Machinery' | 'Fertilizer';
  price: string;
  unit: string;
  location: string;
  distance: string;
  farmer: string;
  accent: string;
};

const stats = [
  { label: 'Live listings', value: '1,284' },
  { label: 'Avg. price', value: '$42/ha' },
  { label: 'Orders this week', value: '318' },
];

const categories: Category[] = [
  { name: 'Produce', icon: '🌾', label: 'Crops & grains', accent: '#2e7d32' },
  { name: 'Machinery', icon: '🚜', label: 'Equipment', accent: '#f59e0b' },
  { name: 'Fertilizer', icon: '🌱', label: 'Inputs', accent: '#10b981' },
  { name: 'Logistics', icon: '🚚', label: 'Transport', accent: '#2563eb' },
];

const featuredListings: Listing[] = [
  {
    title: 'Premium maize kernels',
    category: 'Produce',
    price: '$210',
    unit: 'per ton',
    location: 'Kiambu County',
    distance: '8 km away',
    farmer: 'Wanjiku Farms',
    accent: '#2e7d32',
  },
  {
    title: 'Compact tractor bundle',
    category: 'Machinery',
    price: '$4,800',
    unit: 'for lease',
    location: 'Nakuru',
    distance: '26 km away',
    farmer: 'Hillcrest Agri',
    accent: '#f59e0b',
  },
  {
    title: 'Organic fertilizer mix',
    category: 'Fertilizer',
    price: '$68',
    unit: 'per bag',
    location: 'Kisumu',
    distance: '41 km away',
    farmer: 'GreenField Inputs',
    accent: '#10b981',
  },
];

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.heroCard}>
            <View style={styles.topBar}>
              <View>
                <ThemedText type="small" themeColor="textSecondary">
                  Good morning
                </ThemedText>
                <ThemedText type="subtitle">AgriBridge</ThemedText>
              </View>
              <Pressable style={styles.primaryButton}>
                <ThemedText type="smallBold" style={styles.primaryText}>
                  + New listing
                </ThemedText>
              </Pressable>
            </View>

            <ThemedText style={styles.heroText}>
              Connecting farmers for produce, machinery, and fertilizer trading.
            </ThemedText>

            <ThemedView type="backgroundElement" style={styles.searchBar}>
              <ThemedText type="small" themeColor="textSecondary">
                Search crops, equipment, or inputs
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <ThemedView key={stat.label} type="backgroundElement" style={styles.statCard}>
                <ThemedText type="small" themeColor="textSecondary">
                  {stat.label}
                </ThemedText>
                <ThemedText type="subtitle" style={styles.statValue}>
                  {stat.value}
                </ThemedText>
              </ThemedView>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold">Browse by category</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              See what is moving today
            </ThemedText>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
            {categories.map((category) => (
              <ThemedView
                key={category.name}
                type="backgroundElement"
                style={[styles.categoryCard, { borderColor: category.accent }]}
              >
                <ThemedText style={styles.categoryIcon}>{category.icon}</ThemedText>
                <ThemedText type="smallBold">{category.name}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {category.label}
                </ThemedText>
              </ThemedView>
            ))}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold">Featured deals</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Fresh opportunities nearby
            </ThemedText>
          </View>

          {featuredListings.map((item) => (
            <ThemedView
              key={item.title}
              type="backgroundElement"
              style={[styles.listingCard, { borderColor: item.accent }]}
            >
              <View style={styles.listingHeader}>
                <View>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.category}
                  </ThemedText>
                  <ThemedText type="default" style={styles.listingTitle}>
                    {item.title}
                  </ThemedText>
                </View>
                <View style={[styles.badge, { backgroundColor: `${item.accent}22` }]}>
                  <ThemedText type="smallBold" style={[styles.badgeText, { color: item.accent }]}>
                    {item.distance}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.priceRow}>
                <ThemedText type="subtitle" style={[styles.priceText, { color: item.accent }]}>
                  {item.price}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {item.unit}
                </ThemedText>
              </View>

              <View style={styles.metaRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  {item.location}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  by {item.farmer}
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
  heroCard: {
    borderRadius: 28,
    padding: Spacing.three,
    gap: Spacing.three,
    backgroundColor: '#edf7ec',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.three,
  },
  heroText: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: 600,
    color: '#1b3b2a',
  },
  primaryButton: {
    backgroundColor: '#1e7a3d',
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  primaryText: {
    color: '#ffffff',
  },
  searchBar: {
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderWidth: 1,
    borderColor: '#d7ebd9',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  statValue: {
    fontSize: 20,
    lineHeight: 28,
  },
  sectionHeader: {
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  categoryRow: {
    paddingRight: Spacing.three,
    gap: Spacing.two,
  },
  categoryCard: {
    width: 140,
    borderRadius: 22,
    padding: Spacing.three,
    borderWidth: 1,
    gap: Spacing.one,
  },
  categoryIcon: {
    fontSize: 28,
  },
  listingCard: {
    borderRadius: 20,
    padding: Spacing.three,
    borderWidth: 1,
    gap: Spacing.two,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  listingTitle: {
    marginTop: Spacing.half,
    fontWeight: 700,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 11,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.one,
  },
  priceText: {
    fontSize: 28,
    lineHeight: 36,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
});
