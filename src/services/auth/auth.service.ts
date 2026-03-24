import "@react-native-firebase/app";
import "@react-native-firebase/auth";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from "@react-native-firebase/auth/lib/modular";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const GOOGLE_SIGNIN_CONFIG_ERROR =
  "Google Sign-In is misconfigured. Check Android package/SHA and EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.";

const DEFAULT_AUTH_ERROR = "Something went wrong. Please try again.";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/missing-email": "Email is required.",
  "auth/missing-password": "Password is required.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/email-already-in-use": "An account already exists with this email.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/too-many-requests":
    "Too many attempts. Please wait a bit and try again.",
  "auth/network-request-failed":
    "Network error. Please check your internet and try again.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/operation-not-allowed": "This sign-in method is not enabled.",
};

export const toUserFriendlyAuthError = (
  err: unknown,
  fallbackMessage = DEFAULT_AUTH_ERROR,
): string => {
  if (err && typeof err === "object" && "code" in err) {
    const code = String((err as { code?: string }).code);
    if (AUTH_ERROR_MESSAGES[code]) {
      return AUTH_ERROR_MESSAGES[code];
    }
  }

  if (err instanceof Error) {
    const message = err.message.trim();
    if (
      message.includes("Given String is empty or null") ||
      message.includes("auth/unknown")
    ) {
      return "Please enter both email and password.";
    }

    return message.length > 0 ? message : fallbackMessage;
  }

  return fallbackMessage;
};

export const subscribeToAuthState = (
  callback: (user: FirebaseAuthTypes.User | null) => void,
): (() => void) => {
  return onAuthStateChanged(getAuth(), callback);
};

export const loginWithEmail = async (
  email: string,
  password: string,
): Promise<FirebaseAuthTypes.User> => {
  const cleanEmail = email.trim();
  if (!cleanEmail || !password) {
    throw new Error("Please enter both email and password.");
  }

  const result = await signInWithEmailAndPassword(
    getAuth(),
    cleanEmail,
    password,
  );
  return result.user;
};

export const registerWithEmail = async (
  email: string,
  password: string,
): Promise<FirebaseAuthTypes.User> => {
  const cleanEmail = email.trim();
  if (!cleanEmail || !password) {
    throw new Error("Please enter both email and password.");
  }

  const result = await createUserWithEmailAndPassword(
    getAuth(),
    cleanEmail,
    password,
  );
  return result.user;
};

export const loginWithGoogle = async (): Promise<FirebaseAuthTypes.User> => {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  if (!webClientId) {
    throw new Error(
      "Google Sign-In is not configured. Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.",
    );
  }

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  let result;
  try {
    result = await GoogleSignin.signIn();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("DEVELOPER_ERROR")) {
      throw new Error(GOOGLE_SIGNIN_CONFIG_ERROR);
    }
    throw err;
  }

  if (result.type !== "success") {
    throw new Error("Google sign-in was cancelled.");
  }

  const idToken = result.data.idToken;
  if (!idToken) {
    throw new Error("Google sign-in failed: missing idToken.");
  }

  const credential = GoogleAuthProvider.credential(idToken);
  const userCredential = await signInWithCredential(getAuth(), credential);
  return userCredential.user;
};

export const logout = async (): Promise<void> => {
  try {
    await GoogleSignin.signOut();
    await GoogleSignin.revokeAccess();
  } catch {
    // Ignore if user is not signed in with Google.
  }
  await signOut(getAuth());
};
