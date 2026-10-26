import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { ImageSourcePropType } from 'react-native';

import { requireSupabase, supabase } from './supabase';
import { Chat, Listing, Order, Profile } from './types';

type AppStore = {
  listings: Listing[];
  orders: Order[];
  cart: Listing[];
  chats: Chat[];
  profile: Profile;
  loading: boolean;
  error: string | null;
  userId: string | null;
  toggleListing: (id: string) => Promise<void>;
  removeListing: (id: string) => Promise<void>;
  approveOrder: (id: string) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  completeOrder: (id: string) => Promise<void>;
  addToCart: (listing: Listing) => void;
  removeFromCart: (id: string) => void;
  createOrder: (listingId: string) => Promise<void>;
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
  const [chats, setChats] = useState<Chat[]>([]);
  const [profile, setProfile] = useState(emptyProfile);
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
      })));

      if (!id) {
        setOrders([]);
        setChats([]);
        setProfile(emptyProfile);
        return;
      }

      const [profileResult, orderResult, conversationResult] = await Promise.all([
        client.from('profiles').select('full_name,location').eq('id', id).maybeSingle(),
        client.from('orders').select('id,listing_id,total_amount,status,created_at,listings(title),profiles:buyer_id(full_name)').order('created_at', { ascending: false }),
        client.from('conversations').select('id,listing_id,customer_id,farmer_id,listings(title)').or(`customer_id.eq.${id},farmer_id.eq.${id}`),
      ]);
      if (profileResult.error) throw profileResult.error;
      if (orderResult.error) throw orderResult.error;
      if (conversationResult.error) throw conversationResult.error;
      setProfile(profileResult.data ? { name: profileResult.data.full_name, location: profileResult.data.location ?? '', farm: profileResult.data.full_name } : emptyProfile);
        setOrders((orderResult.data ?? []).map((row) => ({
        id: row.id,
        listingId: row.listing_id,
        listingTitle: relatedRow(row.listings)?.title ?? 'Listing',
        customer: relatedRow(row.profiles)?.full_name ?? 'Customer',
        amount: Number(row.total_amount),
        status: row.status,
        received: new Date(row.created_at).toLocaleDateString(),
      })));
      setChats((conversationResult.data ?? []).map((row) => ({
        id: row.id,
        name: relatedRow(row.listings)?.title ?? 'Conversation',
        listingTitle: relatedRow(row.listings)?.title ?? 'Listing',
        preview: 'Open conversation to view messages.',
        unread: 0,
      })));
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
    chats,
    profile,
    loading,
    error,
    userId,
    toggleListing: async (id) => {
      const client = requireSupabase();
      const listing = listings.find((item) => item.id === id);
      if (!listing) return;
      const result = await client.from('listings').update({ is_active: !listing.isActive }).eq('id', id);
      if (result.error) throw result.error;
      await load(userId);
    },
    removeListing: async (id) => {
      const result = await requireSupabase().from('listings').delete().eq('id', id);
      if (result.error) throw result.error;
      await load(userId);
    },
    approveOrder: async (id) => {
      const result = await requireSupabase().from('orders').update({ status: 'approved' }).eq('id', id);
      if (result.error) throw result.error;
      await load(userId);
    },
    cancelOrder: async (id) => {
      const result = await requireSupabase().from('orders').update({ status: 'cancelled' }).eq('id', id);
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
    createOrder: async (listingId) => {
      if (!userId) throw new Error('Sign in as a customer before checking out.');
      const result = await requireSupabase().rpc('create_marketplace_order', {
        p_listing_id: listingId,
        p_quantity: 1,
      });
      if (result.error) throw result.error;
      setCart((current) => current.filter((item) => item.id !== listingId));
      await load(userId);
    },
    saveProfile: async (nextProfile) => {
      if (!userId) throw new Error('Sign in before updating your profile.');
      const result = await requireSupabase().from('profiles').update({ full_name: nextProfile.name || nextProfile.farm, farm_name: nextProfile.farm, location: nextProfile.location }).eq('id', userId);
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
      });
      if (result.error) throw result.error;
      await load(userId);
    },
    signOut: async () => {
      const result = await requireSupabase().auth.signOut();
      if (result.error) throw result.error;
    },
  }), [listings, orders, cart, chats, profile, loading, error, userId]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useAppStore must be used inside AppStoreProvider');
  return store;
}
