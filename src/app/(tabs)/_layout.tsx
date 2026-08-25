import { Tabs } from "expo-router";

const TabLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen
        name="subscription/[id]"
        options={{ title: "Subscriptions" }}
      />
      <Tabs.Screen name="pricing" options={{ title: "Price" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
};

export default TabLayout;
