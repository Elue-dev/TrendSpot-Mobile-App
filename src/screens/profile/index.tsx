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
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  AntDesign,
} from "@expo/vector-icons";
import { COLORS } from "../../common/colors";
import { profileData } from "./data";
import { useAuth } from "../../context/auth/AuthContext";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { styles } from "./pages/styles";
import { useAlert } from "../../context/alert/AlertContext";
import { useModal } from "../../context/modal/ModalCotext";

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  const {
    state: { user },
    removeActiveUser,
  } = useAuth();
  const { isDarkMode, toggleTheme } = useSheet();
  const { showAlertAndContent } = useAlert();
  const { showModalAndContent } = useModal();
  const [isEnabled, setIsEnabled] = useState(isDarkMode);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          className={`${
            isDarkMode ? "text-gray300" : "text-primaryColorSec"
          }  font-semibold text-[18px]`}
        >
          {user ? " Profile" : "More"}
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

  function handleProfileNavigation(title: string) {
    switch (title) {
      case "Account Information":
        navigation.navigate("AccountInfo");
        break;
      case "Manage Interests":
        navigation.navigate("ManageInterests");
        break;
      case "Contact Support":
        navigation.navigate("ContactSupport");
        break;
      case "Terms and Privacy Policy":
        navigation.navigate("Terms", { defaultTitle: "Terms Of Use" });
        break;
      case "Saved News":
        navigation.navigate("Saved");
        break;
      default:
        return null;
    }
  }

  async function deactivateAccount() {
    showModalAndContent({
      title: "Account Deativation",
      message:
        "You are about to deactivate your account. You would no longer be able to react to news, share or flag news. Are you sure you want to proceed?  You can change this settings later in your profile",
      actionBtnText: "Deactivate",
      action: "Deactivate",
    });
  }

  async function reactivateAccount() {
    showModalAndContent({
      title: "Account Reactivation",
      message:
        "You are about to reactivate your account. You would now be able to react to news, share or flag news. You can change this settings later in your profile",
      actionBtnText: "Reactivate",
      action: "Reactivate",
    });
  }

  async function logOutUser() {
    try {
      removeActiveUser();
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
        {profileDataToUse.map((data) => (
          <TouchableOpacity
            key={data.title}
            onPress={() => handleProfileNavigation(data.title)}
            className={`${
              isDarkMode ? "border-b-lightBorder" : "border-grayNeutral"
            } flex-row justify-between items-center pb-5  border-b-2`}
          >
            <View>
              <Text
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
                } pt-1 `}
              >
                {data.description}
              </Text>
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

        <Pressable
          className={`flex-row justify-between items-center pb-5 border-grayNeutral dark:border-b-lightBorder border-b-2`}
        >
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
              } pt-1 `}
            >
              Switch between Light and Dark Theme
            </Text>
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

        {user && (
          <TouchableOpacity
            onPress={
              user?.isDeactivated ? reactivateAccount : deactivateAccount
            }
            className={`flex-row justify-between items-center pb-5 border-grayNeutral dark:border-b-lightBorder border-b-2`}
          >
            <View>
              <Text className="text-[17px] mt-4 font-semibold text-primaryColorSec dark:text-gray100">
                {user?.isDeactivated
                  ? "Account Reactivation"
                  : "Account Deactivation"}
              </Text>
              <Text className="text-gray200 font-normal dark:text-lightText dark:font-light pt-1">
                {user?.isDeactivated
                  ? "Reactivate your account here"
                  : "Deactivate your account here"}
              </Text>
            </View>

            {user.isDeactivated ? (
              <MaterialCommunityIcons
                name="account-lock-open"
                size={38}
                color={isDarkMode ? COLORS.gray100 : COLORS.primaryColorSec}
              />
            ) : (
              <FontAwesome5
                name="user-lock"
                size={26}
                color={isDarkMode ? COLORS.gray100 : COLORS.primaryColorSec}
              />
            )}
          </TouchableOpacity>
        )}

        {user ? (
          <View>
            <View className="flex-row justify-between items-center pb-5">
              <View>
                <Text className="text-primaryColorSec dark:text-gray100 text-[17px] mt-4 font-semibold">
                  Log Out
                </Text>
                <Text className="text-gray200 font-normal dark:text-lightText dark:font-light pt-1">
                  Log out of your account
                </Text>
              </View>
              <TouchableOpacity onPress={logOutUser} className="mr-2">
                <AntDesign
                  name="logout"
                  size={26}
                  color={isDarkMode ? COLORS.gray100 : COLORS.primaryColorSec}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("AuthSequence", { state: "Sign Up" })
              }
              className="flex-row justify-between items-center pb-5"
            >
              <View>
                <Text className="text-primaryColorSec dark:text-gray100 text-[17px] mt-4 font-semibold">
                  Sign Up / Sign In
                </Text>
                <Text className="text-gray200 font-normal dark:text-lightText dark:font-light pt-1">
                  Sign up or Sign in to your account
                </Text>
              </View>
              <View>
                <FontAwesome
                  name="sign-in"
                  size={30}
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
