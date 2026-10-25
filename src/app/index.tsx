import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { images } from '@/lib/demo-data';
import { Colors, Radius, Spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  return (
    <ImageBackground source={images.hero} style={styles.background} resizeMode="cover">
      <StatusBar style="light" />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.logoMark}><Text style={styles.leaf}>⌁</Text></View>
          <Pressable onPress={() => router.replace('/role')}><Text style={styles.skip}>Skip</Text></Pressable>
        </View>
        <View style={styles.copy}>
          <View style={styles.progress}><View style={styles.progressActive} /><View style={styles.dot} /><View style={styles.dot} /></View>
          <Text style={styles.title}>Fresh produce.{'\n'}Real connection.</Text>
          <Text style={styles.body}>A simple marketplace for farmers and buyers across Botswana.</Text>
        </View>
        <Pressable style={styles.button} onPress={() => router.push('/role')}>
          <Text style={styles.buttonText}>Get started  →</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: Colors.greenDeep },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(3,34,23,0.46)' },
  content: { flex: 1, padding: Spacing.lg, paddingTop: 64, paddingBottom: 36, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoMark: { width: 42, height: 42, borderRadius: 15, backgroundColor: Colors.lime, alignItems: 'center', justifyContent: 'center' },
  leaf: { color: Colors.greenDeep, fontSize: 30, fontWeight: '800', transform: [{ rotate: '-35deg' }] },
  skip: { color: '#fff', fontSize: 15, fontWeight: '800' },
  copy: { gap: Spacing.md },
  progress: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  progressActive: { width: 32, height: 4, borderRadius: 99, backgroundColor: Colors.lime },
  dot: { width: 5, height: 5, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.75)' },
  title: { color: '#fff', fontSize: 42, lineHeight: 46, fontWeight: '800', letterSpacing: -1.2 },
  body: { color: 'rgba(255,255,255,0.88)', fontSize: 17, lineHeight: 25, maxWidth: 340 },
  button: { backgroundColor: Colors.lime, borderRadius: Radius.md, height: 58, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: Colors.greenDeep, fontSize: 17, fontWeight: '800' },
});
