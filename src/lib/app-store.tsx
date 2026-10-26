import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { ImageSourcePropType } from 'react-native';
import * as Location from 'expo-location';

import { requireSupabase, supabase } from './supabase';
import { Chat, FulfillmentMethod, Listing, Order, Profile, UserLocation } from './types';

type AppStore = {
  listings: Listing[];
  orders: Order[];
  cart: Listing[];
  favoriteIds: string[];
  chats: Chat[];
  profile: Profile;
  currentLocation: UserLocation | null;
  locationLoading: boolean;
  locationError: string | null;
  refreshCurrentLocation: () => Promise<UserLocation>;
  loading: boolean;
  error: string | null;
  userId: string | null;
  toggleListing: (id: string) => Promise<void>;
  removeListing: (id: string) => Promise<void>;
  deleteArchivedListing: (id: string) => Promise<void>;
  approveOrder: (id: string) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  completeOrder: (id: string) => Promise<void>;
  addToCart: (listing: Listing) => void;
  removeFromCart: (id: string) => void;
  createOrder: (listingId: string, fulfillmentMethod: FulfillmentMethod) => Promise<void>;
  toggleFavorite: (listingId: string) => Promise<void>;
  openConversation: (listingId: string, farmerId: string) => Promise<string>;
  sendMessage: (conversationId: string, body: string) => Promise<void>;
  getMessages: (conversationId: string) => Promise<{ id: string; body: string; senderId: string; createdAt: string }[]>;
  saveProfile: (profile: Profile) => Promise<void>;
  addListing: (listing: Listing) => Promise<void>;
  signOut: () => Promise<void>;
};

const emptyProfile: Profile = { name: '', location: '', farm: '' };
const StoreContext = createContext<AppStore | null>(null);
const relatedRow = <T,>(value: T | T[] | null | undefined): T | null => Array.isArray(value) ? value[0] ?? null : value ?? null;

function categoryFromDb(value: string): Listing['category'] {
  return value === 'fresh_produce' ? 'Fresh produce' : value === 'machinery' ? 'Machinery' : 'Fertilizer';
}

function categoryToDb(value: Listing['category']) {
  return value === 'Fresh produce' ? 'fresh_produce' : value === 'Machinery' ? 'machinery' : 'fertilizer';
}

function imageFromUrl(value: string | null): ImageSourcePropType {
  if (!value) return require('@/assets/agribridge/logo.png');
  if (value.startsWith('http')) return { uri: value };
  return { uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${value}` };
}

export function AppStoreProvider({ children }: PropsWithChildren) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<Listing[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [profile, setProfile] = useState(emptyProfile);
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState<string | null>(supabase ? null : 'Supabase is not configured.');

  const load = async (id: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const client = requireSupabase();
      const listingResult = await client
        .from('listings')
        .select('*, profiles:farmer_id(full_name,location)')
        .order('created_at', { ascending: false });
      if (listingResult.error) throw listingResult.error;
      setListings((listingResult.data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        category: categoryFromDb(row.category),
        description: row.description,
        price: Number(row.price),
        unit: row.quantity || 'per unit',
        location: relatedRow(row.profiles)?.location || 'Botswana',
        farmer: relatedRow(row.profiles)?.full_name || 'AgriBridge farmer',
        farm: relatedRow(row.profiles)?.full_name || 'Local farm',
        image: imageFromUrl(row.image_url),
        mode: row.listing_mode,
        quantity: row.quantity || 'Available now',
        isActive: row.is_active,
        farmerId: row.farmer_id,
        latitude: row.latitude ?? undefined,
        longitude: row.longitude ?? undefined,
      })));

      if (!id) {
        setOrders([]);
        setChats([]);
        setFavoriteIds([]);
        setProfile(emptyProfile);
        setCurrentLocation(null);
        return;
      }

      const [profileResult, orderResult, conversationResult, favoriteResult] = await Promise.all([
        client.from('profiles').select('full_name,location,latitude,longitude').eq('id', id).maybeSingle(),
        client.from('orders').select('id,listing_id,total_amount,item_amount,delivery_fee,fulfillment_method,delivery_area,status,created_at,listings(title),profiles:buyer_id(full_name)').order('created_at', { ascending: false }),
        client.from('conversations').select('id,listing_id,customer_id,farmer_id,listings(title)').or(`customer_id.eq.${id},farmer_id.eq.${id}`),
        client.from('favorites').select('listing_id').eq('user_id', id),
      ]);
      if (profileResult.error) throw profileResult.error;
      if (orderResult.error) throw orderResult.error;
      if (conversationResult.error) throw conversationResult.error;
      setProfile(profileResult.data ? {
        name: profileResult.data.full_name,
        location: profileResult.data.location ?? '',
        farm: profileResult.data.full_name,
        latitude: profileResult.data.latitude ?? undefined,
        longitude: profileResult.data.longitude ?? undefined,
      } : emptyProfile);
      if (profileResult.data?.latitude != null && profileResult.data?.longitude != null) {
        setCurrentLocation({
          latitude: profileResult.data.latitude,
          longitude: profileResult.data.longitude,
          updatedAt: new Date().toISOString(),
          label: profileResult.data.location ?? undefined,
        });
      }
        setOrders((orderResult.data ?? []).map((row) => ({
        id: row.id,
        listingId: row.listing_id,
        listingTitle: relatedRow(row.listings)?.title ?? 'Listing',
        customer: relatedRow(row.profiles)?.full_name ?? 'Customer',
        amount: Number(row.total_amount),
        itemAmount: Number(row.item_amount ?? row.total_amount),
        deliveryFee: Number(row.delivery_fee ?? 0),
        fulfillmentMethod: row.fulfillment_method ?? 'pickup',
        deliveryArea: row.delivery_area ?? 'pickup',
        status: row.status,
        received: new Date(row.created_at).toLocaleDateString(),
      })));
      setChats((conversationResult.data ?? []).map((row) => ({
        id: row.id,
        name: relatedRow(row.listings)?.title ?? 'Conversation',
        listingTitle: relatedRow(row.listings)?.title ?? 'Listing',
        preview: 'Open conversation to view messages.',
        unread: 0,
        farmerId: row.farmer_id,
        listingId: row.listing_id,
      })));
      setFavoriteIds((favoriteResult.data ?? []).map((row) => row.listing_id));
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Unable to load marketplace data.';
      setError(message);
      console.error('Supabase load failed:', caught);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError) throw sessionError;
      if (active) {
        setUserId(data.session?.user.id ?? null);
        void load(data.session?.user.id ?? null);
      }
    }).catch((caught) => {
      setError(caught instanceof Error ? caught.message : 'Unable to restore session.');
      setLoading(false);
    });
    const subscription = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
      void load(session?.user.id ?? null);
    });
    return () => {
      active = false;
      subscription.data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AppStore>(() => ({
    listings,
    orders,
    cart,
    favoriteIds,
    chats,
    profile,
    loading,
    error,
    userId,
    currentLocation,
    locationLoading,
    locationError,
    toggleListing: async (id) => {
      const client = requireSupabase();
      const listing = listings.find((item) => item.id === id);
      if (!listing) return;
      const result = await client.from('listings').update({ is_active: !listing.isActive }).eq('id', id);
      if (result.error) throw result.error;
      await load(userId);
    },
    removeListing: async (id) => {
      // Archive listings instead of deleting them so historical orders retain their reference.
      const result = await requireSupabase().from('listings').update({ is_active: false }).eq('id', id);
      if (result.error) throw result.error;
      await load(userId);
    },
    deleteArchivedListing: async (id) => {
      const result = await requireSupabase().rpc('delete_archived_listing', {
        p_listing_id: id,
      });
      if (result.error) throw result.error;
      await load(userId);
    },
    approveOrder: async (id) => {
      const result = await requireSupabase().from('orders').update({ status: 'approved' }).eq('id', id);
      if (result.error) throw result.error;
      await load(userId);
    },
    cancelOrder: async (id) => {
      const result = await requireSupabase().rpc('cancel_marketplace_order', {
        p_order_id: id,
      });
      if (result.error) throw result.error;
      await load(userId);
    },
    completeOrder: async (id) => {
      const result = await requireSupabase().from('orders').update({ status: 'completed' }).eq('id', id);
      if (result.error) throw result.error;
      await load(userId);
    },
    addToCart: (listing) => {
      setCart((current) => current.some((item) => item.id === listing.id) ? current : [...current, listing]);
    },
    removeFromCart: (id) => {
      setCart((current) => current.filter((item) => item.id !== id));
    },
    createOrder: async (listingId, fulfillmentMethod) => {
      if (!userId) throw new Error('Sign in as a customer before checking out.');
      const result = await requireSupabase().rpc('create_marketplace_order', {
        p_listing_id: listingId,
        p_quantity: 1,
        p_fulfillment_method: fulfillmentMethod,
      });
      if (result.error) throw result.error;
      setCart((current) => current.filter((item) => item.id !== listingId));
      await load(userId);
    },
    refreshCurrentLocation: async () => {
      if (!userId) throw new Error('Sign in before using nearby discovery.');
      setLocationLoading(true);
      setLocationError(null);
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (!permission.granted) {
          throw new Error('Location permission was denied. Enable location access in Settings to use nearby discovery.');
        }
        if (!(await Location.hasServicesEnabledAsync())) {
          throw new Error('Location services are turned off. Turn on GPS and try again.');
        }
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const nextLocation: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy ?? undefined,
          updatedAt: new Date().toISOString(),
        };
        try {
          const places = await Location.reverseGeocodeAsync({
            latitude: nextLocation.latitude,
            longitude: nextLocation.longitude,
          });
          const place = places[0];
          nextLocation.label = [place?.city, place?.district, place?.region].filter(Boolean).join(', ') || undefined;
        } catch (geocodeError) {
          console.warn('Reverse geocoding unavailable:', geocodeError);
        }
        const nextProfile = {
          ...profile,
          location: nextLocation.label || profile.location,
          latitude: nextLocation.latitude,
          longitude: nextLocation.longitude,
        };
        const result = await requireSupabase().from('profiles').update({
          location: nextProfile.location,
          latitude: nextLocation.latitude,
          longitude: nextLocation.longitude,
        }).eq('id', userId);
        if (result.error) throw result.error;
        setProfile(nextProfile);
        setCurrentLocation(nextLocation);
        return nextLocation;
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : 'Unable to determine your location.';
        setLocationError(message);
        throw new Error(message);
      } finally {
        setLocationLoading(false);
      }
    },
    toggleFavorite: async (listingId) => {
      if (!userId) throw new Error('Sign in as a customer to save favourites.');
      const client = requireSupabase();
      const isFavorite = favoriteIds.includes(listingId);
      const result = isFavorite
        ? await client.from('favorites').delete().eq('user_id', userId).eq('listing_id', listingId)
        : await client.from('favorites').insert({ user_id: userId, listing_id: listingId });
      if (result.error) throw result.error;
      setFavoriteIds((current) => isFavorite ? current.filter((id) => id !== listingId) : [...current, listingId]);
    },
    openConversation: async (listingId, farmerId) => {
      if (!userId) throw new Error('Sign in to message this farmer.');
      const result = await requireSupabase().from('conversations').upsert({
        customer_id: userId,
        farmer_id: farmerId,
        listing_id: listingId,
      }, { onConflict: 'customer_id,farmer_id,listing_id' }).select('id').single();
      if (result.error) throw result.error;
      await load(userId);
      return result.data.id;
    },
    sendMessage: async (conversationId, body) => {
      if (!userId || !body.trim()) return;
      const result = await requireSupabase().from('messages').insert({
        conversation_id: conversationId,
        sender_id: userId,
        body: body.trim(),
      });
      if (result.error) throw result.error;
    },
    getMessages: async (conversationId) => {
      const result = await requireSupabase().from('messages').select('id,body,sender_id,created_at').eq('conversation_id', conversationId).order('created_at', { ascending: true });
      if (result.error) throw result.error;
      return (result.data ?? []).map((row) => ({ id: row.id, body: row.body, senderId: row.sender_id, createdAt: row.created_at }));
    },
    saveProfile: async (nextProfile) => {
      if (!userId) throw new Error('Sign in before updating your profile.');
      const result = await requireSupabase().from('profiles').update({
        full_name: nextProfile.name || nextProfile.farm,
        farm_name: nextProfile.farm,
        location: nextProfile.location,
        latitude: nextProfile.latitude ?? null,
        longitude: nextProfile.longitude ?? null,
      }).eq('id', userId);
      if (result.error) throw result.error;
      setProfile(nextProfile);
    },
    addListing: async (listing) => {
      if (!userId) throw new Error('Sign in as a farmer before publishing a listing.');
      let imageUrl: string | null = null;
      const localImage = listing.image && typeof listing.image === 'object' && 'uri' in listing.image ? listing.image.uri : null;
      if (localImage) {
        const imageResponse = await fetch(localImage);
        const imageBlob = await imageResponse.blob();
        const path = `${userId}/${Date.now()}.jpg`;
        const upload = await requireSupabase().storage.from('listing-images').upload(path, imageBlob, {
          contentType: imageBlob.type || 'image/jpeg',
          upsert: false,
        });
        if (upload.error) throw upload.error;
        imageUrl = path;
      }
      const result = await requireSupabase().from('listings').insert({
        farmer_id: userId,
        title: listing.title,
        category: categoryToDb(listing.category),
        description: listing.description,
        price: listing.price,
        quantity: listing.quantity,
        listing_mode: listing.mode,
        is_active: true,
        image_url: imageUrl,
        latitude: listing.latitude ?? profile.latitude ?? null,
        longitude: listing.longitude ?? profile.longitude ?? null,
      });
      if (result.error) throw result.error;
      await load(userId);
    },
    signOut: async () => {
      const result = await requireSupabase().auth.signOut();
      if (result.error) throw result.error;
    },
  }), [listings, orders, cart, favoriteIds, chats, profile, loading, error, userId, currentLocation, locationLoading, locationError]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useAppStore must be used inside AppStoreProvider');
  return store;
}
