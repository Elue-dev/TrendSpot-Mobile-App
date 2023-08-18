import { TouchableOpacity } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useSheet } from "../context/bottom_sheet/BottomSheetContext";
import { COLORS } from "../common/colors";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";

export default function CustomLeftHeader() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { isDarkMode } = useSheet();

  return isDarkMode ? (
    <TouchableOpacity onPress={() => navigation.goBack()} className="">
      {/* <AntDesign name="left" size={23} color={COLORS.gray50} /> */}
      <Ionicons name="arrow-back-circle" size={29} color={COLORS.gray200} />
    </TouchableOpacity>
  ) : null;
}
