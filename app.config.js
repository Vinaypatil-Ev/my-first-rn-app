// app.config.js — extends static app.json with dynamic values.
// PostHog keys are injected via the `extra` field and accessed at runtime
// through expo-constants (Constants.expoConfig?.extra).
// @see https://docs.expo.dev/versions/latest/sdk/constants/

/** @type {import('@expo/config').ExpoConfig} */
module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
  },
})
