import "@react-native-firebase/auth";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "@react-native-firebase/auth/lib/modular";

export const subscribeToAuthState = (callback: (user: FirebaseAuthTypes.User | null) => void): (() => void) => {
  return onAuthStateChanged(getAuth(), callback);
};

export const loginWithEmail = async (email: string, password: string): Promise<FirebaseAuthTypes.User> => {
  const result = await signInWithEmailAndPassword(getAuth(), email, password);
  return result.user;
};

export const registerWithEmail = async (email: string, password: string): Promise<FirebaseAuthTypes.User> => {
  const result = await createUserWithEmailAndPassword(getAuth(), email, password);
  return result.user;
};

export const loginWithGoogle = async (): Promise<FirebaseAuthTypes.User> => {
  throw new Error("Google Sign-In is not configured for native auth in this project yet.");
};

export const logout = async (): Promise<void> => {
  await signOut(getAuth());
};
