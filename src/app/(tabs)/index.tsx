import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import BalanceView from "@/components/home/balanceView";
import HeadViewAll from "@/components/home/headViewAll";
import ProfileView from "@/components/home/profileView";
import AllSuscriptions from "@/components/home/subCard";
import UpcomingCard from "@/components/home/upCard";
import SafeArea from "@/components/safeArea";
import data from "@/constants/data";
import { theme } from "@/constants/theme";
import { addSubscription, useSubscriptions } from "@/lib/subscriptionStore";
import { formatCurrency, formatSubscriptionDate } from "@/utils/converter";
import { router } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Auth0Profile = {
  name?: string;
  nickname?: string;
  picture?: string;
};

function Home() {
  const { currency, amount, nextRenewalDate: date } = data.balance;
  const subscriptions = useSubscriptions();
  const { clearCredentials, getCredentials, user } = useAuth0();
  const posthog = usePostHog();
  const [isExpanded, setIsExpanded] = useState<string | undefined | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [profile, setProfile] = useState<Auth0Profile | null>(null);

  useEffect(() => {
    posthog.capture("home_viewed", {
      subscription_count: subscriptions.length,
      upcoming_count: data.upcomming.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const credentials = await getCredentials();
        const response = await fetch(
          `https://${process.env.EXPO_PUBLIC_AUTH0_DOMAIN}/userinfo`,
          { headers: { Authorization: `Bearer ${credentials.accessToken}` } },
        );

        if (response.ok && isMounted) {
          setProfile((await response.json()) as Auth0Profile);
        }
      } catch {
        // The ID token profile remains available when the userinfo request fails.
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [getCredentials]);

  const userName = profile?.name ?? user?.name ?? user?.nickname ?? "Member";
  const profileUri = profile?.picture ?? user?.picture;

  const handleProfilePress = () => {
    setIsLogoutVisible((visible) => !visible);
  };

  const handleLogout = () => {
    setIsLogoutVisible(false);
    setIsSigningOut(true);
    void clearCredentials().finally(() => {
      setIsSigningOut(false);
    });
  };

  return (
    <View>
      <ProfileView
        userName={userName}
        profileUri={profileUri}
        isSigningOut={isSigningOut}
        isLogoutVisible={isLogoutVisible}
        onProfilePress={handleProfilePress}
        onLogoutPress={handleLogout}
        onAddPress={() => setIsCreateVisible(true)}
      />
      <BalanceView
        balance={formatCurrency(currency, amount)}
        dt={formatSubscriptionDate(date)}
      />
      <HeadViewAll title="Upcomming" />
      <FlatList
        data={data.upcomming}
        renderItem={({ item }) => <UpcomingCard {...item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={<Text>No Upcomming renewals</Text>}
      />
      <HeadViewAll
        title="All Suscriptions"
        onViewAll={() => {
          posthog.capture("all_subscriptions_view_all_pressed");
          router.push("/subscription");
        }}
      />
      <FlatList
        data={subscriptions}
        renderItem={({ item }) => (
          <AllSuscriptions
            {...{
              ...item,
              expanded: isExpanded === item.id,
              onPress: () => {
                const willExpand = isExpanded !== item.id;
                setIsExpanded(willExpand ? item.id : null);
                posthog.capture(
                  willExpand
                    ? "subscription_card_expanded"
                    : "subscription_card_collapsed",
                  {
                    subscription_id: item.id,
                    subscription_name: item.name,
                    billing_cycle: item.billing,
                    status: item.status ?? null,
                  },
                );
              },
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text>No Subscriptions</Text>}
      />
      <CreateSubscriptionModal
        visible={isCreateVisible}
        onClose={() => setIsCreateVisible(false)}
        onSubmit={(subscription) => {
          addSubscription(subscription);
          posthog.capture("subscription_created", {
            subscription_id: subscription.id,
            subscription_name: subscription.name,
            subscription_price: subscription.price,
            subscription_frequency: subscription.billing,
            subscription_category: subscription.category,
          });
        }}
      />
    </View>
  );
}

export default function Index() {
  const insets = useSafeAreaInsets();

  return (
    <SafeArea>
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={<Home />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom:
            theme.components.tabBar.height +
            Math.max(insets.bottom, theme.components.tabBar.horizontalInset),
        }}
      />
    </SafeArea>
  );
}
