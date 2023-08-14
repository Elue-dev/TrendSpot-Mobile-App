import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSheet } from "../context/bottom_sheet/BottomSheetContext";
import { COLORS } from "../common/colors";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";

export default function CustomLeftHeader() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { isDarkMode } = useSheet();

  return isDarkMode ? (
    <TouchableOpacity onPress={() => navigation.goBack()} className="ml-2">
      <Ionicons name="arrow-back-circle" size={29} color={COLORS.gray200} />
    </TouchableOpacity>
  ) : null;
}
