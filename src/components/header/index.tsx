import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { useAuth } from "../../context/auth/AuthContext";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { COLORS } from "../../common/colors";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { DEFAULT_AVATAR } from "../../utils";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { usePushTokenContext } from "../../context/push_token/PushTokenContext";
import { useEffect } from "react";
import { httpRequest } from "../../services";

export default function Header() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { expoPushToken } = usePushTokenContext();
  const {
    state: { user },
    setActiveUser,
  } = useAuth();
  const authHeaders = {
    headers: { authorization: `Bearer ${user?.token}` },
  };

  async function getUserDataWithNewToken() {
    const dbResponse = await httpRequest.get(
      `/users/user-with-token/${user?.id}`
    );
    const modifiedUser = { token: user?.token, ...dbResponse.data.user };
    setActiveUser(modifiedUser);
  }

  const { isDarkMode } = useSheet();

  useEffect(() => {
    async function updateUserPushToken() {
      try {
        await httpRequest.put(
          `/users/${user?.id}`,
          {
            pushToken: expoPushToken || user?.pushToken,
          },
          authHeaders
        );
      } catch (error: any) {
        console.log("Push token update error", error.response.data);
        if (error.response.data.message.includes("Session expired")) {
          getUserDataWithNewToken();
        }
      }
    }
    updateUserPushToken();
  }, [user]);

  return (
    <View
      className={`flex-row justify-between items-center mx-3 ${
        Platform.OS === "ios" ? "pt-2" : "pt-14"
      }`}
    >
      <View className="flex-row items-center gap-3">
        <View>
          <Image
            source={{ uri: user?.avatar || DEFAULT_AVATAR }}
            className="h-12 w-12 rounded-full bg-primaryColorLighter"
          />
        </View>
        <View>
          <Text
            style={{ fontFamily: "rubikREG" }}
            className="text-[15px] text-grayNeutralTheme dark:text-lightText mb-1"
          >
            {user ? (
              `${user?.firstName} ${user?.lastName}`
            ) : (
              <View className="flex-row items-center">
                <Text
                  style={{ fontFamily: "rubikREG" }}
                  className="mr-1 text-[15px] text-darkNeutral dark:text-lightText"
                >
                  Hello there
                </Text>
                <MaterialCommunityIcons
                  name="human-greeting-variant"
                  size={16}
                  color={COLORS.authDark}
                />
              </View>
            )}
          </Text>
          <Text
            style={{ fontFamily: "rubikMD" }}
            className="font-bold text-darkNeutral dark:text-lightText text-[17px] -mt-[1px]"
          >
            {user ? "Welcome Back!" : "Welcome Guest!"}
          </Text>
        </View>
      </View>
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => navigation.navigate("Activities")}
          className="bg-white dark:bg-darkCard h-10 dark:h-9 w-10 dark:w-9 rounded-full flex-col justify-center items-center"
        >
          <Feather
            name="activity"
            size={22}
            color={isDarkMode ? "#f7f7f7" : COLORS.dark}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            user
              ? navigation.navigate("AccountInfo")
              : navigation.navigate("AuthSequence", { state: "Sign In" })
          }
          className="bg-white dark:bg-darkCard h-10 dark:h-9 w-10 dark:w-9 rounded-full flex-col justify-center items-center"
        >
          <FontAwesome5
            name="user"
            size={22}
            color={isDarkMode ? "#f9f9f9" : COLORS.dark}
          />
        </TouchableOpacity>
        {user && user.isAdmin && (
          <TouchableOpacity
            onPress={() => navigation.navigate("Admin")}
            className="bg-white dark:bg-darkCard h-10 dark:h-9 w-10 dark:w-9 rounded-full flex-col justify-center items-center"
          >
            <MaterialCommunityIcons
              name="web"
              size={27}
              color={isDarkMode ? "#f9f9f9" : COLORS.dark}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
