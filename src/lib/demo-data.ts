import { Listing, Order, Chat, Profile } from './types';

export const images = {
  produce: require('@/assets/agribridge/produce.jpg'),
  fertilizer: require('@/assets/agribridge/fertilizer.jpg'),
  tractor: require('@/assets/agribridge/tractor.jpg'),
  hero: require('@/assets/agribridge/hero-farmer.jpg'),
  logo: require('@/assets/agribridge/logo.png'),
} as const;

export const listings: Listing[] = [
  {
    id: 'madila',
    title: 'Traditional Madila',
    category: 'Fresh produce',
    description: 'Creamy traditional fermented milk, prepared fresh in small batches.',
    price: 450,
    unit: '20L bucket',
    location: 'Mahalapye',
    farmer: 'Johanson Sebudi',
    farm: "Johanson's farm",
    image: images.produce,
    mode: 'sell',
    quantity: '8 buckets available',
    isActive: true,
  },
  {
    id: 'tractor-6603',
    title: 'John Deere 6603 tractor',
    category: 'Machinery',
    description: 'Reliable field tractor available for seasonal work and farm preparation.',
    price: 1200,
    unit: 'per day',
    location: 'Gaborone',
    farmer: 'Kabelo Farms',
    farm: 'Kabelo Agricultural Services',
    image: images.tractor,
    mode: 'rent',
    quantity: 'Available from 24 Oct',
    isActive: true,
  },
  {
    id: 'fertilizer',
    title: 'Crop starter fertilizer',
    category: 'Fertilizer',
    description: 'Balanced fertilizer blend to support soil health and stronger crop growth.',
    price: 280,
    unit: '25kg bag',
    location: 'Francistown',
    farmer: 'GreenField Inputs',
    farm: 'GreenField Inputs',
    image: images.fertilizer,
    mode: 'sell',
    quantity: '32 bags available',
    isActive: true,
  },
];

export const orders: Order[] = [
  {
    id: 'order-1',
    listingId: 'madila',
    listingTitle: 'Traditional Madila',
    customer: 'Karabo Sebudi',
    amount: 450,
    status: 'pending',
    received: '18 Oct 2026',
  },
];

export const chats: Chat[] = [
  {
    id: 'chat-1',
    name: 'Karabo Sebudi',
    listingTitle: 'Traditional Madila',
    preview: 'Is this still available for collection tomorrow?',
    unread: 2,
  },
];

export const defaultProfile: Profile = {
  name: 'Johanson Sebudi',
  location: 'Mahalapye',
  farm: "Johanson's farm",
};
