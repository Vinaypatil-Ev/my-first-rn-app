import { tabs } from "@/constants/data";
import { theme } from "@/constants/theme";
import clsx from "clsx";
import { Tabs } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabIcon = ({ focused, icon }: TabIconProps) => {
  return (
    <View className="tabs-icon" style={styles.iconFrame}>
      <View
        className={clsx("tabs-pill", focused && "tabs-active")}
        style={[styles.pill, focused && styles.pillFocused]}
      >
        <Image source={icon} resizeMode="contain" style={styles.glyph} />
      </View>
    </View>
  );
};

const TabLayout = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(
            insets.bottom,
            theme.components.tabBar.horizontalInset,
          ),
          height: theme.components.tabBar.height,
          marginHorizontal: theme.components.tabBar.horizontalInset,
          borderRadius: theme.components.tabBar.radius,
          backgroundColor: theme.colors.primary,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: theme.components.tabBar.itemPaddingVertical,
        },
        tabBarIconStyle: {
          width: theme.components.tabBar.iconFrame,
          height: theme.components.tabBar.iconFrame,
          alignItems: "center",
          // backgroundColor: theme.colors.accent,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tab.icon} />
            ),
          }}
        />
      ))}
      {/* <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen
        name="subscription/[id]"
        options={{ title: "Subscriptions" }}
      />
      <Tabs.Screen name="pricing" options={{ title: "Price" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} /> */}
    </Tabs>
  );
};

export default TabLayout;

const styles = StyleSheet.create({
  iconFrame: {
    width: theme.components.tabBar.iconFrame,
    height: theme.components.tabBar.iconFrame,
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  glyph: {
    width: theme.spacing[6],
    height: theme.spacing[6],
  },
  pill: {
    width: theme.components.tabBar.iconFrame,
    height: theme.components.tabBar.iconFrame,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.components.tabBar.iconFrame / 2,
  },
  pillFocused: {
    backgroundColor: theme.colors.accent,
  },
});
