import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { Card, Screen } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { useAppStore } from '@/lib/app-store';

export default function OrdersScreen() {
  const { orders, cancelOrder } = useAppStore();
  const cancel = (id: string) => {
    Alert.alert('Cancel order request?', 'The farmer will be notified and this request will remain in your order history.', [
      { text: 'Keep order', style: 'cancel' },
      {
        text: 'Cancel order',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelOrder(id);
          } catch (error) {
            Alert.alert('Unable to cancel order', error instanceof Error ? error.message : 'Please try again.');
          }
        },
      },
    ]);
  };
  return <Screen><Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/customer')} style={styles.back}><Ionicons name="arrow-back" size={20} color={Colors.green} /><Text style={styles.backText}>Back to marketplace</Text></Pressable><Text style={styles.title}>Your orders</Text>{orders.length ? <View style={styles.stack}>{orders.map((order) => <Card key={order.id}><View style={styles.row}><Text style={styles.itemTitle}>{order.listingTitle}</Text><Text style={styles.status}>{order.status.toUpperCase()}</Text></View><Text style={styles.muted}>BWP {order.amount.toFixed(2)} · {order.received}</Text>{order.fulfillmentMethod === 'delivery' ? <><Text style={styles.muted}>Delivery · BWP {(order.deliveryFee ?? 0).toFixed(2)} · {order.deliveryArea === 'same_area' ? 'Same city/village' : 'Different city/village'}</Text><Text style={styles.deliveryStatus}>● {deliveryStatusLabel(order.deliveryStatus)}</Text>{order.buyerLatitude != null && order.buyerLongitude != null ? <MapView style={styles.map} initialRegion={{ latitude: order.buyerLatitude, longitude: order.buyerLongitude, latitudeDelta: 0.08, longitudeDelta: 0.08 }}><Marker coordinate={{ latitude: order.buyerLatitude, longitude: order.buyerLongitude }} title="Your delivery location" pinColor={Colors.red} />{order.farmerLatitude != null && order.farmerLongitude != null ? <Marker coordinate={{ latitude: order.farmerLatitude, longitude: order.farmerLongitude }} title="Farmer location" pinColor={Colors.green} /> : null}{order.farmerLatitude != null && order.farmerLongitude != null ? <Polyline coordinates={[{ latitude: order.buyerLatitude, longitude: order.buyerLongitude }, { latitude: order.farmerLatitude, longitude: order.farmerLongitude }]} strokeColor={Colors.green} strokeWidth={3} /> : null}</MapView> : null}</> : <Text style={styles.muted}>Pickup · No delivery fee</Text>}<Text style={styles.muted}>{order.status === 'pending' ? 'Waiting for the farmer to confirm availability.' : order.status === 'approved' ? 'Confirmed by the farmer. Arrange collection or delivery.' : order.status === 'completed' ? 'Completed successfully.' : 'This request was cancelled.'}</Text>{order.status === 'pending' ? <Pressable onPress={() => cancel(order.id)}><Text style={styles.cancel}>Cancel order request</Text></Pressable> : null}</Card>)}</View> : <Card><Text style={styles.itemTitle}>No orders yet</Text><Text style={styles.muted}>Your submitted order requests will appear here.</Text></Card>}</Screen>;
}

function deliveryStatusLabel(status?: string) {
  return status === 'on_the_way' ? 'On the way' : status === 'arrived' ? 'Arrived' : 'Packaging';
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { color: Colors.green, fontWeight: '800', fontSize: 16 },
  title: { color: Colors.ink, fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  stack: { gap: Spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md },
  itemTitle: { color: Colors.ink, fontSize: 18, fontWeight: '800', flex: 1 },
  status: { color: Colors.green, fontSize: 11, fontWeight: '800' },
  muted: { color: Colors.inkSoft, lineHeight: 21 },
  cancel: { color: Colors.red, fontWeight: '800', marginTop: 4 },
  deliveryStatus: { color: Colors.green, fontWeight: '800' },
  map: { height: 190, borderRadius: 12, marginVertical: Spacing.sm },
});
