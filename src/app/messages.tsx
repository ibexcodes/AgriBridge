import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Card, Screen } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { useAppStore } from '@/lib/app-store';

export default function MessagesScreen() {
  const { chats } = useAppStore();
  return <Screen><View style={styles.header}><Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/customer')} style={styles.back}><Ionicons name="arrow-back" size={20} color={Colors.green} /><Text style={styles.backText}>Back to home</Text></Pressable><Text style={styles.title}>Your messages</Text><Text style={styles.subtitle}>Stay connected with farmers.</Text></View><Card><Text style={styles.section}>Buyer chats</Text>{chats.map((chat) => <Pressable key={chat.id} onPress={() => router.push(`/message/${chat.id}`)} style={styles.chat}><View style={styles.avatar}><Text style={styles.avatarText}>{chat.name[0]}</Text></View><View style={styles.chatCopy}><View style={styles.row}><Text style={styles.name}>{chat.name}</Text>{chat.unread ? <Text style={styles.unread}>{chat.unread}</Text> : null}</View><Text style={styles.listing}>{chat.listingTitle}</Text><Text numberOfLines={1} style={styles.preview}>{chat.preview}</Text></View><Ionicons name="chevron-forward" size={20} color={Colors.muted} /></Pressable>)}</Card></Screen>;
}

const styles = StyleSheet.create({
  header: { gap: Spacing.md, marginBottom: Spacing.md },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { color: Colors.green, fontWeight: '800', fontSize: 16 },
  title: { color: Colors.ink, fontSize: 34, fontWeight: '800', letterSpacing: -1 },
  subtitle: { color: Colors.inkSoft, fontSize: 17 },
  section: { color: Colors.ink, fontSize: 22, fontWeight: '800', marginBottom: Spacing.sm },
  chat: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md, borderTopWidth: 1, borderColor: Colors.line },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.lime, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.greenDeep, fontSize: 20, fontWeight: '800' },
  chatCopy: { flex: 1, gap: 3 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: Colors.ink, fontWeight: '800', fontSize: 16 },
  listing: { color: Colors.inkSoft, fontSize: 14 },
  preview: { color: Colors.muted, fontSize: 13 },
  unread: { backgroundColor: Colors.green, color: '#fff', borderRadius: 99, minWidth: 22, textAlign: 'center', paddingVertical: 2, fontWeight: '800' },
});
