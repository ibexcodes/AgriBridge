import { ImageSourcePropType } from 'react-native';

export type Role = 'farmer' | 'customer';
export type Category = 'Fresh produce' | 'Machinery' | 'Fertilizer';
export type ListingMode = 'sell' | 'rent';
export type OrderStatus = 'pending' | 'approved' | 'completed' | 'cancelled';

export type Listing = {
  id: string;
  title: string;
  category: Category;
  description: string;
  price: number;
  unit: string;
  location: string;
  farmer: string;
  farm: string;
  image: ImageSourcePropType;
  mode: ListingMode;
  quantity: string;
  isActive: boolean;
  farmerId?: string;
  latitude?: number;
  longitude?: number;
};

export type Order = {
  id: string;
  listingId: string;
  listingTitle: string;
  customer: string;
  amount: number;
  status: OrderStatus;
  received: string;
};

export type Chat = {
  id: string;
  name: string;
  listingTitle: string;
  preview: string;
  unread: number;
  farmerId?: string;
  listingId?: string;
};

export type Profile = {
  name: string;
  location: string;
  farm: string;
  latitude?: number;
  longitude?: number;
};

export type UserLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  updatedAt: string;
  label?: string;
};
