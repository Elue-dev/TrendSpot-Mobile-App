import { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../types/navigation";
import { useSheet } from "../../../context/bottom_sheet/BottomSheetContext";
import CustomLeftHeader from "../../../helpers/CustomLeftHeader";
import { useAuth } from "../../../context/auth/AuthContext";
import { DEFAULT_AVATAR } from "../../../utils";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { COLORS } from "../../../common/colors";
import { TextInput } from "react-native";
import { httpRequest } from "../../../services";
import { useAlert } from "../../../context/alert/AlertContext";

export default function AccountInfo() {
  const [currentInput, setCurrentInput] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isDarkMode } = useSheet();
  const { showAlertAndContent } = useAlert();
  const {
    state: { user },
    removeActiveUser,
  } = useAuth();
  const authHeaders = { headers: { authorization: `Bearer ${user?.token}` } };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{ fontFamily: "rubikSB" }}
          className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]"
        >
          Account Information
        </Text>
      ),

      headerLeft: () =>
        isDarkMode && Platform.OS === "ios" ? <CustomLeftHeader /> : null,
    });
  }, [isDarkMode]);

  async function changeUserPassword() {
    if (!changeUserPassword || !newPassword || !passwordConfirm)
      return showAlertAndContent({
        type: "error",
        message: "Please provide all password credentials",
      });
    setLoading(true);
    const passwordCredetials = {
      oldPassword: currentPassword,
      newPassword,
      confirmNewPassword: passwordConfirm,
    };
    try {
      const response = await httpRequest.put(
        "/users/account/change-password",
        passwordCredetials,
        authHeaders
      );
      if (response) {
        removeActiveUser();
        navigation.navigate("AuthSequence", { state: "Sign In" });
        showAlertAndContent({
          type: "success",
          message: response.data.message + " .Please sign in again",
        });
        setCurrentPassword("");
        setNewPassword("");
        setPasswordConfirm("");
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      return showAlertAndContent({
        type: "error",
        message:
          error.response.data.message ||
          "Something went wrong, Please try again later",
      });
    }
  }

  return (
    <ScrollView
      className={`flex-1 bg-shadowWhite dark:bg-darkNeutral ${
        currentInput === "CurrentPassword"
          ? "-mt-40"
          : currentInput === "NewPassword"
          ? "-mt-52"
          : currentInput === "PasswordConfirm"
          ? "-mt-64"
          : ""
      }`}
      showsVerticalScrollIndicator={false}
    >
      <View className="mx-3">
        <View className="pt-6 mx-3 justify-center items-center">
          <Image
            source={{ uri: user?.avatar || DEFAULT_AVATAR }}
            className="h-28 w-28 rounded-full bg-primaryColorLighter"
          />
          <Text
            style={{ fontFamily: "rubikREG" }}
            className="pt-2 text-darkNeutral dark:text-lightText text-xl font-bold"
          >
            {user?.firstName} {user?.lastName}
          </Text>
        </View>

        <View className="pt-6">
          <View className="flex-row items-center justify-between pb-4">
            <Text
              style={{ fontFamily: "rubikSB" }}
              className="text-darkNeutral dark:text-gray-500 text-base font-bold "
            >
              INFORMATION
            </Text>

            <View>
              <TouchableOpacity
                className="flex-row items-center gap-2"
                onPress={() => {
                  navigation.navigate("EditProfile");
                }}
              >
                <Text
                  style={{ fontFamily: "rubikSB" }}
                  className="text-primaryColor dark:text-primaryColorTheme text-[15px]"
                >
                  Edit
                </Text>

                <AntDesign
                  name="edit"
                  size={15}
                  color={
                    isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor
                  }
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row justify-between items-center pb-2 border-b-[.2px] border-b-lightBorder dark:border-b-slate-200">
            <Text
              style={{ fontFamily: "rubikREG" }}
              className="text-darkNeutral dark:text-lightGray text-base"
            >
              First Name
            </Text>
            <Text className="text-darkNeutral dark:text-white text-base">
              {user?.firstName}
            </Text>
          </View>

          <View className="flex-row justify-between items-center pb-2 pt-5 border-b-[.2px] border-b-lightBorder dark:border-b-slate-200">
            <Text
              style={{ fontFamily: "rubikREG" }}
              className="text-darkNeutral dark:text-lightGray text-base"
            >
              Last Name
            </Text>
            <Text
              style={{ fontFamily: "rubikREG" }}
              className="text-darkNeutral dark:text-white text-base"
            >
              {user?.lastName}
            </Text>
          </View>

          <View className="flex-row justify-between items-center pb-2 pt-5 border-b-[.2px] border-b-lightBorder dark:border-b-slate-200">
            <Text
              style={{ fontFamily: "rubikREG" }}
              className="text-darkNeutral dark:text-lightGray text-base"
            >
              Email
            </Text>
            <Text
              style={{ fontFamily: "rubikREG" }}
              className="text-darkNeutral dark:text-white text-base"
            >
              {user?.email}
            </Text>
          </View>

          <View className="flex-row justify-between items-center pb-2 pt-5 border-b-[.2px] border-b-lightBorder dark:border-b-slate-200">
            <Text
              style={{ fontFamily: "rubikREG" }}
              className="text-darkNeutral dark:text-lightGray text-base"
            >
              Status
            </Text>

            <View className="flex-row items-center gap-1">
              {user?.isDeactivated ? (
                <Ionicons
                  name="lock-closed"
                  size={16}
                  color={isDarkMode ? "#e52828" : "#e81919"}
                />
              ) : (
                <MaterialCommunityIcons
                  name="lock-open-check"
                  size={18}
                  color="#228753"
                />
              )}

              <Text
                style={{ fontFamily: "rubikREG" }}
                className={`${
                  user?.isDeactivated ? "text-red-500" : "text-customGreen"
                } text-base`}
              >
                {user?.isDeactivated ? "Deactivated" : "Active"}
              </Text>
            </View>
          </View>
        </View>

        <View className="pt-14 pb-16">
          <View className="">
            <Text
              style={{ fontFamily: "rubikSB" }}
              className="text-darkNeutral dark:text-gray-500 text-base font-bold"
            >
              PASSWORD UPDATE
            </Text>

            <View className="mt-7">
              <Text
                style={{ fontFamily: "rubikREG" }}
                className={`absolute ${
                  currentInput === "CurrentPassword" || currentPassword
                    ? "bottom-5 text-[12px] mb-2 text-grayText dark:text-lightText"
                    : "bottom-2 text-[16px] text-grayText dark:text-lightText"
                }`}
              >
                Current Password
              </Text>
              <TextInput
                value={currentPassword}
                onChangeText={(val) => setCurrentPassword(val)}
                className="border-b-2 relative text-[16px] border-lightGray dark:border-lightBorder"
                onFocus={() => setCurrentInput("CurrentPassword")}
                onBlur={() => setCurrentInput("")}
                style={{ color: isDarkMode ? "#E5E5EA" : "#000" }}
              />
            </View>
            <View className="mt-9">
              <Text
                style={{ fontFamily: "rubikREG" }}
                className={`absolute ${
                  currentInput === "NewPassword" || newPassword
                    ? "bottom-5 text-[12px] mb-2 text-grayText dark:text-lightText"
                    : "bottom-2 text-[16px] text-grayText dark:text-lightText"
                }`}
              >
                New Password
              </Text>
              <TextInput
                value={newPassword}
                onChangeText={(val) => setNewPassword(val)}
                className="border-b-2 relative text-[16px] border-lightGray dark:border-lightBorder"
                onFocus={() => setCurrentInput("NewPassword")}
                onBlur={() => setCurrentInput("")}
                style={{ color: isDarkMode ? "#E5E5EA" : "#000" }}
              />
            </View>
            <View className="mt-9">
              <Text
                style={{ fontFamily: "rubikREG" }}
                className={`absolute ${
                  currentInput === "PasswordConfirm" || passwordConfirm
                    ? "bottom-5 text-[12px] mb-2 text-grayText dark:text-lightText"
                    : "bottom-2 text-[16px] text-grayText dark:text-lightText"
                }`}
              >
                Confirm Password
              </Text>
              <TextInput
                value={passwordConfirm}
                onChangeText={(val) => setPasswordConfirm(val)}
                className="border-b-2 relative text-[16px] border-lightGray dark:border-lightBorder"
                onFocus={() => setCurrentInput("PasswordConfirm")}
                onBlur={() => setCurrentInput("")}
                style={{ color: isDarkMode ? "#E5E5EA" : "#000" }}
              />
            </View>
          </View>

          <View className="mt-7">
            {loading ? (
              <TouchableOpacity className="bg-primaryColorLighter py-3 rounded-md">
                <ActivityIndicator color={"#fff"} size="small" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={changeUserPassword}
                className="bg-primaryColor dark:bg-primaryColorTheme py-3 rounded-md"
              >
                <Text
                  style={{ fontFamily: "rubikSB" }}
                  className="text-white font-semibold text-center text-xl"
                >
                  Change Password
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
