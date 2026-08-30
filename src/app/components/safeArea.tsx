import { styled } from "nativewind";
import React from "react";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);
const SafeArea = ({ children }: { children?: React.ReactNode }) => {
  return (
    <SafeAreaView className="flex-1 bg-background p-4">{children}</SafeAreaView>
  );
};

export default SafeArea;
