import {Preferences} from "@capacitor/preferences";

// Save auth token
export async function saveAuthToken(token: string) {
  await Preferences.set({
    key: 'authToken',
    value: token,
  });
}

// Get auth token
export async function getAuthToken(): Promise<string | null> {
  const { value } = await Preferences.get({ key: 'authToken' });
  return value;
}

// Remove auth token (logout)
export async function removeAuthToken() {
  await Preferences.remove({ key: 'authToken' });
}