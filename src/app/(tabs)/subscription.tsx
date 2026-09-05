import AllSuscriptions from "@/components/home/subCard";
import SafeArea from "@/components/safeArea";
import data from "@/constants/data";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";
import { theme } from "@/constants/theme";

const Subscription = () => {
  const posthog = usePostHog();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    posthog.capture("subscription_tab_viewed", {
      subscription_count: data.allSubs.length,
    });
  }, [posthog]);

  const filteredSubscriptions = data.allSubs.filter((subscription) => {
    const query = searchQuery.trim().toLowerCase();

    return (
      !query ||
      subscription.name.toLowerCase().includes(query) ||
      subscription.category?.toLowerCase().includes(query) ||
      subscription.plan?.toLowerCase().includes(query)
    );
  });

  return (
    <SafeArea>
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AllSuscriptions
            {...item}
            expanded={false}
            onPress={() => {
              posthog.capture("subscription_selected", {
                subscription_id: item.id,
                subscription_name: item.name,
              });
              router.push({ pathname: "/subscription/[id]", params: { id: item.id } });
            }}
          />
        )}
        ListHeaderComponent={
          <View className="pt-2">
            <Text className="mb-5 text-3xl font-sans-bold text-primary">
              Subscriptions
            </Text>
            <TextInput
              accessibilityLabel="Search subscriptions"
              className="mb-2 rounded-2xl border-2 border-border bg-card px-4 py-3 text-lg font-sans-medium text-primary"
              keyboardType="default"
              onChangeText={setSearchQuery}
              placeholder="Search subscriptions"
              placeholderTextColor={theme.colors.mutedForeground}
              value={searchQuery}
            />
          </View>
        }
        ListEmptyComponent={
          <Text className="mt-6 text-center text-lg font-sans-medium text-muted-foreground">
            No subscriptions match your search.
          </Text>
        }
        contentContainerStyle={{
          paddingBottom:
            theme.components.tabBar.height +
            Math.max(insets.bottom, theme.components.tabBar.horizontalInset),
        }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </SafeArea>
  );
};

export default Subscription;