import { Platform, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSheet } from "../context/bottom_sheet/BottomSheetContext";
import { COLORS } from "../common/colors";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function CustomLeftHeader() {
  const navigation = useNavigation<NavigationProp<any>>();

  const { isDarkMode } = useSheet();

  return isDarkMode ? (
    <TouchableOpacity
      onPress={() => navigation.navigate("TabStack", { route: "Home" })}
      className=""
    >
      {/* <AntDesign name="left" size={23} color={COLORS.gray50} /> */}
      <Ionicons name="arrow-back-circle" size={29} color={COLORS.gray200} />
    </TouchableOpacity>
  ) : null;
}
