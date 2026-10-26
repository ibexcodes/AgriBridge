import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Button, Card, Screen } from '@/components/ui';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppStore } from '@/lib/app-store';
import { openGoogleMapsDirections } from '@/lib/maps';

export default function ListingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { listings, addToCart, openConversation } = useAppStore();
  const listing = listings.find((item) => item.id === id) ?? listings[0];
  if (!listing) {
    return <Screen><Text style={styles.location}>This listing is no longer available.</Text></Screen>;
  }
  return (
    <Screen>
      <View style={styles.top}><Pressable accessibilityLabel="Go back" onPress={() => router.canGoBack() ? router.back() : router.replace('/customer')} style={styles.back}><Ionicons name="arrow-back" size={21} color={Colors.green} /></Pressable><Text style={styles.topTitle}>Listing details</Text><Ionicons name="share-outline" size={23} color={Colors.green} /></View>
      <Image source={listing.image} style={styles.image} />
      <View style={styles.content}><Text style={styles.category}>{listing.category.toUpperCase()}</Text><Text style={styles.title}>{listing.title}</Text><Text style={styles.price}>BWP {listing.price.toFixed(2)} <Text style={styles.unit}>/ {listing.unit}</Text></Text><Text style={styles.location}>⌖ {listing.location} · {listing.farm}</Text><Card><Text style={styles.cardTitle}>About this listing</Text><Text style={styles.description}>{listing.description}</Text><Text style={styles.quantity}>{listing.quantity}</Text></Card><Card><Text style={styles.cardTitle}>Seller</Text><View style={styles.seller}><View style={styles.avatar}><Text style={styles.avatarText}>{listing.farmer[0]}</Text></View><View><Text style={styles.sellerName}>{listing.farmer}</Text><Text style={styles.location}>Verified local farmer</Text></View></View><Button variant="soft" disabled={listing.latitude == null || listing.longitude == null} onPress={() => void openGoogleMapsDirections(listing.latitude, listing.longitude, 'farmer or farm')}><Ionicons name="map-outline" size={18} color={Colors.green} />  Open map to farm</Button></Card><View style={styles.actions}><Button variant="outline" disabled={!listing.farmerId} onPress={() => void openConversation(listing.id, listing.farmerId ?? '').then((conversationId) => router.push(`/message/${conversationId}`)).catch((error) => Alert.alert('Messaging unavailable', error instanceof Error ? error.message : 'Please try again.'))}>Message farmer</Button><Button onPress={() => { addToCart(listing); router.push('/cart'); }}>Add to cart</Button></View></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.limeSoft, alignItems: 'center', justifyContent: 'center' },
  topTitle: { color: Colors.ink, fontSize: 17, fontWeight: '800' },
  image: { width: '100%', height: 260, borderRadius: Radius.lg, marginTop: Spacing.md },
  content: { gap: Spacing.md },
  category: { color: Colors.green, fontSize: 12, fontWeight: '800', letterSpacing: 0.5, marginTop: Spacing.md },
  title: { color: Colors.ink, fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  price: { color: Colors.green, fontSize: 23, fontWeight: '800' },
  unit: { color: Colors.muted, fontSize: 14, fontWeight: '500' },
  location: { color: Colors.inkSoft, fontSize: 14 },
  cardTitle: { color: Colors.ink, fontWeight: '800', fontSize: 18 },
  description: { color: Colors.inkSoft, lineHeight: 23 },
  quantity: { color: Colors.green, fontWeight: '800' },
  seller: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.lime, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.greenDeep, fontSize: 20, fontWeight: '800' },
  sellerName: { color: Colors.ink, fontSize: 16, fontWeight: '800' },
  actions: { gap: Spacing.sm, marginTop: Spacing.sm },
});
