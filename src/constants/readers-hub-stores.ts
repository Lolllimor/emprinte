/**
 * Readers Hub mobile app store links (thank-you page, etc.).
 *
 * - Play: defaults to the Android package used in emprinte-readers-hub.
 * - App Store: set NEXT_PUBLIC_READERS_HUB_APP_STORE_URL to your App Store product URL
 *   (e.g. https://apps.apple.com/app/emprinte-readers-hub/idXXXXXXXX) when the app is live.
 */
const DEFAULT_PLAY =
  'https://play.google.com/store/apps/details?id=com.emprinte.readershub';

export function readersHubPlayStoreUrl(): string {
  return (
    process.env.NEXT_PUBLIC_READERS_HUB_PLAY_STORE_URL?.trim() || DEFAULT_PLAY
  ).replace(/\/$/, '');
}

/** Returns null if unset — thank-you page shows App Store only when configured. */
export function readersHubAppStoreUrl(): string | null {
  const u = process.env.NEXT_PUBLIC_READERS_HUB_APP_STORE_URL?.trim();
  return u ? u.replace(/\/$/, '') : null;
}
