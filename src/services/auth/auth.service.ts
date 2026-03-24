import "@react-native-firebase/auth";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signInWithEmailAndPassword, signOut } from "@react-native-firebase/auth/lib/modular";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

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
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const result = await GoogleSignin.signIn();
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
  await signOut(getAuth());
};
