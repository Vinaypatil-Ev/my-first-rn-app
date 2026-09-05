import { icons, type IconKey } from "@/constants/icons";
import { theme } from "@/constants/theme";
import { useState } from "react";
import {
    Animated,
    Image,
    KeyboardAvoidingView,
    Modal,
    PanResponder,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

type Frequency = "Monthly" | "Yearly";

const categories = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Other",
] as const;

const categoryColors: Record<(typeof categories)[number], string> = {
  Entertainment: "#ffb4a2",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#95e1d3",
  Other: "#d4d4d4",
};

const iconChoices: IconKey[] = [
  "spotify",
  "notion",
  "figma",
  "github",
  "adobe",
  "claude",
  "canva",
  "openai",
  "dropbox",
  "medium",
];

type CreateSubscriptionModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
};

export default function CreateSubscriptionModal({
  visible,
  onClose,
  onSubmit,
}: CreateSubscriptionModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("Monthly");
  const [category, setCategory] =
    useState<(typeof categories)[number]>("Other");
  const [iconKey, setIconKey] = useState<IconKey>("plus");
  const [sheetOffset] = useState(() => new Animated.Value(0));

  const numericPrice = Number(price.trim());
  const isValid =
    name.trim().length > 0 && Number.isFinite(numericPrice) && numericPrice > 0;

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Other");
    setIconKey("plus");
  };

  const handleClose = () => {
    sheetOffset.setValue(0);
    resetForm();
    onClose();
  };

  const sheetPanResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) =>
      gesture.dy > 4 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
    onPanResponderMove: (_, gesture) => {
      sheetOffset.setValue(Math.max(0, gesture.dy));
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy > 90) {
        handleClose();
        return;
      }

      Animated.spring(sheetOffset, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderTerminate: () => {
      Animated.spring(sheetOffset, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    },
  });

  const handleCreate = () => {
    if (!isValid) return;

    const startDate = new Date();
    const renewalDate = new Date(startDate);
    renewalDate.setMonth(
      renewalDate.getMonth() + (frequency === "Monthly" ? 1 : 12),
    );

    onSubmit({
      id: `subscription-${Date.now()}`,
      icon: icons[iconKey],
      name: name.trim(),
      category,
      status: "active",
      startDate: startDate.toISOString(),
      price: numericPrice,
      currency: "USD",
      billing: frequency,
      renewalDate: renewalDate.toISOString(),
      color: categoryColors[category],
    });
    resetForm();
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-end bg-black/40">
          <Animated.View
            className="rounded-t-3xl bg-background"
            style={{ height: "75%", transform: [{ translateY: sheetOffset }] }}
          >
            <View
              {...sheetPanResponder.panHandlers}
              className="items-center border-b border-border px-6 pb-3 pt-3"
            >
              <View className="h-1.5 w-12 rounded-full bg-primary/25" />
            </View>
            <View className="flex-row items-center justify-between px-6 pb-4 pt-2">
              <Text className="text-2xl font-sans-bold text-primary">
                New Subscription
              </Text>
            </View>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{
                gap: 20,
                paddingHorizontal: 24,
                paddingBottom: 24,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="gap-2">
                <Text className="font-sans-semibold text-primary">Name</Text>
                <TextInput
                  accessibilityLabel="Subscription name"
                  className="rounded-lg border border-border bg-card px-4 py-3 font-sans-medium text-primary"
                  onChangeText={setName}
                  placeholder="e.g. Netflix"
                  placeholderTextColor={theme.colors.mutedForeground}
                  value={name}
                />
              </View>
              <View className="gap-2">
                <Text className="font-sans-semibold text-primary">Price</Text>
                <TextInput
                  accessibilityLabel="Subscription price"
                  className="rounded-lg border border-border bg-card px-4 py-3 font-sans-medium text-primary"
                  keyboardType="decimal-pad"
                  onChangeText={setPrice}
                  placeholder="0.00"
                  placeholderTextColor={theme.colors.mutedForeground}
                  value={price}
                />
              </View>
              <View className="gap-2">
                <Text className="font-sans-semibold text-primary">
                  Frequency
                </Text>
                <View className="flex-row gap-3">
                  {(["Monthly", "Yearly"] as Frequency[]).map((option) => (
                    <Pressable
                      key={option}
                      accessibilityRole="button"
                      className={`flex-1 rounded-lg border px-4 py-3 ${frequency === option ? "border-primary bg-primary" : "border-border bg-card"}`}
                      onPress={() => setFrequency(option)}
                    >
                      <Text
                        className={`text-center font-sans-semibold ${frequency === option ? "text-white" : "text-primary"}`}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View className="gap-2">
                <Text className="font-sans-semibold text-primary">
                  Category
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {categories.map((option) => (
                      <Pressable
                        key={option}
                        accessibilityRole="button"
                        className={`rounded-full border px-4 py-2 ${category === option ? "border-primary bg-primary" : "border-border bg-card"}`}
                        onPress={() => setCategory(option)}
                      >
                        <Text
                          className={`font-sans-semibold ${category === option ? "text-white" : "text-primary"}`}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>
              <View className="gap-2">
                <Text className="font-sans-semibold text-primary">Icon</Text>
                <View className="flex-row flex-wrap gap-3">
                  {iconChoices.map((option) => (
                    <Pressable
                      key={option}
                      accessibilityLabel={`Use ${option} icon`}
                      accessibilityRole="button"
                      className={`h-14 w-14 items-center justify-center rounded-lg border ${iconKey === option ? "border-2 border-primary bg-muted" : "border-border bg-card"}`}
                      onPress={() => setIconKey(option)}
                    >
                      <Image className="h-8 w-8" source={icons[option]} />
                    </Pressable>
                  ))}
                </View>
              </View>
            </ScrollView>
            <View className="border-t border-border bg-background px-6 py-4">
              <Pressable
                accessibilityRole="button"
                className="rounded-lg bg-accent px-5 py-4 disabled:opacity-40"
                disabled={!isValid}
                onPress={handleCreate}
              >
                <Text className="text-center font-sans-bold text-white">
                  Create Subscription
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
