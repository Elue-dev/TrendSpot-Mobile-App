import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { useAuth } from "../../context/auth/AuthContext";
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../common/colors";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { DEFAULT_AVATAR } from "../../utils";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { usePushTokenContext } from "../../context/push_token/PushTokenContext";
import { useEffect, useState } from "react";
import { httpRequest } from "../../services";
import { Notifications } from "../../types/activities";
import { useQuery } from "@tanstack/react-query";

export default function Header() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { expoPushToken } = usePushTokenContext();
  const [unreadNotifications, setUnreadNotifications] = useState<
    Notifications[]
  >([]);
  const {
    state: { user },
    setActiveUser,
  } = useAuth();
  const authHeaders = {
    headers: { authorization: `Bearer ${user?.token}` },
  };

  const queryFn = async function (): Promise<Notifications[]> {
    return httpRequest
      .get(`/notifications?userId=${user?.id}`, authHeaders)
      .then((res) => {
        return res.data.notifications;
      });
  };

  const {} = useQuery<Notifications[]>(["notifications"], queryFn, {
    staleTime: 60000,
    refetchOnWindowFocus: true,
    onError(error) {
      console.log(error);
    },
    onSuccess(data) {
      const unRead = data?.filter(
        (notification) => notification.isRead === false
      );
      setUnreadNotifications(unRead);
    },
  });

  async function getUserDataWithNewToken() {
    console.log("geting...");
    try {
      const dbResponse = await httpRequest.get(
        `/users/user-with-token/${user?.id}`
      );
      const modifiedUser = { token: user?.token, ...dbResponse.data.user };
      setActiveUser(modifiedUser);
      console.log("SUCCESSS");
    } catch (error: any) {
      console.log("UPDATED USER ERROR", error.response.data.message);
    }
  }

  const { isDarkMode } = useSheet();

  useEffect(() => {
    async function updateUserPushToken() {
      console.log("hereee");

      try {
        await httpRequest.put(
          `/users/${user?.id}`,
          {
            pushToken: expoPushToken || user?.pushToken,
          },
          authHeaders
        );
        console.log("SUCCESS UPDATING TOKEN");
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
          onPress={
            () =>
              // user
              navigation.navigate("Notifications")
            // : navigation.navigate("AuthSequence", { state: "Sign In" })
          }
          className="bg-white dark:bg-darkCard h-10 dark:h-9 w-10 dark:w-9 rounded-full flex-col justify-center items-center relative"
        >
          <Ionicons
            name="notifications-outline"
            size={26}
            color={isDarkMode ? "#f7f7f7" : COLORS.dark}
          />
          <View className="absolute bottom-[23px] right-[4px] bg-primaryColorLighter rounded-full h-4 w-4 flex-row items-center justify-center">
            <Text className="text-white">{unreadNotifications?.length}</Text>
          </View>
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
