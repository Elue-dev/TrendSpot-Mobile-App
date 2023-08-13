import { useState } from "react";
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { RoutePropArg, TabStackParamList } from "../types/navigation";
import {
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome,
  Ionicons,
  Entypo,
} from "@expo/vector-icons";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import NewsScreen from "../screens/news";
import VerifyScreen from "../screens/verify";
import SearchScreen from "../screens/search";
import ProfileScreen from "../screens/profile";
import { COLORS } from "../common/colors";
import { useSheet } from "../context/bottom_sheet/BottomSheetContext";
import { useAuth } from "../context/auth/AuthContext";
import AddNews from "../screens/add_news";
// import AddNews from "../screens/add_news";

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
          case "News":
            return (
              <Ionicons
                name="newspaper-outline"
                size={size - 5}
                color={focused ? colorToUse : "#AEAEB2"}
                style={styles.tabBarIcon}
              />
            );
          case "Verify":
            return (
              <MaterialCommunityIcons
                name="newspaper-check"
                size={size}
                color={focused ? colorToUse : "#AEAEB2"}
                style={styles.tabBarIconSec}
              />
            );
          case "Search":
            return (
              <AntDesign
                name="search1"
                size={size}
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

          case "Profile":
            return (
              <FontAwesome
                name="user-o"
                size={size - 10}
                color={focused ? colorToUse : "#AEAEB2"}
                style={styles.tabBarIcon}
              />
            );
          case "More":
            return (
              <Entypo
                name="dots-three-vertical"
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
          ? COLORS.grayNeutralTheme
          : COLORS.grayNeutral,
      },
      tabBarStyle: {
        display: state.bottomSheetOpen ? "none" : "flex",
        borderTopWidth: isDarkMode ? 0 : 0.8,
        borderColor: "#d8d8d8",
        backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
      },
    };
  }

  return (
    <TabStack.Navigator
      screenOptions={screenOptions}
      screenListeners={({ route }) => ({
        tabPress: () => {
          setCurrRoute(route.name);
        },
      })}
    >
      <TabStack.Screen
        name="News"
        component={NewsScreen}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          tabBarItemStyle:
            currrRoute === "News"
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
        name="Verify"
        component={VerifyScreen}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          tabBarItemStyle:
            currrRoute === "Verify"
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
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          tabBarItemStyle:
            currrRoute === "Search"
              ? {
                  borderTopWidth: 2,
                  borderColor: isDarkMode
                    ? COLORS.primaryColorTheme
                    : COLORS.primaryColor,
                }
              : {},
        }}
      />

      {user ? (
        <TabStack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            tabBarItemStyle:
              currrRoute === "Profile"
                ? {
                    borderTopWidth: 2,
                    borderColor: isDarkMode
                      ? COLORS.primaryColorTheme
                      : COLORS.primaryColor,
                  }
                : {},
          }}
        />
      ) : (
        <TabStack.Screen
          name="More"
          component={ProfileScreen}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            tabBarItemStyle:
              currrRoute === "More"
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
  },
  tabBarIconFocused: {
    borderTopWidth: 1,
    borderColor: "red",
  },
});
