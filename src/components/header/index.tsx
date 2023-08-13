import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../common/colors";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";

export default function Header() {
  const {
    state: { user },
  } = useAuth();
  const { isDarkMode } = useSheet();

  return (
    <View className="flex-row justify-between items-center mx-3 pt-2">
      <View className="flex-row items-center gap-3">
        <View>
          <Image
            source={{ uri: user?.avatar }}
            className="h-12 w-12 rounded-full bg-primaryColorLighter"
          />
        </View>
        <View>
          <Text className="text-[15px] text-grayNeutralTheme dark:text-lightText mb-1">
            {user ? user?.firstName : "Hello there 👋"}
          </Text>
          <Text className="font-bold text-darkNeutral dark:text-lightText text-[17px]">
            {user ? "Welcome Back!" : "Welcome Guest!"}
          </Text>
        </View>
      </View>
      <View className="flex-row gap-3">
        <TouchableOpacity className="bg-gray-100 dark:bg-authDark h-10 dark:h-9 w-10 dark:w-9 rounded-full flex-col justify-center items-center">
          <AntDesign
            name="search1"
            size={22}
            color={isDarkMode ? "#f9f9f9" : COLORS.dark}
          />
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-100 dark:bg-authDark h-10 dark:h-9 w-10 dark:w-9 rounded-full flex-col justify-center items-center">
          <Ionicons
            name="ios-settings-outline"
            size={22}
            color={isDarkMode ? "#f9f9f9" : COLORS.dark}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
