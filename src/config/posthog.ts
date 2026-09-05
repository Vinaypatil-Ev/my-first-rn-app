import Constants from "expo-constants";
import PostHog from "posthog-react-native";

// Configuration loaded from app.config.js extras via expo-constants.
// Environment variables are read at build time in app.config.js.
const projectToken = Constants.expoConfig?.extra?.posthogProjectToken as
  | string
  | undefined;
const host =
  (Constants.expoConfig?.extra?.posthogHost as string) ||
  "https://us.i.posthog.com";
const isPostHogConfigured =
  !!projectToken && projectToken !== "phc_your_project_token_here";

if (__DEV__ && !isPostHogConfigured) {
  console.warn(
    "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, " +
      "this causes events to be silently missed. " +
      "This error stops appearing once POSTHOG_PROJECT_TOKEN is configured.",
  );
}

/**
 * PostHog client instance.
 *
 * Loaded from app.config.js extras via expo-constants.
 * PostHog is disabled when no project token is set so the app keeps working.
 *
 * @see https://posthog.com/docs/libraries/react-native
 */
export const posthog = new PostHog(projectToken || "placeholder_key", {
  host,

  // Disable analytics when no project token is configured
  disabled: !isPostHogConfigured,

  // Keep the app operational until persistent storage is installed/configured.
  persistence: "memory",

  // Capture app lifecycle events (installed, updated, opened, backgrounded)
  captureAppLifecycleEvents: true,

  // Batching for battery efficiency
  flushAt: 20,
  flushInterval: 10000,
  maxBatchSize: 100,
  maxQueueSize: 1000,

  // Feature flags
  preloadFeatureFlags: true,
  sendFeatureFlagEvent: true,
  featureFlagsRequestTimeoutMs: 10000,

  // Network
  requestTimeout: 10000,
  fetchRetryCount: 3,
  fetchRetryDelay: 3000,
});

export const isPostHogEnabled = isPostHogConfigured;
