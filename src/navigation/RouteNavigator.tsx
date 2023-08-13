import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateAccountStart from "../screens/auth/create_account_start";
import OnboardingScreen from "../screens/onboarding";
import { RootStackParamList } from "../types/navigation";
import TabNavigator from "./TabNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { COLORS } from "../common/colors";
import AuthSequence from "../screens/auth_sequence";
import NewsDetails from "../screens/news/NewsDetails";
import SearchScreen from "../screens/search";
import ManageInterests from "../screens/profile/pages/ManageInterests";
import ContactSupport from "../screens/profile/pages/ContactSupport";
import TermsAndPrivacy from "../screens/profile/pages/TermsAndPrivacy";
import SavedScreen from "../screens/saved";
import { useSheet } from "../context/bottom_sheet/BottomSheetContext";
import AccountInfo from "../screens/profile/pages/AccountInfo";
import EditProfile from "../screens/profile/EditProfile";
import ForgotPassword from "../screens/auth/forgot_password";
import NewsComments from "../screens/news/NewsComments";

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
        name="NewsDetails"
        component={NewsDetails}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode
              ? COLORS.grayNeutralTheme
              : COLORS.grayNeutral,
          },
        }}
      />
      <RootStack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode
              ? COLORS.grayNeutralTheme
              : COLORS.grayNeutral,
          },
        }}
      />
      <RootStack.Screen
        name="AccountInfo"
        component={AccountInfo}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode
              ? COLORS.grayNeutralTheme
              : COLORS.grayNeutral,
          },
        }}
      />
      <RootStack.Screen
        name="ManageInterests"
        component={ManageInterests}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode
              ? COLORS.grayNeutralTheme
              : COLORS.grayNeutral,
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
            backgroundColor: isDarkMode
              ? COLORS.grayNeutralTheme
              : COLORS.grayNeutral,
          },
        }}
      />
      <RootStack.Screen
        name="Terms"
        component={TermsAndPrivacy}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode
              ? COLORS.grayNeutralTheme
              : COLORS.grayNeutral,
          },
        }}
      />
      <RootStack.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: isDarkMode ? "#C7C7CC" : "#270809",
          headerStyle: {
            backgroundColor: isDarkMode
              ? COLORS.grayNeutralTheme
              : COLORS.grayNeutral,
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
            backgroundColor: isDarkMode
              ? COLORS.grayNeutralTheme
              : COLORS.grayNeutral,
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
            backgroundColor: isDarkMode
              ? COLORS.grayNeutralTheme
              : COLORS.grayNeutral,
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
            backgroundColor: isDarkMode
              ? COLORS.grayNeutralTheme
              : COLORS.grayNeutral,
          },
        }}
      />
    </RootStack.Navigator>
  );
}
