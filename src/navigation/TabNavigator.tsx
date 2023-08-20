import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { RoutePropArg, TabStackParamList } from "../types/navigation";
import {
  FontAwesome,
  Fontisto,
  Ionicons,
  Entypo,
  FontAwesome5,
} from "@expo/vector-icons";
import { Platform, StyleSheet } from "react-native";
import HomeScreen from "../screens/home";
import SettingsScreen from "../screens/settings_screens";
import { COLORS } from "../common/colors";
import { useSheet } from "../context/bottom_sheet/BottomSheetContext";
import { useAuth } from "../context/auth/AuthContext";
import AddNews from "../screens/add_news";
import ExploreScreen from "../screens/explore";

const TabStack = createBottomTabNavigator<TabStackParamList>();

export default function TabsNavigator() {
  const { state, isDarkMode } = useSheet();
  const {
    state: { user },
    currrRoute,
    setCurrRoute,
  } = useAuth();

  function screenOptions({ route }: RoutePropArg): BottomTabNavigationOptions {
    const colorToUse = isDarkMode ? "#CE5158" : "#C2262E";

    return {
      tabBarIcon: ({ focused, size }) => {
        switch (route.name) {
          case "Home":
            return (
              <Ionicons
                name="home-outline"
                size={size}
                color={focused ? colorToUse : "#AEAEB2"}
                style={styles.tabBarIcon}
              />
            );

          case "Explore":
            return (
              <FontAwesome5
                name="wpexplorer"
                size={size + 10}
                color={focused ? colorToUse : "#AEAEB2"}
                style={styles.tabBarIcon}
              />
            );

          case "AddNews":
            return (
              <Entypo
                name="add-to-list"
                size={size + 2}
                color={focused ? colorToUse : "#AEAEB2"}
                style={styles.tabBarIconSec}
              />
            );

          case "Settings":
            return (
              <Ionicons
                name="ios-settings-outline"
                size={size}
                color={focused ? colorToUse : "#AEAEB2"}
                style={styles.tabBarIcon}
              />
            );
          default:
            return null;
        }
      },
      tabBarActiveTintColor: colorToUse,
      tabBarInactiveTintColor: "#AEAEB2",
      tabBarShowLabel: true,
      tabBarLabelStyle: styles.label,
      headerStyle: {
        backgroundColor: isDarkMode
          ? "rgba(31, 31, 31, 0.99)"
          : COLORS.shadowWhite,
      },
      tabBarStyle: {
        display: state.bottomSheetOpen ? "none" : "flex",
        borderTopWidth: isDarkMode ? 0 : 0.8,
        borderColor: "#000",
        backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#f7f7f7",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
      },
    };
  }

  return (
    <TabStack.Navigator
      initialRouteName={"Home"}
      screenOptions={screenOptions}
      screenListeners={({ route }) => ({
        tabPress: () => {
          setCurrRoute(route.name);
        },
      })}
    >
      <TabStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          tabBarItemStyle:
            currrRoute === "Home"
              ? {
                  borderTopWidth: 2,
                  borderColor: isDarkMode
                    ? COLORS.primaryColorTheme
                    : COLORS.primaryColor,
                }
              : {},
        }}
      />

      <TabStack.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          tabBarItemStyle:
            currrRoute === "Explore"
              ? {
                  borderTopWidth: 2,
                  borderColor: isDarkMode
                    ? COLORS.primaryColorTheme
                    : COLORS.primaryColor,
                }
              : {},
        }}
      />

      {user && (
        <TabStack.Screen
          name="AddNews"
          component={AddNews}
          options={{
            headerShown: user ? true : false,
            tabBarLabel: "Add News",
            headerTitleAlign: "center",
            tabBarItemStyle:
              currrRoute === "AddNews"
                ? {
                    borderTopWidth: 2,
                    borderColor: isDarkMode
                      ? COLORS.primaryColorTheme
                      : COLORS.primaryColor,
                  }
                : {},
          }}
        />
      )}

      <TabStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          tabBarItemStyle:
            currrRoute === "Settings"
              ? {
                  borderTopWidth: 2,
                  borderColor: isDarkMode
                    ? COLORS.primaryColorTheme
                    : COLORS.primaryColor,
                }
              : {},
        }}
      />
    </TabStack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarIcon: {
    fontSize: 22,
    paddingTop: Platform.OS === "ios" ? 5 : 3,
  },
  tabBarIconSec: {
    paddingTop: Platform.OS === "ios" ? 2 : 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "rubikSB",
  },
  tabBarIconFocused: {
    borderTopWidth: 1,
    borderColor: "red",
  },
});
