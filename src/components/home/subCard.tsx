import {
  formatCurrency,
  formatSubscriptionDate,
  getBillingStatus,
} from "@/utils/converter";
import { clsx } from "clsx";
import { Image, Pressable, Text, View } from "react-native";

const AllSuscriptions = ({
  icon,
  name: subName,
  renewalDate: date,
  currency,
  price,
  billing,
  color,
  paymentMethod,
  startDate,
  status,
  onPress,
  expanded,
}: SubscriptionCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={clsx(
        "mt-6 p-6 border-2 border-border rounded-se-4xl rounded-es-4xl",
        expanded ? "bg-subscription" : "",
      )}
      style={!expanded ? { backgroundColor: color } : {}}
    >
      <View className="flex flex-row">
        <View className="p-2 bg-white/70 rounded-2xl">
          <Image className="size-12" source={icon} />
        </View>
        <View className="flex flex-col ml-4">
          <Text className="text-2xl font-sans-bold">
            {subName.split(" ")[0]}
          </Text>
          <Text className="text-lg text-muted-foreground font-sans-semibold">
            {formatSubscriptionDate(date, "month-day-time")}
          </Text>
        </View>
        <View className="flex flex-col ml-auto items-end">
          <Text className="mb-1 text-lg font-sans-bold text-primary">
            {formatCurrency(currency, price)}
          </Text>
          <Text className="text-sm font-sans-medium text-muted-foreground">
            {getBillingStatus(billing)}
          </Text>
        </View>
      </View>

      {expanded && (
        <View className="flex flex-col mt-4 gap-2">
          <View className="flex flex-row">
            <Text className="text-base font-sans-medium text-muted-foreground">
              Payment:
            </Text>
            <Text className="font-sans-bold text-primary">
              {" "}
              {paymentMethod}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-base font-sans-medium text-muted-foreground">
              Start Date:
            </Text>
            <Text className="font-sans-bold text-primary">
              {" "}
              {formatSubscriptionDate(startDate, "month-day")}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-base font-sans-medium text-muted-foreground">
              Next billing amount:
            </Text>
            <Text className="font-sans-bold text-primary">
              {" "}
              {formatCurrency(currency, price)}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-base font-sans-medium text-muted-foreground">
              Renewable Date:
            </Text>
            <Text className="font-sans-bold text-primary">
              {" "}
              {formatSubscriptionDate(date, "month-day")}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-base font-sans-medium text-muted-foreground">
              Status:
            </Text>
            <Text className="font-sans-bold text-primary"> {status}</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default AllSuscriptions;
