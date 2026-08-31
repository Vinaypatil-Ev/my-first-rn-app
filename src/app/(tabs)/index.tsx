import BalanceView from "@/components/home/balanceView";
import HeadViewAll from "@/components/home/headViewAll";
import ProfileView from "@/components/home/profileView";
import AllSuscriptions from "@/components/home/subCard";
import UpcomingCard from "@/components/home/upCard";
import SafeArea from "@/components/safeArea";
import data from "@/constants/data";
import { theme } from "@/constants/theme";
import { formatCurrency, formatSubscriptionDate } from "@/utils/converter";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function Home() {
  const { currency, amount, nextRenewalDate: date } = data.balance;
  const { name, uri } = data.user;
  const [isExpanded, setIsExpanded] = useState<string | undefined | null>(null);
  return (
    <View>
      <ProfileView userName={name} profileUri={uri} />
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
