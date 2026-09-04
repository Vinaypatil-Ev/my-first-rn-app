import SafeArea from "@/components/safeArea";
import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth0 } from "react-native-auth0";

type LoginStep = "email" | "password" | "link";

const LogIn = () => {
  const { authorize, loginWithPasswordRealm } = useAuth0();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<LoginStep>("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEmailContinue = () => {
    const email = userId.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    setErrorMessage(null);
    setStep(email.endsWith("@example.com") ? "link" : "password");
  };

  const handleGoBack = () => {
    setErrorMessage(null);
    setPassword("");
    setStep("email");
  };

  const handlePasswordLogin = async () => {
    if (!userId.trim() || !password) {
      setErrorMessage("Enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await loginWithPasswordRealm({
        username: userId.trim(),
        password,
        realm: "Username-Password-Authentication",
        scope: "openid profile email offline_access",
      });
    } catch {
      setErrorMessage("Unable to sign in. Check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSsoLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await authorize(
        { scope: "openid profile email offline_access" },
        { customScheme: "myfirstapp" },
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message !== "a0.session.user_cancelled"
      ) {
        setErrorMessage("Unable to sign in. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeArea>
      <View className="flex-1 justify-center bg-background px-6">
        <Text className="text-3xl font-sans-bold text-primary">
          Welcome back
        </Text>
        <Text className="mt-2 text-base text-gray-600">
          Sign in to manage your subscriptions.
        </Text>
        {step === "email" && (
          <>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              className="mt-8 rounded-lg border border-border bg-card px-4 py-4 font-sans-medium text-primary"
              keyboardType="email-address"
              onChangeText={setUserId}
              placeholder="Email address"
              placeholderTextColor="rgba(0, 0, 0, 0.45)"
              textContentType="emailAddress"
              value={userId}
            />
            <Pressable
              className="mt-5 items-center rounded bg-primary p-4"
              onPress={handleEmailContinue}
            >
              <Text className="font-sans-bold text-white">Continue</Text>
            </Pressable>
            <Pressable
              className="mt-3 items-center rounded border border-primary p-4 disabled:opacity-60"
              disabled={isSubmitting}
              onPress={handleSsoLogin}
            >
              <Text className="font-sans-bold text-primary">
                Continue with SSO
              </Text>
            </Pressable>
          </>
        )}
        {step === "password" && (
          <>
            <Text className="mt-8 font-sans-medium text-primary">
              {userId.trim()}
            </Text>
            <TextInput
              autoComplete="current-password"
              className="mt-3 rounded-lg border border-border bg-card px-4 py-4 font-sans-medium text-primary"
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="rgba(0, 0, 0, 0.45)"
              secureTextEntry
              textContentType="password"
              value={password}
            />
            <Pressable
              className="mt-5 items-center rounded bg-primary p-4 disabled:opacity-60"
              disabled={isSubmitting}
              onPress={handlePasswordLogin}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="font-sans-bold text-white">Log in</Text>
              )}
            </Pressable>
            <Pressable className="mt-3 items-center p-3" onPress={handleGoBack}>
              <Text className="font-sans-semibold text-primary">Go back</Text>
            </Pressable>
          </>
        )}
        {step === "link" && (
          <>
            <Text className="mt-8 text-base text-primary">
              You will receive a login link at {userId.trim()}.
            </Text>
            <Pressable className="mt-5 items-center p-3" onPress={handleGoBack}>
              <Text className="font-sans-semibold text-primary">Go back</Text>
            </Pressable>
          </>
        )}
        {errorMessage ? (
          <Text className="mt-4 text-center text-red-600">{errorMessage}</Text>
        ) : null}
        <Link className="mt-6 text-center text-primary" href="/signUp">
          Create an account
        </Link>
      </View>
    </SafeArea>
  );
};

export default LogIn;
