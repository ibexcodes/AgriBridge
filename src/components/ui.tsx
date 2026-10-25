import { PropsWithChildren, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Radius, Spacing } from '@/constants/theme';

let styles: ReturnType<typeof StyleSheet.create>;

export function Screen({ children, scroll = true }: PropsWithChildren<{ scroll?: boolean }>) {
  const content = <View style={styles.content}>{children}</View>;
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {scroll ? <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
}

export function Heading({ children, eyebrow }: { children: ReactNode; eyebrow?: string }) {
  return (
    <View style={styles.heading}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{children}</Text>
    </View>
  );
}

export function Body({ children, muted = false }: PropsWithChildren<{ muted?: boolean }>) {
  return <Text style={[styles.body, muted && styles.muted]}>{children}</Text>;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
}: PropsWithChildren<{
  onPress?: () => void;
  variant?: 'primary' | 'soft' | 'outline' | 'danger';
  disabled?: boolean;
}>) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'soft' && styles.softButton,
        variant === 'outline' && styles.outlineButton,
        variant === 'danger' && styles.dangerButton,
        disabled && styles.disabledButton,
        pressed && styles.pressed,
      ]}>
      <Text
        style={[
          styles.buttonText,
          variant === 'soft' && styles.softButtonText,
          variant === 'outline' && styles.outlineButtonText,
          variant === 'danger' && styles.dangerButtonText,
        ]}>
        {children}
      </Text>
    </Pressable>
  );
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={Colors.muted}
        style={[styles.field, props.multiline && styles.multiline]}
      />
    </View>
  );
}

export function Card({ children, style }: PropsWithChildren<{ style?: object }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Section({ title, action, children }: PropsWithChildren<{ title: string; action?: ReactNode }>) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {action}
      </View>
      {children}
    </View>
  );
}

export function Chip({ children, active = false, onPress }: PropsWithChildren<{ active?: boolean; onPress?: () => void }>) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.activeChip]}>
      <Text style={[styles.chipText, active && styles.activeChipText]}>{children}</Text>
    </Pressable>
  );
}

export function IconBadge({ children }: PropsWithChildren) {
  return <View style={styles.iconBadge}><Text style={styles.iconText}>{children}</Text></View>;
}

styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.canvas },
  scroll: { flex: 1 },
  content: { width: '100%', maxWidth: 680, alignSelf: 'center', padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 120 },
  heading: { gap: Spacing.xs },
  eyebrow: { color: Colors.green, fontWeight: '800', fontSize: 13, letterSpacing: 0.8, textTransform: 'uppercase' },
  title: { color: Colors.ink, fontSize: 34, lineHeight: 40, fontWeight: '800', letterSpacing: -1 },
  body: { color: Colors.inkSoft, fontSize: 16, lineHeight: 24 },
  muted: { color: Colors.muted },
  button: { minHeight: 54, borderRadius: Radius.md, backgroundColor: Colors.green, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.lg },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  softButton: { backgroundColor: Colors.limeSoft },
  softButtonText: { color: Colors.green },
  outlineButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.line },
  outlineButtonText: { color: Colors.green },
  dangerButton: { backgroundColor: Colors.redSoft },
  dangerButtonText: { color: Colors.red },
  disabledButton: { opacity: 0.45 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  fieldWrap: { gap: Spacing.xs },
  label: { color: Colors.ink, fontSize: 14, fontWeight: '700' },
  field: { minHeight: 54, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.line, backgroundColor: Colors.surfaceSoft, paddingHorizontal: Spacing.md, color: Colors.ink, fontSize: 16 },
  multiline: { minHeight: 110, paddingTop: Spacing.md, textAlignVertical: 'top' },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, gap: Spacing.md, borderWidth: 1, borderColor: Colors.line },
  section: { gap: Spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.md },
  sectionTitle: { color: Colors.ink, fontSize: 21, fontWeight: '800', letterSpacing: -0.3 },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: 99, backgroundColor: Colors.surfaceSoft },
  activeChip: { backgroundColor: Colors.green },
  chipText: { color: Colors.inkSoft, fontWeight: '700', fontSize: 14 },
  activeChipText: { color: '#fff' },
  iconBadge: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.lime },
  iconText: { fontSize: 22 },
});

export const uiStyles = styles;
