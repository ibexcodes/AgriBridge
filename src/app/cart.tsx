import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Button, Card, Screen } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { useAppStore } from '@/lib/app-store';
import { FulfillmentMethod } from '@/lib/types';

export default function CartScreen() {
  const { cart, profile, removeFromCart, createOrder } = useAppStore();
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>('pickup');
  const deliveryFeeFor = (item: (typeof cart)[number]) => {
    if (fulfillmentMethod === 'pickup') return 0;
    return profile.location.trim().toLowerCase() === item.location.trim().toLowerCase() ? 50 : 150;
  };
  const itemsTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryTotal = cart.reduce((sum, item) => sum + deliveryFeeFor(item), 0);
  const total = itemsTotal + deliveryTotal;
  const checkout = async () => {
    try {
      for (const item of cart) await createOrder(item.id, fulfillmentMethod);
      Alert.alert('Order submitted', 'Each seller will review your request and confirm availability.');
      router.replace('/orders');
    } catch (error) {
      Alert.alert('Checkout failed', error instanceof Error ? error.message : 'Unable to submit your order.');
    }
  };
  return <Screen><Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/customer')} style={styles.back}><Ionicons name="arrow-back" size={20} color={Colors.green} /><Text style={styles.backText}>Back to marketplace</Text></Pressable><Text style={styles.title}>Your cart</Text>{cart.length ? <><View style={styles.stack}>{cart.map((item) => <Card key={item.id}><View style={styles.row}><View style={styles.copy}><Text style={styles.itemTitle}>{item.title}</Text><Text style={styles.muted}>{item.mode === 'rent' ? 'Rental request' : 'Purchase request'}</Text></View><Pressable onPress={() => removeFromCart(item.id)}><Ionicons name="trash-outline" size={21} color={Colors.red} /></Pressable></View><Text style={styles.price}>BWP {item.price.toFixed(2)}</Text>{fulfillmentMethod === 'delivery' ? <Text style={styles.muted}>Delivery: BWP {deliveryFeeFor(item).toFixed(2)} · {deliveryFeeFor(item) === 50 ? 'Same city/village' : 'Different city/village'}</Text> : null}</Card>)}</View><Card><Text style={styles.sectionTitle}>How should we get this to you?</Text><View style={styles.options}><Pressable accessibilityRole="radio" accessibilityState={{ selected: fulfillmentMethod === 'pickup' }} onPress={() => setFulfillmentMethod('pickup')} style={[styles.option, fulfillmentMethod === 'pickup' && styles.optionActive]}><Ionicons name="storefront-outline" size={22} color={fulfillmentMethod === 'pickup' ? Colors.green : Colors.muted} /><View style={styles.optionCopy}><Text style={styles.optionTitle}>I will pick it up</Text><Text style={styles.muted}>No delivery fee</Text></View><Ionicons name={fulfillmentMethod === 'pickup' ? 'radio-button-on' : 'radio-button-off'} size={21} color={Colors.green} /></Pressable><Pressable accessibilityRole="radio" accessibilityState={{ selected: fulfillmentMethod === 'delivery' }} onPress={() => setFulfillmentMethod('delivery')} style={[styles.option, fulfillmentMethod === 'delivery' && styles.optionActive]}><Ionicons name="bicycle-outline" size={22} color={fulfillmentMethod === 'delivery' ? Colors.green : Colors.muted} /><View style={styles.optionCopy}><Text style={styles.optionTitle}>Deliver it to me</Text><Text style={styles.muted}>BWP 50 same city/village · BWP 150 different city/village</Text></View><Ionicons name={fulfillmentMethod === 'delivery' ? 'radio-button-on' : 'radio-button-off'} size={21} color={Colors.green} /></Pressable></View><View style={styles.summary}><View style={styles.row}><Text style={styles.muted}>Items</Text><Text style={styles.muted}>BWP {itemsTotal.toFixed(2)}</Text></View><View style={styles.row}><Text style={styles.muted}>Delivery</Text><Text style={styles.muted}>BWP {deliveryTotal.toFixed(2)}</Text></View><View style={styles.row}><Text style={styles.totalLabel}>Estimated total</Text><Text style={styles.total}>BWP {total.toFixed(2)}</Text></View></View><Text style={styles.muted}>Final availability is confirmed by each farmer. Delivery fees are calculated again securely when you place the request.</Text><Button onPress={checkout}>Place order requests</Button></Card></> : <Card><Text style={styles.itemTitle}>Your cart is empty</Text><Text style={styles.muted}>Add produce, fertilizer, or machinery from the marketplace.</Text><Button variant="soft" onPress={() => router.replace('/customer')}>Browse marketplace</Button></Card>}</Screen>;
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
  sectionTitle: { color: Colors.ink, fontSize: 18, fontWeight: '800', marginBottom: Spacing.sm },
  options: { gap: Spacing.sm },
  option: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderWidth: 1, borderColor: Colors.line, borderRadius: 12, padding: Spacing.md },
  optionActive: { borderColor: Colors.green, backgroundColor: Colors.limeSoft },
  optionCopy: { flex: 1, gap: 3 },
  optionTitle: { color: Colors.ink, fontSize: 15, fontWeight: '800' },
  summary: { gap: 7, borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.line, paddingVertical: Spacing.md, marginVertical: Spacing.md },
});
