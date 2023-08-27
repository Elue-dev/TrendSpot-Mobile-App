import {
  View,
  Text,
  Platform,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import { useLayoutEffect, useState } from "react";
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
  Feather,
} from "@expo/vector-icons";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { categories } from "../../data/categories";

export default function Categories() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { isDarkMode } = useSheet();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{ fontFamily: "rubikSB" }}
          className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]"
        >
          Categories
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

  function manageCategories(category: string) {
    const categoriesWithoutCurrentCategory = selectedCategories.filter(
      (cat) => cat !== category
    );
    selectedCategories.includes(category)
      ? setSelectedCategories(categoriesWithoutCurrentCategory)
      : setSelectedCategories([...selectedCategories, category]);
  }

  return (
    <ScrollView
      className="flex-1 bg-shadowWhite dark:bg-darkNeutral"
      showsVerticalScrollIndicator={false}
    >
      <View className="pt-5 mb-20 mx-3">
        <Pressable
          onPress={() => {
            setSelectedCategories([]);
            setIsAllSelected(!isAllSelected);
          }}
          className={`flex-row justify-between items-center rounded-lg py-4 px-4 mt-2 shadow-sm bg-white dark:bg-darkCard ${
            isAllSelected
              ? "border-2 border-authDark"
              : "border border-lightText dark:border-lightBorder"
          } `}
        >
          <Text
            style={{ fontFamily: "rubikREG" }}
            className="mb-3 text-[18px] font-semibold text-darkNeutral dark:text-lightText"
          >
            All
          </Text>
          {isAllSelected ? (
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
        <FlatList
          keyExtractor={(categories) => categories}
          data={categories}
          scrollEnabled={false}
          renderItem={({ item: category }) => (
            <Pressable
              onPress={() =>
                isAllSelected ? () => {} : manageCategories(category)
              }
              className={`flex-row justify-between items-center rounded-lg py-4 px-4 mt-2 shadow-sm bg-white dark:bg-darkCard ${
                selectedCategories.includes(category)
                  ? "border-2 border-authDark"
                  : "border border-lightText dark:border-lightBorder"
              } `}
            >
              <View>
                <Text
                  style={{ fontFamily: "rubikREG" }}
                  className="mb-3 text-[18px] font-semibold text-darkNeutral dark:text-lightText"
                >
                  {category}
                </Text>
              </View>
              {selectedCategories.includes(category) || isAllSelected ? (
                <Ionicons
                  name="checkmark-circle"
                  size={30}
                  color={isDarkMode ? COLORS.lightGray : COLORS.gray600}
                />
              ) : (
                <Feather
                  name="circle"
                  size={26}
                  color={
                    isDarkMode && !isAllSelected
                      ? COLORS.lightGray
                      : isDarkMode && isAllSelected
                      ? COLORS.dark
                      : COLORS.gray600
                  }
                />
              )}
            </Pressable>
          )}
        />

        <View className="mt-7">
          <Pressable
            onPress={() => {
              selectedCategories.length === 0 && !isAllSelected
                ? () => {}
                : navigation.navigate("ExploreCustomNews", {
                    selectedCategories: isAllSelected
                      ? "All"
                      : selectedCategories,
                  });
            }}
            className={`${
              selectedCategories.length === 0 && !isAllSelected
                ? "bg-primaryColorDisabled"
                : "bg-primaryColor dark:bg-primaryColorTheme"
            } py-3 rounded-md`}
          >
            <Text
              style={{ fontFamily: "rubikSB" }}
              className="text-white font-semibold text-center text-xl"
            >
              Find News
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
