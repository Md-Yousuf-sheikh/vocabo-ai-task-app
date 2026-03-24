import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

export const subscribeToAuthState = (callback: (user: FirebaseAuthTypes.User | null) => void): (() => void) => {
  return auth().onAuthStateChanged(callback);
};

export const loginWithEmail = async (email: string, password: string): Promise<FirebaseAuthTypes.User> => {
  const result = await auth().signInWithEmailAndPassword(email, password);
  return result.user;
};

export const registerWithEmail = async (email: string, password: string): Promise<FirebaseAuthTypes.User> => {
  const result = await auth().createUserWithEmailAndPassword(email, password);
  return result.user;
};

export const loginWithGoogle = async (): Promise<FirebaseAuthTypes.User> => {
  throw new Error("Google Sign-In is not configured for native auth in this project yet.");
};

export const logout = async (): Promise<void> => {
  await auth().signOut();
};
