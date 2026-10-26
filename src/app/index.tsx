import { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Radius, Spacing } from '@/constants/theme';

const slides = [
  {
    image: require('@/assets/agribridge/onboarding-produce.jpg'),
    title: 'Fresh Produce, Easy\nShopping',
    body: 'Shop fresh fruits, vegetables, and other food products from suppliers across Botswana, all in one convenient marketplace.',
  },
  {
    image: require('@/assets/agribridge/onboarding-fertilizer.jpg'),
    title: 'Give Your Crops a\nStrong Start',
    body: 'Explore fertilizers to support soil health and crop health, helping you choose products suited to your farming needs.',
  },
  {
    image: require('@/assets/agribridge/onboarding-machinery.jpg'),
    title: 'Everything Your Farm\nNeeds',
    body: 'Discover tractors, farming machinery, tools, and essential equipment to help prepare land, tend crops, and work more efficiently.',
  },
];

export default function WelcomeScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<(typeof slides)[number]>>(null);
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const horizontalPadding = Math.min(Spacing.lg, Math.max(20, width * 0.06));
  const titleSize = Math.min(31, Math.max(26, width * 0.078));
  const contentPadding = {
    paddingHorizontal: horizontalPadding,
    paddingTop: insets.top + 12,
    paddingBottom: Math.max(insets.bottom + 16, height < 700 ? 18 : 28),
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <View style={styles.splash}>
        <Image source={require('@/assets/agribridge/logo.png')} style={styles.logo} resizeMode="contain" />
        <View style={styles.splashDots}>
          <View style={styles.splashDot} /><View style={[styles.splashDot, styles.splashDotActive]} /><View style={styles.splashDot} />
        </View>
      </View>
    );
  }

  const goToSlide = (index: number) => {
    listRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image
              source={item.image}
              style={styles.image}
              contentFit="cover"
              allowDownscaling={false}
              cachePolicy="memory-disk"
              priority="high"
            />
            <View style={styles.scrim} />
            <View style={[styles.slideContent, contentPadding]}>
              <View style={styles.topRow}>
                {activeIndex > 0 ? <Pressable hitSlop={10} onPress={() => goToSlide(activeIndex - 1)} style={styles.back}><Text style={styles.backText}>‹</Text></Pressable> : <View style={styles.backPlaceholder} />}
                <Pressable hitSlop={10} onPress={() => router.replace('/role')}><Text style={styles.skip}>Skip</Text></Pressable>
              </View>
              <View style={styles.copy}>
                <View style={styles.progress}>
                  {slides.map((_, index) => <View key={index} style={[styles.dot, index === activeIndex && styles.activeDot]} />)}
                </View>
                <Text style={[styles.title, { fontSize: titleSize, lineHeight: titleSize + 4 }]}>{item.title}</Text>
                <Text style={styles.body}>{item.body}</Text>
              </View>
              <Pressable style={styles.button} onPress={() => activeIndex === slides.length - 1 ? router.replace('/role') : goToSlide(activeIndex + 1)}>
                <Text style={styles.buttonText}>{activeIndex === slides.length - 1 ? 'Get Started' : 'Next'}</Text>
              </Pressable>
            </View>
          </View>
        )}
        onViewableItemsChanged={({ viewableItems }) => {
          const index = viewableItems[0]?.index;
          if (index != null) setActiveIndex(index);
        }}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: '#f8f8f3', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  logo: { width: '72%', maxWidth: 250, height: 170 },
  splashDots: { position: 'absolute', bottom: '16%', flexDirection: 'row', gap: 7 },
  splashDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#79b34b' },
  splashDotActive: { backgroundColor: Colors.green },
  screen: { flex: 1, backgroundColor: Colors.greenDeep },
  slide: { height: '100%' },
  image: StyleSheet.absoluteFill,
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0, 0, 0, 0.38)' },
  slideContent: { flex: 1, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(0,0,0,0.28)', alignItems: 'center', justifyContent: 'center' },
  backPlaceholder: { width: 42, height: 42 },
  backText: { color: '#fff', fontSize: 32, lineHeight: 34, marginTop: -4 },
  skip: { color: '#fff', fontWeight: '800', fontSize: 15 },
  copy: { gap: Spacing.md, flexShrink: 1, width: '100%', maxWidth: 560, alignSelf: 'center' },
  progress: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.8)' },
  activeDot: { width: 32, backgroundColor: Colors.lime },
  title: { color: '#ffc928', fontWeight: '800', letterSpacing: -0.5, flexShrink: 1 },
  body: { color: '#fff', fontSize: 14, lineHeight: 21, fontWeight: '600', flexShrink: 1 },
  button: { width: '100%', maxWidth: 560, height: 58, borderRadius: Radius.md, backgroundColor: '#07835f', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' },
  buttonText: { color: Colors.lime, fontSize: 16, fontWeight: '800' },
});
