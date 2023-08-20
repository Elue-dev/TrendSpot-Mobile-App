import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useSheet } from "../../../context/bottom_sheet/BottomSheetContext";
import { TextInput } from "react-native-gesture-handler";
import { useAlert } from "../../../context/alert/AlertContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../common/colors";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | boolean>(false);
  const [email, setEmail] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const { isDarkMode } = useSheet();
  const { showAlertAndContent, closeAlert } = useAlert();
  const navigation = useNavigation<NavigationProp<any>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{ fontFamily: "rubikSB" }}
          className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]"
        >
          Forgot Password
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

  async function sendResetEmail() {}

  return (
    <View className="flex-1 bg-shadowWhite dark:bg-darkNeutral px-3">
      <View className="pt-10">
        <Text
          style={{ fontFamily: "rubikSB" }}
          className="text-darkNeutral dark:text-lightText text-2xl font-bold  mt-12"
        >
          Let's get you back!
        </Text>
        <Text
          style={{ fontFamily: "rubikREG" }}
          className="
              text-[18px] mt-3 tracking-wide leading-6 text-darkNeutral dark:text-lightText font-normal dark:font-light"
        >
          Enter the email associated with your account and recieve an email to
          reset your password.
        </Text>
        <View className="mt-10">
          <Text
            style={{ fontFamily: "rubikREG" }}
            className={`absolute ${
              inputFocused || email
                ? `bottom-5 text-[12px]  mb-2 ${
                    isDarkMode ? "text-lightText" : "text-grayText"
                  }`
                : `bottom-2 text-[16px] ${
                    isDarkMode ? "text-lightText" : "text-grayText"
                  }`
            }`}
          >
            Email Address
          </Text>
          <TextInput
            value={email}
            onChangeText={(newval) => setEmail(newval)}
            className={`border-b-2 relative text-[16px]  ${
              error
                ? "border-b-red-800"
                : "border-lightGray dark:border-lightBorder"
            }`}
            onTextInput={() => setError(false)}
            onFocus={() => {
              setInputFocused(true);
              setError(false);
            }}
            onBlur={() => setInputFocused(false)}
            style={{ color: isDarkMode ? "#E5E5EA" : "#000" }}
          />
        </View>
        {error === "Invalid" ? (
          <Text className="text-base text-primaryColor dark:text-primaryColorTheme">
            Please enter a valid email address
          </Text>
        ) : (
          error === "NotRegistered" && (
            <Text className="text-base text-primaryColor dark:text-primaryColorTheme">
              The email provided is not registered
            </Text>
          )
        )}

        <View className="mt-10">
          {loading ? (
            <TouchableOpacity className="bg-primaryColorLighter py-3 rounded-md">
              <ActivityIndicator color={"#fff"} size="small" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={sendResetEmail}
              className="py-3 rounded-md bg-primaryColor dark:bg-primaryColorTheme"
            >
              <Text
                style={{ fontFamily: "rubikSB" }}
                className="text-white font-semibold text-center text-xl"
              >
                Proceed
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
