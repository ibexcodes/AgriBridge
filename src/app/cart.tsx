import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Button, Card, Screen } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { useAppStore } from '@/lib/app-store';

export default function CartScreen() {
  const { cart, removeFromCart, createOrder } = useAppStore();
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const checkout = async () => {
    try {
      for (const item of cart) await createOrder(item.id);
      Alert.alert('Order submitted', 'Each seller will review your request and confirm availability.');
      router.replace('/orders');
    } catch (error) {
      Alert.alert('Checkout failed', error instanceof Error ? error.message : 'Unable to submit your order.');
    }
  };
  return <Screen><Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/customer')} style={styles.back}><Ionicons name="arrow-back" size={20} color={Colors.green} /><Text style={styles.backText}>Back to marketplace</Text></Pressable><Text style={styles.title}>Your cart</Text>{cart.length ? <><View style={styles.stack}>{cart.map((item) => <Card key={item.id}><View style={styles.row}><View style={styles.copy}><Text style={styles.itemTitle}>{item.title}</Text><Text style={styles.muted}>{item.mode === 'rent' ? 'Rental request' : 'Purchase request'}</Text></View><Pressable onPress={() => removeFromCart(item.id)}><Ionicons name="trash-outline" size={21} color={Colors.red} /></Pressable></View><Text style={styles.price}>BWP {item.price.toFixed(2)}</Text></Card>)}</View><Card><View style={styles.row}><Text style={styles.totalLabel}>Estimated total</Text><Text style={styles.total}>BWP {total.toFixed(2)}</Text></View><Text style={styles.muted}>Final availability is confirmed by each farmer.</Text><Button onPress={checkout}>Place order requests</Button></Card></> : <Card><Text style={styles.itemTitle}>Your cart is empty</Text><Text style={styles.muted}>Add produce, fertilizer, or machinery from the marketplace.</Text><Button variant="soft" onPress={() => router.replace('/customer')}>Browse marketplace</Button></Card>}</Screen>;
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { color: Colors.green, fontWeight: '800', fontSize: 16 },
  title: { color: Colors.ink, fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  stack: { gap: Spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md },
  copy: { flex: 1, gap: 4 },
  itemTitle: { color: Colors.ink, fontSize: 18, fontWeight: '800' },
  muted: { color: Colors.inkSoft, lineHeight: 21 },
  price: { color: Colors.green, fontSize: 20, fontWeight: '800' },
  totalLabel: { color: Colors.ink, fontSize: 17, fontWeight: '800' },
  total: { color: Colors.green, fontSize: 20, fontWeight: '800' },
});
