import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { SplashScreen } from "expo-router";
import { useCallback, useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InitialLayout from "../components/initialLayout";
import ClerckAndConvexProvider from "../providers/ClerckAndConvexProvider";
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync("#000");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);
  return (
    <ClerckAndConvexProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#000" }}
        onLayout={onLayoutRootView}
      >
        <StatusBar backgroundColor={"black"} />
        <InitialLayout />
      </SafeAreaView>
    </ClerckAndConvexProvider>
  );
}
