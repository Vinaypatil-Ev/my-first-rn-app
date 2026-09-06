import SafeArea from "@/components/safeArea";
import { theme } from "@/constants/theme";
import { useSubscriptions } from "@/lib/subscriptionStore";
import { formatCurrency, getDaysLeft } from "@/utils/converter";
import { usePostHog } from "posthog-react-native";
import { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Line, Rect } from "react-native-svg";

type Period = "Monthly" | "Yearly";

const monthlyCost = (subscription: Subscription) =>
  subscription.billing.toLowerCase() === "yearly"
    ? subscription.price / 12
    : subscription.price;

const periodLabels = (period: Period) => {
  const today = new Date();

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today);
    date.setMonth(
      date.getMonth() + (period === "Monthly" ? index : index * 12),
    );

    return period === "Monthly"
      ? date.toLocaleString("en-US", { month: "short" })
      : String(date.getFullYear());
  });
};

export default function Analytics() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const posthog = usePostHog();
  const subscriptions = useSubscriptions();
  const [period, setPeriod] = useState<Period>("Monthly");
  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.status !== "cancelled",
  );
  const monthlySpend = activeSubscriptions.reduce(
    (total, subscription) => total + monthlyCost(subscription),
    0,
  );
  const annualSpend = monthlySpend * 12;
  const labels = periodLabels(period);
  const periodSpend = period === "Monthly" ? monthlySpend : annualSpend;
  const chartValues = labels.map((_, index) =>
    period === "Monthly"
      ? monthlySpend
      : annualSpend +
        index *
          activeSubscriptions
            .filter((item) => item.billing.toLowerCase() === "yearly")
            .reduce((total, item) => total + item.price * 0.04, 0),
  );
  const categorySpend = Object.entries(
    activeSubscriptions.reduce<Record<string, number>>(
      (totals, subscription) => {
        const category = subscription.category ?? "Other";
        totals[category] = (totals[category] ?? 0) + monthlyCost(subscription);
        return totals;
      },
      {},
    ),
  ).sort(([, first], [, second]) => second - first);
  const nextRenewals = [...activeSubscriptions]
    .filter((subscription) => subscription.renewalDate)
    .sort(
      (first, second) =>
        new Date(first.renewalDate ?? 0).getTime() -
        new Date(second.renewalDate ?? 0).getTime(),
    )
    .slice(0, 3);
  const maxChartValue = Math.max(...chartValues, 1);
  const chartWidth = Math.max(280, width - theme.spacing[8] * 2);
  const barAreaWidth = chartWidth - 36;

  useEffect(() => {
    posthog.capture("analytics_tab_viewed", {
      frequency: period.toLowerCase(),
      subscription_count: activeSubscriptions.length,
    });
  }, [activeSubscriptions.length, period, posthog]);

  return (
    <SafeArea>
      <ScrollView
        contentContainerStyle={{
          paddingBottom:
            theme.components.tabBar.height +
            Math.max(insets.bottom, theme.components.tabBar.horizontalInset),
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-sans-bold text-primary">Analytics</Text>
        <Text className="mt-1 font-sans-medium text-muted-foreground">
          Your recurring spending, at a glance.
        </Text>

        <View className="mt-6 flex-row gap-3">
          {(["Monthly", "Yearly"] as Period[]).map((option) => (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected: period === option }}
              className={`flex-1 rounded-lg border px-4 py-3 ${period === option ? "border-primary bg-primary" : "border-border bg-card"}`}
              onPress={() => setPeriod(option)}
            >
              <Text
                className={`text-center font-sans-semibold ${period === option ? "text-background" : "text-primary"}`}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>

        <View
          className="mt-6 border-2 border-border bg-card p-5"
          style={styles.panel}
        >
          <Text className="font-sans-semibold text-muted-foreground">
            {period} spend
          </Text>
          <Text className="mt-1 text-4xl font-sans-extrabold text-primary">
            {formatCurrency("USD", periodSpend)}
          </Text>
          <Text className="mt-2 font-sans-medium text-muted-foreground">
            Across {activeSubscriptions.length} active subscriptions
          </Text>
        </View>

        <View
          className="mt-6 border-2 border-border bg-card p-5"
          style={styles.panel}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-sans-bold text-primary">
              Spending frequency
            </Text>
            <Text className="font-sans-semibold text-muted-foreground">
              Next 6 {period === "Monthly" ? "months" : "years"}
            </Text>
          </View>
          <Svg height={184} width={chartWidth} style={styles.chart}>
            {[40, 88, 136].map((y) => (
              <Line
                key={y}
                stroke={theme.colors.border}
                strokeWidth={1}
                x1={0}
                x2={chartWidth}
                y1={y}
                y2={y}
              />
            ))}
            {chartValues.map((value, index) => {
              const barWidth = barAreaWidth / chartValues.length - 12;
              const barHeight = Math.max(10, (value / maxChartValue) * 122);
              const x = 18 + index * (barAreaWidth / chartValues.length);

              return (
                <Rect
                  key={labels[index]}
                  fill={theme.colors.accent}
                  height={barHeight}
                  rx={6}
                  width={barWidth}
                  x={x}
                  y={154 - barHeight}
                />
              );
            })}
          </Svg>
          <View className="flex-row justify-around">
            {labels.map((label) => (
              <Text
                key={label}
                className="font-sans-medium text-muted-foreground"
              >
                {label}
              </Text>
            ))}
          </View>
        </View>

        <View className="mt-6 flex-row gap-3">
          <View
            className="flex-1 border-2 border-border bg-muted p-4"
            style={styles.panel}
          >
            <Text className="font-sans-semibold text-muted-foreground">
              Average plan
            </Text>
            <Text className="mt-2 text-2xl font-sans-bold text-primary">
              {formatCurrency(
                "USD",
                activeSubscriptions.length
                  ? monthlySpend / activeSubscriptions.length
                  : 0,
              )}
            </Text>
          </View>
          <View
            className="flex-1 border-2 border-border bg-subscription p-4"
            style={styles.panel}
          >
            <Text className="font-sans-semibold text-primary">
              Annual forecast
            </Text>
            <Text className="mt-2 text-2xl font-sans-bold text-primary">
              {formatCurrency("USD", annualSpend)}
            </Text>
          </View>
        </View>

        <Text className="mt-8 text-xl font-sans-bold text-primary">
          Top categories
        </Text>
        {categorySpend.map(([category, amount]) => (
          <View
            key={category}
            className="mt-3 flex-row items-center justify-between border-b border-border pb-3"
          >
            <Text className="font-sans-semibold text-primary">{category}</Text>
            <Text className="font-sans-bold text-primary">
              {formatCurrency("USD", amount)}/mo
            </Text>
          </View>
        ))}

        <Text className="mt-8 text-xl font-sans-bold text-primary">
          Renewal activity
        </Text>
        {nextRenewals.length ? (
          nextRenewals.map((subscription) => (
            <View
              key={subscription.id}
              className="mt-3 flex-row items-center justify-between border-2 border-border bg-card p-4"
              style={styles.panel}
            >
              <View>
                <Text className="font-sans-bold text-primary">
                  {subscription.name}
                </Text>
                <Text className="mt-1 font-sans-medium text-muted-foreground">
                  {getDaysLeft(subscription.renewalDate)}
                </Text>
              </View>
              <Text className="font-sans-bold text-primary">
                {formatCurrency(subscription.currency, subscription.price)}
              </Text>
            </View>
          ))
        ) : (
          <Text className="mt-3 font-sans-medium text-muted-foreground">
            No upcoming renewals.
          </Text>
        )}
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  chart: { marginTop: 16 },
  panel: { borderRadius: 8 },
});
