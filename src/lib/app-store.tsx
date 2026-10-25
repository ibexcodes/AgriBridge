import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

import { chats as seedChats, defaultProfile, listings as seedListings, orders as seedOrders } from './demo-data';
import { Chat, Listing, Order, Profile } from './types';

type AppStore = {
  listings: Listing[];
  orders: Order[];
  chats: Chat[];
  profile: Profile;
  toggleListing: (id: string) => void;
  removeListing: (id: string) => void;
  approveOrder: (id: string) => void;
  saveProfile: (profile: Profile) => void;
  addListing: (listing: Listing) => void;
};

const StoreContext = createContext<AppStore | null>(null);

export function AppStoreProvider({ children }: PropsWithChildren) {
  const [listings, setListings] = useState(seedListings);
  const [orders, setOrders] = useState(seedOrders);
  const [profile, setProfile] = useState(defaultProfile);

  const value = useMemo<AppStore>(
    () => ({
      listings,
      orders,
      chats: seedChats,
      profile,
      toggleListing: (id) =>
        setListings((current) =>
          current.map((listing) =>
            listing.id === id ? { ...listing, isActive: !listing.isActive } : listing
          )
        ),
      removeListing: (id) => setListings((current) => current.filter((listing) => listing.id !== id)),
      approveOrder: (id) =>
        setOrders((current) =>
          current.map((order) => (order.id === id ? { ...order, status: 'approved' } : order))
        ),
      saveProfile: setProfile,
      addListing: (listing) => setListings((current) => [listing, ...current]),
    }),
    [listings, orders, profile]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore() {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useAppStore must be used inside AppStoreProvider');
  }
  return store;
}
