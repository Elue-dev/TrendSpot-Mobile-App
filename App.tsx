import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  View,
  LogBox,
  Platform,
  Alert as RNAlert,
} from "react-native";
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
import * as LocalAuthetication from "expo-local-authentication";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import AccessPrompt from "./src/components/access";
import { PushTokenProvider } from "./src/context/push_token/PushTokenContext";
import * as Linking from "expo-linking";

LogBox.ignoreAllLogs();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState<any>("");
  const [notification, setNotification] = useState<any>(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        RNAlert.alert(
          "Notifications blocked",
          "Notifications from TrendSpot currently blocked by you",
          [{ text: "GOT IT" }]
        );
        return;
      }
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants?.expoConfig?.extra?.eas.projectId,
      });
      setExpoPushToken(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function loadFonts() {
    try {
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
    } catch (error) {
      console.error("Error loading fonts:", error);
    }
  }

  // useEffect(() => {
  //   (async function authenticateUser() {
  //     const auth = await LocalAuthetication.authenticateAsync({
  //       promptMessage: "Authenticate to continue to TrendSpot",
  //       fallbackLabel: "Use Pin/Passcode",
  //     });
  //     setIsAuthenticated(auth.success);
  //   })();
  // }, []);

  function authenticateUser() {
    const auth = LocalAuthetication.authenticateAsync({
      promptMessage: "Authenticate to continue to TrendSpot",
      fallbackLabel: "Use Pin/Passcode",
    });
    auth.then((result) => {
      setIsAuthenticated(result.success);
    });
  }

  useEffect(() => {
    async function loadApp() {
      await loadFonts();
      SplashScreen.preventAutoHideAsync()
        .then(() => {
          if (fontLoaded) {
            SplashScreen.hideAsync();
          }
        })
        .catch((error) => {
          console.error("Error preventing auto hide:", error);
        });

      setIsAuthenticated(false);
    }

    loadApp();
  }, []);

  const queryClient = new QueryClient();

  const linking = {
    prefixes: ["impressionapp://"],
    config: {
      screens: {
        Main: "/",
        AccountInfo: "AccountInfo",
        CustomNewsDetails: "news/:slug/:newsId",
        AuthSequence: "AuthSequence",
        Notifications: "Notifications",
        ExploreScreen: "ExploreScreen",
      },
    },
    async getInitialURL() {
      const url = await Linking.getInitialURL();
      console.log("🚀 ~ file: App.tsx:180 ~ getInitialURL ~ url:", url);

      const response = await Notifications.getLastNotificationResponseAsync();
      console.log(
        "🚀 ~ file: App.tsx:186 ~ getInitialURL ~ response:",
        response?.notification.request.content.data
      );

      if (url != null) return url;

      return response?.notification.request.content.data.url;
    },
    subscribe(listener: any) {
      const onReceiveURL = ({ url }: { url: string }) => {
        console.log("Received URL:", url);
        listener(url);
      };
      const eventListenerSubscription = Linking.addEventListener(
        "url",
        onReceiveURL
      );

      const subscription =
        Notifications.addNotificationResponseReceivedListener((response) => {
          const url = response.notification.request.content.data.url;
          listener(url);
        });

      return () => {
        eventListenerSubscription.remove();
        subscription.remove();
      };
    },
  };

  return (
    <PushTokenProvider>
      {/* {isAuthenticated ? ( */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        {fontLoaded ? (
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <BottomSheetProvider>
                <ModalProvider>
                  <AlertProvider>
                    <NavigationContainer linking={linking}>
                      <RouteNavigator />
                      <CustomStatusBar
                        token={expoPushToken?.data ? expoPushToken?.data : null}
                      />
                      <Modal />
                      <Alert />
                    </NavigationContainer>
                  </AlertProvider>
                </ModalProvider>
              </BottomSheetProvider>
            </AuthProvider>
          </QueryClientProvider>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}
      </GestureHandlerRootView>
      {/* ) : (
        <>
          <AccessPrompt authenticateUser={authenticateUser} />
        </>
      )} */}
    </PushTokenProvider>
  );
}
