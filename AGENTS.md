# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Reference Implementation: Recurrly

Use https://github.com/adrianhajdin/react-native-recurrly as the upstream reference for this subscription-management app. It is a React Native, Expo Router, TypeScript, and NativeWind application with authentication, subscription state, and analytics.

For dashboard or subscription UI work, inspect the matching upstream source before introducing a new pattern. The home screen uses one vertical `FlatList` for all subscriptions; the profile, balance, and horizontal upcoming-subscriptions `FlatList` are inside its `ListHeaderComponent`. This prevents the screen from having multiple competing vertical list containers.

Relevant upstream structure:

```text
app/
	_layout.tsx                    # Root providers and navigation
	(tabs)/
		_layout.tsx                  # Tab navigator
		index.tsx                    # Home dashboard and nested upcoming list
		subscriptions.tsx            # Subscription list screen
		settings.tsx                 # Settings screen
	(auth)/                        # Sign-in and sign-up routes
	subscriptions/[id].tsx         # Subscription detail route
components/
	UpcomingSubscriptionCard.tsx   # Horizontal upcoming-renewal card
	SubscriptionCard.tsx           # Main vertical subscription card
	ListHeading.tsx                # Section heading
	CreateSubscriptionModal.tsx    # Create-subscription flow
constants/                       # Theme, assets, and sample constants
lib/
	subscriptionStore.ts           # Subscription state
	utils.ts                       # Formatting helpers
src/config/posthog.ts            # Analytics configuration
```

Local equivalents:

```text
src/app/(tabs)/index.tsx         # Home dashboard
src/components/home/upCard.tsx   # Upcoming-renewal card
src/components/home/headViewAll.tsx
src/constants/data.ts
src/utils/converter.ts
```
