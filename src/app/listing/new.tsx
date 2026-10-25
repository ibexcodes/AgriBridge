import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Button, Card, Field, Screen } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { images } from '@/lib/demo-data';
import { useAppStore } from '@/lib/app-store';
import { Category } from '@/lib/types';

export default function NewListingScreen() {
  const { addListing } = useAppStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Fresh produce');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const valid = title.trim() && description.trim() && Number(price) > 0;
  return <Screen><Pressable onPress={() => router.back()}><Text style={styles.back}>←  Back</Text></Pressable><View style={styles.intro}><Text style={styles.title}>New listing</Text><Text style={styles.subtitle}>Give buyers a clear, honest picture of what you offer.</Text></View><Card><Field label="Listing title" value={title} onChangeText={setTitle} placeholder="e.g. Fresh tomatoes" /><Text style={styles.label}>Category</Text><View style={styles.categories}>{(['Fresh produce', 'Machinery', 'Fertilizer'] as Category[]).map((item) => <Pressable key={item} onPress={() => setCategory(item)} style={[styles.category, category === item && styles.activeCategory]}><Text style={[styles.categoryText, category === item && styles.activeText]}>{item}</Text></Pressable>)}</View><Field label="Description" value={description} onChangeText={setDescription} placeholder="Describe quality, availability and collection details" multiline /><Field label="Price (BWP)" value={price} onChangeText={setPrice} placeholder="450" keyboardType="decimal-pad" /><Button disabled={!valid} onPress={() => { addListing({ id: `listing-${Date.now()}`, title, category, description, price: Number(price), unit: category === 'Machinery' ? 'per day' : 'per unit', location: 'Mahalapye', farmer: 'Johanson Sebudi', farm: "Johanson's farm", image: category === 'Machinery' ? images.tractor : category === 'Fertilizer' ? images.fertilizer : images.produce, mode: category === 'Machinery' ? 'rent' : 'sell', quantity: 'Available now', isActive: true }); router.replace('/farmer'); }}>Publish listing</Button></Card></Screen>;
}

const styles = StyleSheet.create({
  back: { color: Colors.green, fontWeight: '800', fontSize: 16 },
  intro: { gap: Spacing.sm, marginTop: Spacing.lg },
  title: { color: Colors.ink, fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  subtitle: { color: Colors.inkSoft, fontSize: 17, lineHeight: 24 },
  label: { color: Colors.ink, fontSize: 14, fontWeight: '700' },
  categories: { flexDirection: 'row', gap: 8 },
  category: { flex: 1, paddingVertical: 13, paddingHorizontal: 5, borderRadius: 14, alignItems: 'center', backgroundColor: Colors.surfaceSoft },
  activeCategory: { backgroundColor: Colors.green },
  categoryText: { color: Colors.inkSoft, fontSize: 12, fontWeight: '800', textAlign: 'center' },
  activeText: { color: '#fff' },
});
