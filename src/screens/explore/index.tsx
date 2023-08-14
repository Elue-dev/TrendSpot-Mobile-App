import { View, Text } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import { useLayoutEffect } from "react";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";

export default function ExploreScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isDarkMode } = useSheet();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]">
          Explore
        </Text>
      ),
    });
  }, [isDarkMode]);

  return <View className="flex-1 bg-white dark:bg-darkNeutral"></View>;
}
