import "react-native-gesture-handler";
import "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { RootNavigator } from "@routes";
import React, { useCallback, useEffect, useState } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";

void SplashScreen.preventAutoHideAsync();

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "",
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? "",
});

export default function App() {
  const [isBootstrapReady, setIsBootstrapReady] = useState(false);

  const handleBootstrapReady = useCallback(() => {
    setIsBootstrapReady(true);
  }, []);

  useEffect(() => {
    if (!isBootstrapReady) return;
    void SplashScreen.hideAsync();
  }, [isBootstrapReady]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <RootNavigator onBootstrapReady={handleBootstrapReady} />
    </View>
  );
}
