import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Body, Screen } from '@/components/ui';
import { Colors, Radius, Spacing } from '@/constants/theme';

function RoleCard({ role, icon, description, active, onPress }: { role: string; icon: keyof typeof Ionicons.glyphMap; description: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.roleCard, active && styles.activeCard, pressed && styles.pressed]}>
      <View style={[styles.icon, active && styles.activeIcon]}><Ionicons name={icon} size={25} color={Colors.green} /></View>
      <View style={styles.roleCopy}><Text style={[styles.roleTitle, active && styles.activeText]}>{role}</Text><Text style={[styles.roleDescription, active && styles.activeDescription]}>{description}</Text></View>
      <Ionicons name="chevron-forward" size={22} color={active ? '#fff' : Colors.green} style={styles.arrow} />
    </Pressable>
  );
}

export default function RoleScreen() {
  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={22} color={Colors.green} /></Pressable>
      <View style={styles.intro}><Text style={styles.eyebrow}>WELCOME TO AGRIBRIDGE</Text><Text style={styles.title}>How will you use{'\n'}AgriBridge?</Text><Body muted>Choose the experience that fits you best. You can update your profile later.</Body></View>
      <View style={styles.cards}>
        <RoleCard role="I’m a farmer" icon="leaf-outline" active description="Sell produce, rent equipment, and grow your farm business." onPress={() => router.push('/auth?role=farmer')} />
        <RoleCard role="I’m a customer" icon="basket-outline" description="Shop fresh produce, farm supplies, and trusted equipment." onPress={() => router.push('/auth?role=customer')} />
      </View>
      <Text style={styles.footer}>Your details stay private and secure.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.limeSoft, alignItems: 'center', justifyContent: 'center' },
  intro: { gap: Spacing.md, marginTop: Spacing.lg },
  eyebrow: { color: Colors.green, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  title: { color: Colors.ink, fontSize: 36, lineHeight: 40, fontWeight: '800', letterSpacing: -1 },
  cards: { gap: Spacing.md },
  roleCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.line, padding: Spacing.md, gap: Spacing.md, minHeight: 190 },
  activeCard: { backgroundColor: Colors.green, borderColor: Colors.green },
  icon: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.limeSoft, alignItems: 'center', justifyContent: 'center' },
  activeIcon: { backgroundColor: Colors.lime },
  roleCopy: { gap: 6 },
  roleTitle: { color: Colors.ink, fontSize: 24, fontWeight: '800' },
  activeText: { color: '#fff' },
  roleDescription: { color: Colors.inkSoft, fontSize: 16, lineHeight: 23 },
  activeDescription: { color: 'rgba(255,255,255,0.78)' },
  arrow: { position: 'absolute', right: Spacing.md, bottom: Spacing.md },
  footer: { color: Colors.muted, textAlign: 'center', fontSize: 13 },
  pressed: { opacity: 0.86 },
});
