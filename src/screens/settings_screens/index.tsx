import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Pressable,
  ScrollView,
} from "react-native";
import { useLayoutEffect, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
  AntDesign,
  FontAwesome,
} from "@expo/vector-icons";
import { COLORS } from "../../common/colors";
import { profileData } from "./data";
import { useAuth } from "../../context/auth/AuthContext";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { styles } from "./pages/styles";
import { useAlert } from "../../context/alert/AlertContext";
import { useModal } from "../../context/modal/ModalCotext";

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  const {
    state: { user },
    removeActiveUser,
    setCurrRoute,
  } = useAuth();
  const { isDarkMode, toggleTheme } = useSheet();
  const { showAlertAndContent } = useAlert();
  const { showModalAndContent } = useModal();
  const [isEnabled, setIsEnabled] = useState(isDarkMode);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{ fontFamily: "rubikMD" }}
          className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]"
        >
          Settings
        </Text>
      ),
    });
  }, [isDarkMode]);

  const unprotectedProfileData = profileData.filter(
    (data) => data.isProtected === false
  );

  const profileDataToUse = user ? profileData : unprotectedProfileData;

  function toggleSwitch() {
    setIsEnabled(!isEnabled);
    toggleTheme();
  }

  function renderIcon(currentRoute: string) {
    switch (currentRoute) {
      case "Terms and Privacy Policy":
        return (
          <Feather
            name="shield"
            size={28}
            color={isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor}
          />
        );
      case "Bookmarks":
        return (
          <Feather
            name="bookmark"
            size={28}
            color={isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor}
          />
        );
      case "Likes":
        return (
          <AntDesign
            name="like2"
            size={28}
            color={isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor}
          />
        );
      case "Become Author":
        return (
          <FontAwesome
            name="pencil-square-o"
            size={26}
            color={isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor}
          />
        );
      default:
        return null;
    }
  }

  function handleProfileNavigation(title: string) {
    switch (title) {
      case "Contact Support":
        navigation.navigate("ContactSupport");
        break;
      case "Terms and Privacy Policy":
        navigation.navigate("Terms", { defaultTitle: "Terms Of Use" });
        break;
      case "Bookmarks":
        navigation.navigate("Bookmarks");
        break;
      case "Likes":
        navigation.navigate("UserLikes");
        break;
      default:
        return null;
    }
  }

  async function deactivateAccount() {
    showModalAndContent({
      title: "Account Deativation",
      message:
        "You are about to deactivate your account. You would no longer be able to comment on any news, like or save any news. Are you sure you want to proceed? You can change this settings later in your profile",
      actionBtnText: "DEACTIVATE",
      action: "Deactivate",
    });
  }

  async function reactivateAccount() {
    showModalAndContent({
      title: "Account Reactivation",
      message:
        "You are about to reactivate your account. You would now be able to comment to news, share or save news. You can change this settings later in your profile",
      actionBtnText: "REACTIVATE",
      action: "Reactivate",
    });
  }

  async function requestToBecomeAuthor() {
    showModalAndContent({
      title: "Become An Author",
      message:
        "If your request is accepted, you will have write access on the platform.",
      actionBtnText: "PROCEED",
      action: "BecomeAuthor",
    });
  }

  async function logOutUser() {
    try {
      removeActiveUser();
      navigation.navigate("TabStack", { screen: "Home" });
      setCurrRoute("Home");
    } catch (error: any) {
      console.log(error);
      showAlertAndContent({
        type: "error",
        message: "Something went wrong. Please try again",
      });
    }
  }

  return (
    <ScrollView className="flex-1 bg-shadowWhite dark:bg-darkNeutral">
      <View className="pt-10 mx-3 pb-20">
        <Pressable
          className={`flex-row justify-between items-center border-lightText dark:border-b-lightBorder border-b shadow-sm rounded-tl-lg rounded-tr-lg bg-white dark:bg-darkCard p-2`}
        >
          <View className="flex-row items-center gap-3">
            <View>
              <MaterialCommunityIcons
                name="theme-light-dark"
                size={30}
                color={
                  isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor
                }
              />
            </View>
            <View>
              <Text
                className={`${
                  isDarkMode ? "text-gray100" : "text-primaryColorSec"
                }  text-[17px] mt-4 font-semibold`}
              >
                Theme
              </Text>
              <Text
                className={`${
                  isDarkMode
                    ? "text-lightText font-light"
                    : "text-gray200 font-normal"
                } pt-1 text-[14px] `}
              >
                Switch between Light and Dark Theme
              </Text>
            </View>
          </View>

          <Switch
            trackColor={{
              false: "#767577",
              true: COLORS.primaryColorTheme,
            }}
            thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onChange={toggleSwitch}
            value={isEnabled}
            style={styles.switch}
          />
        </Pressable>

        {profileDataToUse.map((data) => (
          <TouchableOpacity
            key={data.title}
            onPress={() => handleProfileNavigation(data.title)}
            className={`${
              isDarkMode ? "border-b-lightBorder" : "border-lightText"
            } flex-row justify-between items-center pb-5  border-b shadow-sm bg-white dark:bg-darkCard p-2`}
          >
            <View className="flex-row items-center gap-3">
              <View>{renderIcon(data.title)}</View>
              <View>
                <Text
                  style={{ fontFamily: "rubikMD" }}
                  className={`${
                    isDarkMode ? "text-gray100" : "text-primaryColorSec"
                  }  text-[17px] mt-4 font-semibold`}
                >
                  {data.title}
                </Text>
                <Text
                  className={`${
                    isDarkMode
                      ? "text-lightText font-light"
                      : "text-gray200 font-normal"
                  } pt-1 text-[14px]`}
                >
                  {data.description}
                </Text>
              </View>
            </View>
            <View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={32}
                color={isDarkMode ? COLORS.gray100 : COLORS.primaryColorSec}
              />
            </View>
          </TouchableOpacity>
        ))}

        {user && (
          <TouchableOpacity
            onPress={
              user?.isDeactivated ? reactivateAccount : deactivateAccount
            }
            className={`flex-row justify-between items-center pb-5 border-lightText dark:border-b-lightBorder border-b shadow-sm bg-white dark:bg-darkCard p-2`}
          >
            <View className="flex-row items-center gap-3">
              <View>
                {user.isDeactivated ? (
                  <MaterialCommunityIcons
                    name="account-lock-open-outline"
                    size={32}
                    color={COLORS.primaryColorTheme}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="account-lock-outline"
                    size={32}
                    color={COLORS.primaryColorTheme}
                  />
                )}
              </View>
              <View>
                <Text
                  style={{ fontFamily: "rubikMD" }}
                  className="text-[17px] mt-4 font-semibold text-primaryColorSec dark:text-gray100"
                >
                  {user?.isDeactivated
                    ? "Account Reactivation"
                    : "Account Deactivation"}
                </Text>
                <Text className="text-gray200 text-[14px] font-normal dark:text-lightText dark:font-light pt-1">
                  {user?.isDeactivated
                    ? "Reactivate your account here"
                    : "Deactivate your account here"}
                </Text>
              </View>
            </View>

            <MaterialIcons
              name="keyboard-arrow-right"
              size={32}
              color={isDarkMode ? COLORS.gray100 : COLORS.primaryColorSec}
            />
          </TouchableOpacity>
        )}

        {user && !user.isAuthor && !user.isAdmin && (
          <TouchableOpacity
            onPress={requestToBecomeAuthor}
            className={`${
              isDarkMode ? "border-b-lightBorder" : "border-lightText"
            } flex-row justify-between items-center pb-5  border-b shadow-sm bg-white dark:bg-darkCard p-2`}
          >
            <View className="flex-row items-center gap-3">
              <View>{renderIcon("Become Author")}</View>
              <View>
                <Text
                  style={{ fontFamily: "rubikMD" }}
                  className={`${
                    isDarkMode ? "text-gray100" : "text-primaryColorSec"
                  }  text-[17px] mt-4 font-semibold`}
                >
                  Become An Author
                </Text>
                <Text
                  className={`${
                    isDarkMode
                      ? "text-lightText font-light"
                      : "text-gray200 font-normal"
                  } pt-1 text-[14px]`}
                >
                  Gain write access on TrendSpot
                </Text>
              </View>
            </View>
            <View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={32}
                color={isDarkMode ? COLORS.gray100 : COLORS.primaryColorSec}
              />
            </View>
          </TouchableOpacity>
        )}

        {user ? (
          <TouchableOpacity onPress={logOutUser}>
            <View className="flex-row justify-between items-center pb-5 shadow-sm bg-white dark:bg-darkCard p-2 rounded-bl-lg rounded-br-lg">
              <View className="flex-row items-center gap-3">
                <View>
                  <MaterialCommunityIcons
                    name="account-convert-outline"
                    size={30}
                    color={
                      isDarkMode
                        ? COLORS.primaryColorTheme
                        : COLORS.primaryColor
                    }
                  />
                </View>
                <View>
                  <Text
                    style={{ fontFamily: "rubikMD" }}
                    className="text-primaryColorSec dark:text-gray100 text-[17px] mt-4 font-semibold"
                  >
                    Log Out
                  </Text>
                  <Text className="text-gray200 text-[14px] font-normal dark:text-lightText dark:font-light pt-1">
                    Log out of your account
                  </Text>
                </View>
              </View>

              <MaterialIcons
                name="keyboard-arrow-right"
                size={32}
                color={isDarkMode ? COLORS.gray100 : COLORS.primaryColorSec}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("AuthSequence", { state: "Sign Up" })
              }
              className="flex-row justify-between items-center pb-5 shadow-sm rounded-bl-lg rounded-br-lg bg-white dark:bg-darkCard  mb-1 p-2"
            >
              <View className="flex-row items-center gap-2">
                <View>
                  <MaterialCommunityIcons
                    name="account-convert-outline"
                    size={30}
                    color={
                      isDarkMode
                        ? COLORS.primaryColorTheme
                        : COLORS.primaryColor
                    }
                  />
                </View>
                <View>
                  <Text
                    style={{ fontFamily: "rubikMD" }}
                    className="text-primaryColorSec dark:text-gray100 text-[17px] mt-4 font-semibold"
                  >
                    Sign Up / Sign In
                  </Text>
                  <Text className="text-gray200 text-[14px] font-normal dark:text-lightText dark:font-light pt-1">
                    Sign up or Sign in to your account
                  </Text>
                </View>
              </View>
              <View>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={32}
                  color={isDarkMode ? COLORS.gray100 : COLORS.primaryColorSec}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
