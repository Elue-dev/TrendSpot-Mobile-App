import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { COLORS } from "../../common/colors";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";

export default function Loader() {
  const { isDarkMode } = useSheet();

  return (
    <View className="flex-1 bg-white dark:bg-darkNeutral">
      <ActivityIndicator
        size="small"
        color={isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor}
        style={{ marginTop: 40 }}
      />
    </View>
  );
}
