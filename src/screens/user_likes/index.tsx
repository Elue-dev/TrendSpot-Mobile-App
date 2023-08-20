import { View, Text, Platform } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { useAlert } from "../../context/alert/AlertContext";
import { useQueryClient } from "@tanstack/react-query";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLORS } from "../../common/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function UserLikes() {
  const [loading, setloading] = useState(false);
  const queryClient = useQueryClient();
  const navigation = useNavigation<NavigationProp<any>>();
  const {
    state: { user },
  } = useAuth();
  const { isDarkMode } = useSheet();
  const { showAlertAndContent } = useAlert();
  const authHeaders = {
    headers: { authorization: `Bearer ${user?.token}` },
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{ fontFamily: "rubikSB" }}
          className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]"
        >
          Bookmarks
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

  return (
    <View>
      <Text>UserLikes</Text>
    </View>
  );
}
