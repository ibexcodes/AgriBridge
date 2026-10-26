import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { Button, Card, Field, Screen } from '@/components/ui';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppStore } from '@/lib/app-store';
import { Category, ListingMode } from '@/lib/types';

export default function NewListingScreen() {
  const { addListing } = useAppStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Fresh produce');
  const [mode, setMode] = useState<ListingMode>('sell');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const valid = Boolean(title.trim() && description.trim() && Number(price) > 0);

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera permission required', 'Allow AgriBridge to use your camera to add a listing photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const choosePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Photo permission required', 'Allow AgriBridge to access your photos to add a listing image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const publish = async () => {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      let listingCoordinates = coordinates;
      if (permission.granted) {
        const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        listingCoordinates = { latitude: current.coords.latitude, longitude: current.coords.longitude };
        setCoordinates(listingCoordinates);
      }
      await addListing({
        id: `listing-${Date.now()}`,
        title,
        category,
        description,
        price: Number(price),
        unit: category === 'Machinery' && mode === 'rent' ? 'per day' : 'per unit',
        location: 'Mahalapye',
        farmer: 'Johanson Sebudi',
        farm: "Johanson's farm",
        image: photoUri
          ? { uri: photoUri }
          : category === 'Machinery'
            ? require('@/assets/agribridge/onboarding-machinery.jpg')
            : category === 'Fertilizer'
              ? require('@/assets/agribridge/onboarding-fertilizer.jpg')
              : require('@/assets/agribridge/onboarding-produce.jpg'),
        mode: category === 'Machinery' ? mode : 'sell',
        quantity: 'Available now',
        isActive: true,
        latitude: listingCoordinates?.latitude,
        longitude: listingCoordinates?.longitude,
      });
      router.replace('/farmer');
    } catch (error) {
      Alert.alert('Could not publish listing', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  return (
    <Screen>
      <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/farmer')}><Text style={styles.back}>← Back</Text></Pressable>
      <View style={styles.intro}>
        <Text style={styles.title}>New listing</Text>
        <Text style={styles.subtitle}>Give buyers a clear, honest picture of what you offer.</Text>
      </View>
      <Card>
        <Text style={styles.label}>Listing photo</Text>
        {photoUri ? <Image source={{ uri: photoUri }} style={styles.preview} /> : <View style={styles.placeholder}><Text style={styles.placeholderText}>Add a photo of your item</Text></View>}
        <View style={styles.photoActions}>
          <Pressable onPress={takePhoto} style={styles.photoButton}><Text style={styles.photoButtonText}>Take picture</Text></Pressable>
          <Pressable onPress={choosePhoto} style={styles.photoButton}><Text style={styles.photoButtonText}>Upload picture</Text></Pressable>
        </View>
        <Field label="Listing title" value={title} onChangeText={setTitle} placeholder="e.g. Fresh tomatoes" />
        <Text style={styles.label}>Category</Text>
        <View style={styles.categories}>
          {(['Fresh produce', 'Machinery', 'Fertilizer'] as Category[]).map((item) => (
            <Pressable key={item} onPress={() => { setCategory(item); if (item !== 'Machinery') setMode('sell'); }} style={[styles.category, category === item && styles.activeCategory]}>
              <Text style={[styles.categoryText, category === item && styles.activeText]}>{item}</Text>
            </Pressable>
          ))}
        </View>
        {category === 'Machinery' ? (
          <>
            <Text style={styles.label}>Offer type</Text>
            <View style={styles.categories}>
              {(['sell', 'rent'] as ListingMode[]).map((item) => (
                <Pressable key={item} onPress={() => setMode(item)} style={[styles.category, mode === item && styles.activeCategory]}>
                  <Text style={[styles.categoryText, mode === item && styles.activeText]}>{item === 'sell' ? 'For sale' : 'For rent'}</Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : null}
        <Field label="Description" value={description} onChangeText={setDescription} placeholder="Describe quality, availability and collection details" multiline />
        <Field label="Price (BWP)" value={price} onChangeText={setPrice} placeholder="450" keyboardType="decimal-pad" />
        <Button disabled={!valid} onPress={publish}>Publish listing</Button>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { color: Colors.green, fontWeight: '800', fontSize: 16 },
  intro: { gap: Spacing.sm, marginTop: Spacing.lg },
  title: { color: Colors.ink, fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  subtitle: { color: Colors.inkSoft, fontSize: 17, lineHeight: 24 },
  label: { color: Colors.ink, fontSize: 14, fontWeight: '700' },
  preview: { width: '100%', height: 190, borderRadius: Radius.md },
  placeholder: { height: 150, borderRadius: Radius.md, backgroundColor: Colors.surfaceSoft, alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: Colors.muted, fontWeight: '700' },
  photoActions: { flexDirection: 'row', gap: Spacing.sm },
  photoButton: { flex: 1, paddingVertical: 13, borderRadius: Radius.md, backgroundColor: Colors.limeSoft, alignItems: 'center' },
  photoButtonText: { color: Colors.green, fontWeight: '800', fontSize: 13 },
  categories: { flexDirection: 'row', gap: 8 },
  category: { flex: 1, paddingVertical: 13, paddingHorizontal: 5, borderRadius: 14, alignItems: 'center', backgroundColor: Colors.surfaceSoft },
  activeCategory: { backgroundColor: Colors.green },
  categoryText: { color: Colors.inkSoft, fontSize: 12, fontWeight: '800', textAlign: 'center' },
  activeText: { color: '#fff' },
});
