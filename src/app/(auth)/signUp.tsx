import SafeArea from "@/components/safeArea";
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { usePostHog } from "posthog-react-native";

const SignUp = () => {
  const { authorize } = useAuth0();
  const posthog = usePostHog();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignUp = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await authorize(
        {
          scope: "openid profile email offline_access",
          additionalParameters: { screen_hint: "signup" },
        },
        { customScheme: "myfirstapp" },
      );
      posthog.capture('user_signed_up', { signup_method: 'auth0' })
    } catch (error) {
      if (
        error instanceof Error &&
        error.message !== "a0.session.user_cancelled"
      ) {
        setErrorMessage("Unable to create your account. Please try again.");
        posthog.captureException(error instanceof Error ? error : new Error('Signup failed'), {
          signup_method: 'auth0',
        })
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeArea>
      <View className="flex-1 justify-center bg-background px-6">
        <Text className="text-3xl font-sans-bold text-primary">
          Create account
        </Text>
        <Text className="mt-2 text-base text-gray-600">
          Start tracking your subscriptions in one place.
        </Text>
        <Pressable
          className="mt-8 items-center rounded bg-primary p-4 disabled:opacity-60"
          disabled={isSubmitting}
          onPress={handleSignUp}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-sans-bold text-white">Create account</Text>
          )}
        </Pressable>
        {errorMessage ? (
          <Text className="mt-4 text-center text-red-600">{errorMessage}</Text>
        ) : null}
        <Link className="mt-6 text-center text-primary" href="/logIn">
          Already have an account? Log in
        </Link>
      </View>
    </SafeArea>
  );
};

export default SignUp;
