# AgriBridge

AgriBridge is a Botswana-focused mobile marketplace connecting farmers and customers for fresh produce, farm equipment, and fertilizer.

## Product flows

- Welcome and role selection for farmers and customers
- Email sign-in and account creation screens
- Customer marketplace with search, category filters, listing details, favorites-ready cards, and seller contact
- Farmer dashboard with inventory controls, incoming order approval, buyer chats, profile editing, and listing creation
- Shared messages and profile routes
- Supabase-ready client boundary and migration for profiles, listings, orders, conversations, messages, and notifications

## Development

```bash
npm install
npx expo start
```

The app uses Expo SDK 58, Expo Router, React Native, and NativeWind/Tailwind infrastructure. The current screens use typed React Native styles for predictable mobile rendering while the NativeWind pipeline is available for utility-driven components.

To connect the backend, create a local `.env` file with:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
```

Apply the database schema with the Supabase CLI:

```bash
npx supabase db push
```

## Quality checks

```bash
npx expo-doctor
npm run lint
npx tsc --noEmit

```