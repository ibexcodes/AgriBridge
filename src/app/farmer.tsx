import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { Button, Card, Field, Screen, Section } from '@/components/ui';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppStore } from '@/lib/app-store';
import { openGoogleMapsDirections } from '@/lib/maps';

export default function FarmerDashboard() {
  const { listings, orders, chats, profile, currentLocation, toggleListing, removeListing, deleteArchivedListing, approveOrder, cancelOrder, completeOrder, updateDeliveryStatus, updateDeliveryLocation } = useAppStore();
  const deleteArchived = (id: string) => {
    Alert.alert('Delete archived listing?', 'This permanently removes the listing and its cancelled order history. Active order history is protected.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteArchivedListing(id);
          } catch (error) {
            Alert.alert('Cannot delete listing', error instanceof Error ? error.message : 'Please try again.');
          }
        },
      },
    ]);
  };
  return (
    <Screen>
      <View style={styles.header}><View><Text style={styles.eyebrow}>FARMER DASHBOARD</Text><Text style={styles.title}>Sell your harvest</Text></View><Pressable onPress={() => router.push('/profile')}><Ionicons name="log-out-outline" size={27} color={Colors.green} /></Pressable></View>
      <View style={styles.banner}><Text style={styles.bannerStrong}>{listings.filter((item) => item.isActive).length}/100 listing slots used</Text><Text style={styles.bannerText}>Reach buyers looking for what you grow.</Text></View>
      <Section title="Manage inventory"><View style={styles.stack}>{listings.map((listing) => <Card key={listing.id}><View style={styles.row}><View><Text style={styles.cardTitle}>{listing.title}</Text><Text style={styles.muted}>BWP {listing.price.toFixed(2)}</Text></View><Text style={styles.live}>{listing.isActive ? 'Live' : 'Archived'}</Text></View><View style={styles.actions}><Button variant="soft" onPress={() => toggleListing(listing.id)}>{listing.isActive ? 'Pause' : 'Resume'}</Button>{listing.isActive ? <Button variant="danger" onPress={() => removeListing(listing.id)}>Archive</Button> : <Button variant="danger" onPress={() => deleteArchived(listing.id)}>Delete permanently</Button>}</View></Card>)}</View></Section>
      <Section title="Incoming orders"><View style={styles.stack}>{orders.map((order) => <Card key={order.id}><View style={styles.row}><Text style={styles.cardTitle}>{order.listingTitle}</Text><Text style={styles.status}>{order.status.toUpperCase()}</Text></View><Text style={styles.muted}>Customer: {order.customer}</Text><Text style={styles.amount}>BWP {order.amount.toFixed(2)}</Text>{order.fulfillmentMethod === 'delivery' ? <><Text style={styles.muted}>Delivery · BWP {(order.deliveryFee ?? 0).toFixed(2)} · {order.deliveryArea === 'same_area' ? 'Same city/village' : 'Different city/village'}</Text><Text style={styles.deliveryStatus}>● {deliveryStatusLabel(order.deliveryStatus)}</Text>{order.buyerLatitude != null && order.buyerLongitude != null ?             <MapView style={styles.map} initialRegion={{ latitude: order.buyerLatitude, longitude: order.buyerLongitude, latitudeDelta: 0.08, longitudeDelta: 0.08 }}><Marker coordinate={{ latitude: order.buyerLatitude, longitude: order.buyerLongitude }} title="Customer delivery location" description={order.customer} pinColor={Colors.red} />{currentLocation ? <Marker coordinate={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }} title="Your farm" pinColor={Colors.green} /> : null}{currentLocation ? <Polyline coordinates={[{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }, { latitude: order.buyerLatitude, longitude: order.buyerLongitude }]} strokeColor={Colors.green} strokeWidth={3} /> : null}</MapView> : <Text style={styles.muted}>Customer location was not shared for this order.</Text>}<Pressable style={styles.directionButton} onPress={() => void openGoogleMapsDirections(order.buyerLatitude, order.buyerLongitude, 'customer')}><Ionicons name="navigate-outline" size={18} color={Colors.green} /><Text style={styles.directionText}>Open Google Maps to customer</Text></Pressable><View style={styles.actions}><Button variant="soft" onPress={() => void updateDeliveryLocation(order.id).catch((error) => Alert.alert('Location update failed', error instanceof Error ? error.message : 'Please try again.'))}>Share my location</Button>{order.deliveryStatus === 'packaging' ? <Button onPress={() => void updateDeliveryStatus(order.id, 'on_the_way').catch((error) => Alert.alert('Status update failed', error instanceof Error ? error.message : 'Please try again.'))}>On the way</Button> : null}{order.deliveryStatus === 'on_the_way' ? <Button onPress={() => void updateDeliveryStatus(order.id, 'arrived').catch((error) => Alert.alert('Status update failed', error instanceof Error ? error.message : 'Please try again.'))}>Arrived</Button> : null}</View></> : <Text style={styles.muted}>Pickup · No delivery fee</Text>}<Text style={styles.muted}>Received {order.received}</Text><View style={styles.actions}>{order.status === 'pending' ? <><Button onPress={() => approveOrder(order.id)}>Approve</Button><Button variant="danger" onPress={() => cancelOrder(order.id)}>Decline</Button></> : null}{order.status === 'approved' ? <Button onPress={() => completeOrder(order.id)}>Mark completed</Button> : null}</View></Card>)}</View></Section>
      <Section title="Buyer chats" action={<Pressable onPress={() => router.push('/messages')}><Text style={styles.link}>View all</Text></Pressable>}>{chats[0] ? <Card><Text style={styles.cardTitle}>{chats[0].name}</Text><Text style={styles.muted}>{chats[0].listingTitle}</Text><Text style={styles.link}>Open chat and reply →</Text></Card> : <Text style={styles.muted}>No buyer conversations yet.</Text>}</Section>
      <Section title="Farmer profile"><Card><Field label="Your name" value={profile.farm} editable={false} /><Field label="Location (town, district)" value={profile.location} editable={false} /><Button variant="soft" onPress={() => router.push('/profile')}>Edit profile</Button></Card></Section>
      <Section title="New listing"><Card><Text style={styles.newCopy}>Have something to sell or rent?</Text><Button onPress={() => router.push('/listing/new')}>+ Create listing</Button></Card></Section>
    </Screen>
  );
}

function deliveryStatusLabel(status?: string) {
  return status === 'on_the_way' ? 'On the way' : status === 'arrived' ? 'Arrived' : 'Packaging';
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { color: Colors.green, fontWeight: '800', fontSize: 12, letterSpacing: 1 },
  title: { color: Colors.ink, fontWeight: '800', fontSize: 34, letterSpacing: -1, marginTop: 5 },
  banner: { backgroundColor: Colors.green, borderRadius: Radius.lg, padding: Spacing.md, gap: 5 },
  bannerStrong: { color: Colors.lime, fontWeight: '800', fontSize: 16 },
  bannerText: { color: '#fff', fontSize: 16 },
  stack: { gap: Spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md },
  cardTitle: { color: Colors.ink, fontSize: 18, fontWeight: '800' },
  muted: { color: Colors.inkSoft, fontSize: 14 },
  live: { color: Colors.green, fontWeight: '800' },
  status: { color: Colors.green, fontSize: 12, fontWeight: '800' },
  amount: { color: Colors.green, fontWeight: '800', fontSize: 20 },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  link: { color: Colors.green, fontWeight: '800' },
  newCopy: { color: Colors.inkSoft, fontSize: 16 },
  deliveryStatus: { color: Colors.green, fontWeight: '800' },
  map: { height: 190, borderRadius: Radius.md, marginVertical: Spacing.sm },
  directionButton: { flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start', paddingVertical: 8 },
  directionText: { color: Colors.green, fontWeight: '800' },
});
