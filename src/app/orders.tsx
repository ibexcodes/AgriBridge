import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Card, Screen } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { useAppStore } from '@/lib/app-store';

export default function OrdersScreen() {
  const { orders } = useAppStore();
  return <Screen><Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/customer')} style={styles.back}><Ionicons name="arrow-back" size={20} color={Colors.green} /><Text style={styles.backText}>Back to marketplace</Text></Pressable><Text style={styles.title}>Your orders</Text>{orders.length ? <View style={styles.stack}>{orders.map((order) => <Card key={order.id}><View style={styles.row}><Text style={styles.itemTitle}>{order.listingTitle}</Text><Text style={styles.status}>{order.status.toUpperCase()}</Text></View><Text style={styles.muted}>BWP {order.amount.toFixed(2)} · {order.received}</Text><Text style={styles.muted}>{order.status === 'pending' ? 'Waiting for the farmer to confirm availability.' : order.status === 'approved' ? 'Confirmed by the farmer. Arrange collection or delivery.' : order.status === 'completed' ? 'Completed successfully.' : 'This request was cancelled.'}</Text></Card>)}</View> : <Card><Text style={styles.itemTitle}>No orders yet</Text><Text style={styles.muted}>Your submitted order requests will appear here.</Text></Card>}</Screen>;
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
});
