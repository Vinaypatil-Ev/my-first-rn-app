import { icons } from "@/constants/icons";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

type ProfileType = {
  userName: string;
  profileUri?: string;
  isSigningOut?: boolean;
  isLogoutVisible: boolean;
  onProfilePress: () => void;
  onLogoutPress: () => void;
};

const ProfileView = ({
  userName,
  profileUri,
  isSigningOut = false,
  isLogoutVisible,
  onProfilePress,
  onLogoutPress,
}: ProfileType) => {
  return (
    <View className="relative">
      <View className="flex-row gap-2 items-center">
        <Pressable
          accessibilityLabel="Account options"
          accessibilityRole="button"
          className="h-18 w-18 overflow-hidden rounded-full disabled:opacity-60"
          disabled={isSigningOut}
          onPress={onProfilePress}
        >
          {profileUri ? (
            <Image source={{ uri: profileUri }} className="h-full w-full" />
          ) : (
            <View className="h-full w-full bg-gray-200" />
          )}
          {isSigningOut && (
            <View className="absolute inset-0 items-center justify-center bg-black/30">
              <ActivityIndicator color="white" />
            </View>
          )}
        </Pressable>
        <Text className="grow ml-4 text-3xl font-sans-bold self-center text-primary">
          {userName}
        </Text>
        <Image
          className="flex-none size-14 border-2 border-gray-300 rounded-full p-3"
          source={icons.add}
        />
      </View>
      {isLogoutVisible && (
        <Pressable
          accessibilityRole="button"
          className="absolute left-0 top-20 z-10 rounded-lg border border-border bg-muted px-4 py-2"
          onPress={onLogoutPress}
        >
          <Text className="font-sans-semibold text-destructive">Log out</Text>
        </Pressable>
      )}
    </View>
  );
};

export default ProfileView;
