import { ImageSourcePropType } from 'react-native';

export type Role = 'farmer' | 'customer';
export type Category = 'Fresh produce' | 'Machinery' | 'Fertilizer';
export type ListingMode = 'sell' | 'rent';
export type OrderStatus = 'pending' | 'approved' | 'completed' | 'cancelled';
export type FulfillmentMethod = 'pickup' | 'delivery';
export type DeliveryStatus = 'packaging' | 'on_the_way' | 'arrived';

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
  itemAmount?: number;
  deliveryFee?: number;
  fulfillmentMethod?: FulfillmentMethod;
  deliveryArea?: 'same_area' | 'different_area' | 'pickup';
  deliveryStatus?: DeliveryStatus;
  buyerLatitude?: number;
  buyerLongitude?: number;
  farmerLatitude?: number;
  farmerLongitude?: number;
  deliveryUpdatedAt?: string;
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
