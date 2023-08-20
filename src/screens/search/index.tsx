import { View, Text, Platform } from "react-native";
import { useLayoutEffect } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLORS } from "../../common/colors";
import {
  Ionicons,
  SimpleLineIcons,
  FontAwesome5,
  Fontisto,
  FontAwesome,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";

export default function Search() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { isDarkMode } = useSheet();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{ fontFamily: "rubikSB" }}
          className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]"
        >
          Search News
        </Text>
      ),

      headerLeft: () =>
        Platform.OS === "ios" ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="closecircle" size={23} color={COLORS.gray200} />
          </TouchableOpacity>
        ) : null,
    });
  }, [isDarkMode]);

  return (
    <View>
      <Text>Search</Text>
    </View>
  );
}
