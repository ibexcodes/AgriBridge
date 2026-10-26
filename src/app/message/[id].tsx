import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/components/ui';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppStore } from '@/lib/app-store';

type Message = { id: string; body: string; senderId: string; createdAt: string };

export default function MessageDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getMessages, sendMessage, userId } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!id) return;
    try { setMessages(await getMessages(id)); } catch (error) { Alert.alert('Unable to load messages', error instanceof Error ? error.message : 'Please try again.'); } finally { setLoading(false); }
  }, [getMessages, id]);

  useEffect(() => {
    const timer = setTimeout(() => { void refresh(); }, 0);
    return () => clearTimeout(timer);
  }, [refresh]);

  const submit = async () => {
    if (!draft.trim()) return;
    try { await sendMessage(id, draft); setDraft(''); await refresh(); } catch (error) { Alert.alert('Message failed', error instanceof Error ? error.message : 'Please try again.'); }
  };

  return <Screen><View style={styles.header}><Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/messages')}><Ionicons name="arrow-back" size={23} color={Colors.green} /></Pressable><Text style={styles.title}>Conversation</Text><View /></View><FlatList data={messages} keyExtractor={(item) => item.id} refreshing={loading} onRefresh={() => void refresh()} contentContainerStyle={styles.list} renderItem={({ item }) => <View style={[styles.bubble, item.senderId === userId ? styles.mine : styles.theirs]}><Text style={styles.body}>{item.body}</Text></View>} ListEmptyComponent={<Text style={styles.empty}>Start a conversation with this farmer.</Text>} /><View style={styles.composer}><TextInput value={draft} onChangeText={setDraft} placeholder="Write a message..." placeholderTextColor={Colors.muted} style={styles.input} multiline /><Pressable onPress={() => void submit()} style={styles.send}><Ionicons name="send" size={20} color={Colors.surface} /></Pressable></View></Screen>;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: Spacing.md },
  title: { color: Colors.ink, fontSize: 20, fontWeight: '800' },
  list: { flexGrow: 1, gap: Spacing.sm, paddingVertical: Spacing.md },
  bubble: { maxWidth: '82%', padding: Spacing.md, borderRadius: Radius.lg },
  mine: { alignSelf: 'flex-end', backgroundColor: Colors.green },
  theirs: { alignSelf: 'flex-start', backgroundColor: Colors.limeSoft },
  body: { color: Colors.ink, fontSize: 16 },
  empty: { color: Colors.muted, textAlign: 'center', marginTop: 40 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm, paddingTop: Spacing.sm },
  input: { flex: 1, minHeight: 46, maxHeight: 110, backgroundColor: Colors.surface, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, paddingVertical: 12, color: Colors.ink, borderWidth: 1, borderColor: Colors.line },
  send: { width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.green, alignItems: 'center', justifyContent: 'center' },
});
