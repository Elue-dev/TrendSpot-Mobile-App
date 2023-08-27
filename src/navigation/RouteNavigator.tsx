import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateAccountStart from "../screens/auth/create_account_start";
import OnboardingScreen from "../screens/onboarding";
import { RootStackParamList } from "../types/navigation";
import TabNavigator from "./TabNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform } from "react-native";
import { COLORS } from "../common/colors";
import AuthSequence from "../screens/auth_sequence";
import ContactSupport from "../screens/settings_screens/pages/ContactSupport";
import TermsAndPrivacy from "../screens/settings_screens/pages/TermsAndPrivacy";
import SavedScreen from "../screens/saved";
import { useSheet } from "../context/bottom_sheet/BottomSheetContext";
import AccountInfo from "../screens/settings_screens/pages/AccountInfo";
import EditProfile from "../screens/settings_screens/EditProfile";
import ForgotPassword from "../screens/auth/forgot_password";
import NewsComments from "../screens/news/NewsComments";
import ExternalNewsDetails from "../screens/news/ExternalNewsDetails";
import CustomNewsDetails from "../screens/news/CustomNewsDetails";
import MoreExternalNews from "../screens/news/MoreExternalNews";
import MoreCustomNews from "../screens/news/MoreCustomNews";
import ExploreCustomNews from "../screens/explore/ExploreCustomNews";
import ExploreExternalNews from "../screens/explore/ExploreExternalNews";
import ProfileScreen from "../screens/settings_screens";
import Bookmarks from "../screens/bookmarks";
import NewsLikes from "../screens/news/NewsLikes";
import Search from "../screens/search";
import Categories from "../screens/categories";
import Activities from "../screens/activities";

const RootStack = createNativeStackNavigator<RootStackParamList>();

async function checkOnboardingStatus() {
  const previousOnboardingCheck = await AsyncStorage.getItem(
    "userHasOnboarded"
  );
  return previousOnboardingCheck === "true";
}

export default function RouteNavigator() {
  const [userHasOnboarded, setUserHasOnboarded] = useState(false);
  const [isOnboardingCheckComplete, setIsOnboardingCheckComplete] =
    useState(false);
  const { isDarkMode } = useSheet();

  useEffect(() => {
    async function getOnboardingCheckResults() {
      const hasOnboarded = await checkOnboardingStatus();
      setUserHasOnboarded(hasOnboarded);
      setIsOnboardingCheckComplete(true);
    }

    getOnboardingCheckResults();
  }, []);

  if (!isOnboardingCheckComplete)
    return (
      <ActivityIndicator
        color={COLORS.primaryColor}
        size="large"
        className="pt-20"
      />
    );

  return (
    <RootStack.Navigator
      initialRouteName={userHasOnboarded ? "TabStack" : "Onboarding"}
    >
      <RootStack.Screen
        name="TabStack"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
        }}
      />
      <RootStack.Screen
        name="CreateAccountStart"
        component={CreateAccountStart}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
        }}
      />
      <RootStack.Screen
        name="AuthSequence"
        component={AuthSequence}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
        }}
      />
      <RootStack.Screen
        name="ExternalNewsDetails"
        component={ExternalNewsDetails}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          presentation: "containedModal",
          headerBackTitleVisible: false,
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
          },
        }}
      />
      <RootStack.Screen
        name="CustomNewsDetails"
        component={CustomNewsDetails}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
          },
        }}
      />

      <RootStack.Screen
        name="AccountInfo"
        component={AccountInfo}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
          },
        }}
      />

      <RootStack.Screen
        name="ContactSupport"
        component={ContactSupport}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
          },
        }}
      />
      <RootStack.Screen
        name="Terms"
        component={TermsAndPrivacy}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
          },
        }}
      />
      <RootStack.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
          },
        }}
      />

      <RootStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
          },
        }}
      />
      <RootStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          presentation: "modal",
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
          },
        }}
      />
      <RootStack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          presentation: "modal",
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
          },
        }}
      />

      <RootStack.Screen
        name="NewsComments"
        component={NewsComments}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          presentation: "modal",
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
          },
        }}
      />
      <RootStack.Screen
        name="MoreExternalNews"
        component={MoreExternalNews}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
          },
        }}
      />
      <RootStack.Screen
        name="MoreCustomNews"
        component={MoreCustomNews}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
          },
        }}
      />

      <RootStack.Screen
        name="ExploreCustomNews"
        component={ExploreCustomNews}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
          },
        }}
      />

      <RootStack.Screen
        name="ExploreExternalNews"
        component={ExploreExternalNews}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
          },
        }}
      />
      <RootStack.Screen
        name="Bookmarks"
        component={Bookmarks}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
          },
        }}
      />
      <RootStack.Screen
        name="NewsLikes"
        component={NewsLikes}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          presentation: "formSheet",
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
          },
        }}
      />
      <RootStack.Screen
        name="Search"
        component={Search}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
          },
        }}
      />
      <RootStack.Screen
        name="Categories"
        component={Categories}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
          },
        }}
      />
      <RootStack.Screen
        name="Activities"
        component={Activities}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode ? "rgba(31, 31, 31, 0.99)" : "#FFF",
          },
        }}
      />
    </RootStack.Navigator>
  );
}
