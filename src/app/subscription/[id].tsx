import SafeArea from "@/components/safeArea";
import data from "@/constants/data";
import { formatCurrency, formatSubscriptionDate } from "@/utils/converter";
import { router, useLocalSearchParams } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const posthog = usePostHog();
  const subscriptionId = Array.isArray(id) ? id[0] : id;
  const subscription = data.allSubs.find((item) => item.id === subscriptionId);
  const [isRenewalCancelled, setIsRenewalCancelled] = useState(
    subscription?.status === "cancelled",
  );
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  useEffect(() => {
    if (subscriptionId) {
      posthog.capture("subscription_detail_viewed", {
        subscription_id: subscriptionId,
      });
    }
  }, [posthog, subscriptionId]);

  if (!subscription) {
    return (
      <SafeArea>
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-2xl font-sans-bold text-primary">
            Subscription not found
          </Text>
          <Pressable
            accessibilityRole="button"
            className="rounded-full bg-primary px-5 py-3"
            onPress={() => router.replace("/subscription")}
          >
            <Text className="font-sans-bold text-background">
              Back to subscriptions
            </Text>
          </Pressable>
        </View>
      </SafeArea>
    );
  }

  const status = isRenewalCancelled
    ? "cancelled"
    : (subscription.status ?? "active");
  const details = [
    ["Plan", subscription.plan ?? "Not provided"],
    ["Category", subscription.category ?? "Not provided"],
    ["Payment method", subscription.paymentMethod ?? "Not provided"],
    ["Started", formatSubscriptionDate(subscription.startDate, "month-day")],
    [
      "Renewal date",
      formatSubscriptionDate(subscription.renewalDate, "month-day"),
    ],
  ];

  const handleRefresh = () => {
    setLastRefreshed(new Date());
    posthog.capture("subscription_detail_refreshed", {
      subscription_id: subscription.id,
    });
  };

  const handleCancelRenewal = () => {
    Alert.alert(
      "Cancel renewal?",
      `Your ${subscription.name} access will continue until the current billing period ends.`,
      [
        { style: "cancel", text: "Keep renewal" },
        {
          style: "destructive",
          text: "Cancel renewal",
          onPress: () => {
            setIsRenewalCancelled(true);
            posthog.capture("subscription_renewal_cancelled", {
              subscription_id: subscription.id,
              subscription_name: subscription.name,
            });
          },
        },
      ],
    );
  };

  return (
    <SafeArea>
      <ScrollView
        contentContainerClassName="pb-28"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 flex-row items-center justify-between">
          <Pressable
            accessibilityLabel="Back to subscriptions"
            accessibilityRole="button"
            className="rounded-full border-2 border-border px-4 py-2"
            onPress={() => router.back()}
          >
            <Text className="font-sans-semibold text-primary">Back</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Refresh subscription details"
            accessibilityRole="button"
            className="rounded-full border-2 border-border px-4 py-2"
            onPress={handleRefresh}
          >
            <Text className="font-sans-semibold text-primary">Refresh</Text>
          </Pressable>
        </View>

        <View
          className="rounded-bl-4xl rounded-tr-4xl border-2 border-border p-6"
          style={{ backgroundColor: subscription.color }}
        >
          <View className="flex-row items-center gap-4">
            <View className="rounded-2xl bg-white/70 p-3">
              <Image className="size-16" source={subscription.icon} />
            </View>
            <View className="min-w-0 flex-1">
              <Text className="text-3xl font-sans-bold text-primary">
                {subscription.name}
              </Text>
              <Text className="mt-1 text-lg font-sans-semibold text-muted-foreground">
                {subscription.plan}
              </Text>
            </View>
          </View>
          <View className="mt-8 flex-row items-end justify-between">
            <View>
              <Text className="text-sm font-sans-semibold text-muted-foreground">
                Next payment
              </Text>
              <Text className="text-4xl font-sans-extrabold text-primary">
                {formatCurrency(subscription.currency, subscription.price)}
              </Text>
            </View>
            <Text className="rounded-full bg-background px-3 py-1 font-sans-bold capitalize text-primary">
              {status}
            </Text>
          </View>
        </View>

        <View className="mt-6 gap-4">
          {details.map(([label, value]) => (
            <View
              key={label}
              className="flex-row items-start justify-between gap-4 border-b border-border pb-4"
            >
              <Text className="text-base font-sans-medium text-muted-foreground">
                {label}
              </Text>
              <Text className="flex-1 text-right text-base font-sans-bold text-primary">
                {value}
              </Text>
            </View>
          ))}
        </View>

        {lastRefreshed && (
          <Text className="mt-5 text-center text-sm font-sans-medium text-muted-foreground">
            Details refreshed at {lastRefreshed.toLocaleTimeString()}
          </Text>
        )}

        {isRenewalCancelled ? (
          <Text className="mt-8 rounded-2xl bg-muted p-4 text-center font-sans-semibold text-primary">
            Renewal is cancelled. Access continues through{" "}
            {formatSubscriptionDate(subscription.renewalDate, "month-day")}.
          </Text>
        ) : (
          <Pressable
            accessibilityRole="button"
            className="mt-8 rounded-full bg-destructive py-4"
            onPress={handleCancelRenewal}
          >
            <Text className="text-center font-sans-bold text-white">
              Cancel renewal
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeArea>
  );
};

export default SubscriptionDetails;
