import { useEffect, useState } from "react";
import { ActivityIndicator, View, LogBox } from "react-native";
import { BottomSheetProvider } from "./src/context/bottom_sheet/BottomSheetContext";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./src/context/auth/AuthContext";
import { ModalProvider } from "./src/context/modal/ModalCotext";
import { AlertProvider } from "./src/context/alert/AlertContext";
import RouteNavigator from "./src/navigation/RouteNavigator";
import CustomStatusBar from "./src/components/status_bar";
import Modal from "./src/components/modal/Modal";
import Alert from "./src/components/alert/Alert";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
// import * as Linking from "expo-linking";

LogBox.ignoreAllLogs();

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  async function loadFonts() {
    await Font.loadAsync({
      SSReg: require("./src/assets/fonts/SourceSans3-Regular.ttf"),
      SSBold: require("./src/assets/fonts/SourceSans3-Bold.ttf"),
      SSRSemiB: require("./src/assets/fonts/SourceSans3-SemiBold.ttf"),
      SSLight: require("./src/assets/fonts/SourceSans3-Light.ttf"),
      rubikB: require("./src/assets/fonts/Rubik-Bold.ttf"),
      rubikL: require("./src/assets/fonts/Rubik-Light.ttf"),
      rubikMD: require("./src/assets/fonts/Rubik-Medium.ttf"),
      rubikSB: require("./src/assets/fonts/Rubik-SemiBold.ttf"),
      rubikREG: require("./src/assets/fonts/Rubik-Regular.ttf"),
    });
    setFontLoaded(true);
  }

  useEffect(() => {
    loadFontsAndHideSplashScreen();
  }, []);

  const loadFontsAndHideSplashScreen = async () => {
    await loadFonts();
    await SplashScreen.preventAutoHideAsync();
    setFontLoaded(true);
    await SplashScreen.hideAsync();
  };

  const queryClient = new QueryClient();

  return (
    <GestureHandlerRootView className="flex-1">
      {fontLoaded ? (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BottomSheetProvider>
              <ModalProvider>
                <AlertProvider>
                  <NavigationContainer>
                    <RouteNavigator />
                    <CustomStatusBar />
                    <Modal />
                    <Alert />
                  </NavigationContainer>
                </AlertProvider>
              </ModalProvider>
            </BottomSheetProvider>
          </AuthProvider>
        </QueryClientProvider>
      ) : (
        <View className="pt-20">
          <ActivityIndicator color="#000" size="large" />
        </View>
      )}
    </GestureHandlerRootView>
  );
}
