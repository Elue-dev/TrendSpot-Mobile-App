import {
  View,
  Text,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLayoutEffect } from "react";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { User } from "../../types/auth";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { RootStackParamList } from "../../types/navigation";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { useAlert } from "../../context/alert/AlertContext";
import { useAuth } from "../../context/auth/AuthContext";
import CustomLeftHeader from "../../helpers/CustomLeftHeader";
import { Image } from "react-native";
import { DEFAULT_AVATAR } from "../../utils";
import { COLORS } from "../../common/colors";
import NewsByUser from "../user_news";

interface PageParams {
  user: User;
}

export default function UserProfile() {
  const { user: UserFromParams } = useRoute().params as PageParams;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isDarkMode } = useSheet();
  const {
    state: { user },
  } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{ fontFamily: "rubikSB" }}
          className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]"
        >
          {UserFromParams.lastName}'s Profile
        </Text>
      ),

      headerLeft: () =>
        isDarkMode && Platform.OS === "ios" ? <CustomLeftHeader /> : null,
    });
  }, [isDarkMode]);

  return (
    <ScrollView className="flex-1 bg-white dark:bg-darkNeutral">
      <View className="mx-3">
        <View className="pt-6 mx-3 justify-center items-center">
          <Image
            source={{ uri: UserFromParams?.avatar || DEFAULT_AVATAR }}
            className="h-28 w-28 rounded-full bg-primaryColorLighter"
          />
          <Text
            style={{ fontFamily: "rubikREG" }}
            className="pt-2 text-darkNeutral dark:text-lightText text-xl font-bold"
          >
            {UserFromParams?.firstName} {UserFromParams?.lastName}
          </Text>

          {UserFromParams.id === user?.id && (
            <TouchableOpacity
              onPress={() => navigation.navigate("AccountInfo")}
            >
              <Text
                style={{ fontFamily: "rubikREG" }}
                className="text-primaryColorTheme text-[17px] font-bold"
              >
                Go to your profile
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="pt-6">
          <View className="flex-row items-center justify-between pb-4">
            <Text
              style={{ fontFamily: "rubikSB" }}
              className="text-darkNeutral dark:text-gray-500 text-base font-bold "
            >
              ACCOUNT INFORMATION
            </Text>
          </View>

          <View className="flex-row justify-between items-center pb-2 border-b-[.2px] border-b-lightBorder dark:border-b-slate-200">
            <Text
              style={{ fontFamily: "rubikREG" }}
              className="text-darkNeutral dark:text-lightGray text-base"
            >
              First Name
            </Text>
            <Text className="text-darkNeutral dark:text-white text-base">
              {UserFromParams?.firstName}
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
              {UserFromParams?.lastName}
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
              {UserFromParams?.email}
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
              {UserFromParams?.isDeactivated ? (
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
                  UserFromParams?.isDeactivated
                    ? "text-red-500"
                    : "text-customGreen"
                } text-base`}
              >
                {UserFromParams?.isDeactivated ? "Deactivated" : "Active"}
              </Text>
            </View>
          </View>
        </View>

        <View className="pt-14 pb-16">
          <View className="flex-row items-center justify-between pb-4">
            <Text
              style={{ fontFamily: "rubikSB" }}
              className="text-darkNeutral dark:text-gray-500 text-base font-bold "
            >
              POSTS ADDED BY {UserFromParams.firstName.toUpperCase()}
            </Text>
          </View>

          <NewsByUser userId={UserFromParams.id} />
        </View>
      </View>
    </ScrollView>
  );
}
