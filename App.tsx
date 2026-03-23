import "react-native-gesture-handler";
import "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { RootNavigator } from "@routes";
import React from "react";

export default function App() {
  return (
    <React.Fragment>
      <StatusBar style="dark" />
      <RootNavigator />
    </React.Fragment>
  );
}
