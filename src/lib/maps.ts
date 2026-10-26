import { Alert, Linking, Platform } from 'react-native';

export async function openGoogleMapsDirections(latitude?: number, longitude?: number, label = 'destination') {
  if (latitude == null || longitude == null) {
    Alert.alert('Location unavailable', `The ${label} location has not been shared yet.`);
    return;
  }

  const destination = `${latitude},${longitude}`;
  const nativeUrl = Platform.OS === 'ios'
    ? `comgooglemaps://?daddr=${destination}&directionsmode=driving`
    : `google.navigation:q=${destination}`;
  const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;

  try {
    if (await Linking.canOpenURL(nativeUrl)) {
      await Linking.openURL(nativeUrl);
      return;
    }
  } catch (error) {
    console.warn('Native Google Maps deep link unavailable:', error);
  }

  try {
    await Linking.openURL(fallbackUrl);
    return;
  } catch (error) {
    console.warn('Google Maps web directions unavailable:', error);
  }

  Alert.alert('Google Maps unavailable', 'Install Google Maps or enable a supported maps application on this device.');
}
