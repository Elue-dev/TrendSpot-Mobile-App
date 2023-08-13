import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { BottomSheetProvider } from "./src/context/bottom_sheet/BottomSheetContext";
import * as Font from "expo-font";
import {
  DefaultTheme,
  NavigationContainer,
  Theme,
} from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./src/context/auth/AuthContext";
import { ModalProvider } from "./src/context/modal/ModalCotext";
import { AlertProvider } from "./src/context/alert/AlertContext";
import RouteNavigator from "./src/navigation/RouteNavigator";
import CustomStatusBar from "./src/components/status_bar";
import Modal from "./src/components/modal/Modal";
import Alert from "./src/components/alert/Alert";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    loadFonts();
  }, []);

  const loadFonts = async () => {
    await Font.loadAsync({
      "source-sans-regular": require("./src/assets/fonts/SourceSans3-Regular.ttf"),
    });
    setFontLoaded(true);
  };

  const theme: Theme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: "#f5f5f5",
        text: "#191919",
        border: "#D9D9D9",
        primary: "#191919",
      },
    }),
    []
  );

  const queryClient = new QueryClient();

  return (
    <GestureHandlerRootView className="flex-1">
      {fontLoaded ? (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BottomSheetProvider>
              <ModalProvider>
                <AlertProvider>
                  <NavigationContainer theme={theme}>
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
