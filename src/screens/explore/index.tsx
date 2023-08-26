import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import { useLayoutEffect, useState } from "react";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../common/colors";

export default function ExploreScreen() {
  const [newsType, setNewsType] = useState("Custom");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isDarkMode } = useSheet();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{ fontFamily: "rubikSB" }}
          className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]"
        >
          Explore
        </Text>
      ),
    });
  }, [isDarkMode]);

  function handleNavigation() {
    switch (newsType) {
      case "Custom":
        navigation.navigate("Categories");
        break;
      case "External":
        navigation.navigate("ExploreExternalNews");
        break;
      default:
        return null;
    }
  }

  return (
    <View className="flex-1 bg-shadowWhite dark:bg-darkNeutral">
      <View className="mt-5 mx-3">
        <Pressable
          onPress={() => setNewsType("Custom")}
          className={`flex-row justify-between items-center mt-4 py-8 px-4 rounded-lg bg-white dark:bg-grayNeutralTheme shadow-sm ${
            newsType === "Custom" ? "border border-authDark" : ""
          }`}
        >
          <View>
            <Text
              style={{ fontFamily: "rubikREG" }}
              className="mb-3 text-[18px] font-semibold text-darkNeutral dark:text-lightText"
            >
              Custom News
            </Text>
            <Text
              style={{ fontFamily: "rubikREG" }}
              className="text-[15px] text-authDark dark:text-lightGray"
            >
              View news added by TrendSpot
            </Text>
          </View>
          {newsType === "Custom" ? (
            <Ionicons
              name="checkmark-circle"
              size={30}
              color={isDarkMode ? COLORS.lightGray : COLORS.gray600}
            />
          ) : (
            <Feather
              name="circle"
              size={26}
              color={isDarkMode ? COLORS.lightGray : COLORS.gray600}
            />
          )}
        </Pressable>

        <Pressable
          onPress={() => setNewsType("External")}
          className={`flex-row justify-between items-center mt-4 py-8 px-4 rounded-lg bg-white dark:bg-grayNeutralTheme shadow-sm ${
            newsType === "External" ? "border border-authDark" : ""
          }`}
        >
          <View>
            <Text
              style={{ fontFamily: "rubikREG" }}
              className="mb-3 text-[18px] font-semibold text-darkNeutral dark:text-lightText"
            >
              External News
            </Text>
            <Text
              style={{ fontFamily: "rubikREG" }}
              className="text-[15px] text-authDark dark:text-lightGray"
            >
              View news from External Sources
            </Text>
          </View>
          {newsType === "External" ? (
            <Ionicons
              name="checkmark-circle"
              size={30}
              color={isDarkMode ? COLORS.lightGray : COLORS.gray600}
            />
          ) : (
            <Feather
              name="circle"
              size={26}
              color={isDarkMode ? COLORS.lightGray : COLORS.gray600}
            />
          )}
        </Pressable>

        <View className="mt-7">
          <TouchableOpacity
            onPress={handleNavigation}
            className="bg-primaryColor dark:bg-primaryColorTheme py-3 rounded-md"
          >
            <Text
              style={{ fontFamily: "rubikSB" }}
              className="text-white font-semibold text-center text-xl"
            >
              Proceed
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
