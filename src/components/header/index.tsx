import {
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useAuth } from "../../context/auth/AuthContext";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { COLORS } from "../../common/colors";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { DEFAULT_AVATAR } from "../../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function Header() {
  const navigation = useNavigation<NavigationProp<any>>();

  const {
    state: { user },
  } = useAuth();
  const { isDarkMode } = useSheet();

  async function resetOnboarding() {
    await AsyncStorage.removeItem("userHasOnboarded");
    navigation.navigate("Onboarding");
  }

  return (
    <View className="flex-row justify-between items-center mx-3 pt-2">
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
            {user ? `${user?.firstName} ${user?.lastName}` : "Hello there 👋"}
          </Text>
          <Text
            style={{ fontFamily: "rubikMD" }}
            className="font-bold text-darkNeutral dark:text-lightText text-[17px]"
          >
            {user ? "Welcome Back!" : "Welcome Guest!"}
          </Text>
        </View>
      </View>
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={resetOnboarding}
          className="bg-shadowWhite dark:bg-authDark h-10 dark:h-9 w-10 dark:w-9 rounded-full flex-col justify-center items-center"
        >
          <Feather
            name="activity"
            size={22}
            color={isDarkMode ? "#f7f7f7" : COLORS.dark}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            user
              ? navigation.navigate("AccountInfo")
              : navigation.navigate("AuthSequence", { state: "Sign In" })
          }
          className="bg-shadowWhite dark:bg-authDark h-10 dark:h-9 w-10 dark:w-9 rounded-full flex-col justify-center items-center"
        >
          <FontAwesome5
            name="user"
            size={22}
            color={isDarkMode ? "#f9f9f9" : COLORS.dark}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
