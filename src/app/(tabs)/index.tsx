import BalanceView from "@/components/home/balanceView";
import HeadViewAll from "@/components/home/headViewAll";
import ProfileView from "@/components/home/profileView";
import AllSuscriptions from "@/components/home/subCard";
import UpcomingCard from "@/components/home/upCard";
import SafeArea from "@/components/safeArea";
import data from "@/constants/data";
import { theme } from "@/constants/theme";
import { formatCurrency, formatSubscriptionDate } from "@/utils/converter";
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
  const { clearCredentials, getCredentials, user } = useAuth0();
  const [isExpanded, setIsExpanded] = useState<string | undefined | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [profile, setProfile] = useState<Auth0Profile | null>(null);

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
      <HeadViewAll title="All Suscriptions" />
      <FlatList
        data={data.allSubs}
        renderItem={({ item }) => (
          <AllSuscriptions
            {...{
              ...item,
              expanded: isExpanded === item.id,
              onPress: () =>
                setIsExpanded(isExpanded === item.id ? null : item.id),
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text>No Subscriptions</Text>}
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
