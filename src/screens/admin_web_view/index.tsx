import { useLayoutEffect, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  Platform,
  View,
  StyleSheet,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { COLORS } from "../../common/colors";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";

export default function AdminView() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { isDarkMode } = useSheet();
  const webViewRef = useRef<any>();
  const WEB_URL = "https://trend-spot-admin.vercel.app";

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{ fontFamily: "rubikSB" }}
          className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]"
        >
          Admin Web App
        </Text>
      ),

      headerLeft: () =>
        Platform.OS === "ios" ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back-circle"
              size={29}
              color={COLORS.gray200}
            />
          </TouchableOpacity>
        ) : null,
    });
  }, [isDarkMode]);

  function webViewGoBack() {
    if (webViewRef.current) webViewRef.current.goBack();
  }

  function webViewNext() {
    if (webViewRef.current) webViewRef.current.goForward();
  }

  async function reloadWebView() {
    if (webViewRef.current) webViewRef.current.reload();
  }

  return (
    <View style={styles.main}>
      <WebView
        source={{ uri: WEB_URL }}
        style={{ flex: 1, backgroundColor: "#2A3447" }}
        ref={webViewRef}
      />

      <View style={styles.tabBarContainer}>
        <TouchableOpacity
          onPress={webViewGoBack}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="chevron-back-circle-outline"
            size={28}
            color="black"
          />
          <Text style={styles.tabText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            webViewRef.current.injectJavaScript(
              `
            window.location.href = '${WEB_URL}';
          `
            )
          }
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Feather name="home" size={24} color="black" />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={reloadWebView}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="reload" size={24} color="black" />
          <Text style={styles.tabText}>Reload</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={webViewNext}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="chevron-forward-circle-outline"
            size={28}
            color="black"
          />
          <Text style={styles.tabText}>Forward</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#fff",
  },
  wrapper: {
    flex: 1,
    marginTop: Platform.OS === "android" ? 35 : 1,
  },
  tabBarContainer: {
    height: Platform.OS === "ios" ? 26 : 30,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 10,
  },
  button: {
    fontSize: 24,
  },
  arrow: {
    color: "#ef4771",
  },
  icon: {
    width: 20,
    height: 20,
  },
  tabText: {
    textAlign: "center",
    color: "#111",
    fontWeight: "600",
    marginTop: 4,
  },
});
