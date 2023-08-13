import { useMemo, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { styles } from "./style";
import { COLORS } from "../../common/colors";
import { BottomSheetProps } from "../../types/bottom_sheet";
import { applyNewsFilter } from "../../helpers/NewsFilter";

export default function BottomSheetComponent({
  selectedInterest,
  dataToUse,
  setDataToUse,
  selectedOption,
  setSelectedOption,
}: BottomSheetProps) {
  const { toggleBottomSheet, toggleOverlay, isDarkMode } = useSheet();
  const navigation = useNavigation<NavigationProp<any>>();
  const SheetRef = useRef(null);
  const snapPoints = useMemo(() => ["50"], []);

  function handleBottomSheetActions(route: string | null) {
    toggleBottomSheet();
    toggleOverlay();
    if (route) navigation.navigate(route);
  }

  function handleNewsFilter() {
    applyNewsFilter({
      selectedOption,
      selectedInterest,
      dataToUse,
      setDataToUse,
      toggleBottomSheet,
      toggleOverlay,
    });
  }

  return (
    <BottomSheet
      ref={SheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      handleComponent={() => null}
      onClose={() => handleBottomSheetActions("")}
      backgroundStyle={{ borderRadius: 20 }}
    >
      <BottomSheetView>
        <View
          style={[
            styles.bottomSheetWrap,
            isDarkMode && { backgroundColor: COLORS.darkNeutral },
          ]}
        >
          <TouchableOpacity
            onPress={() => handleBottomSheetActions(null)}
            className="flex-row items-end justify-end"
          >
            <AntDesign name="closecircle" size={24} color={COLORS.gray50} />
          </TouchableOpacity>

          <Text className="text-xl text-center  font-medium pb-5 dark:text-gray100 text-darkNeutral">
            News Filter
          </Text>

          <View className="flex-row justify-between items-center pb-4 border-b-[1px] border-grayNeutral">
            <Text
              style={styles.sheetText}
              className="font-normal text-extraLightGray dark:text-gray100"
            >
              Verified News Only
            </Text>
            <TouchableOpacity onPress={() => setSelectedOption("VerfiedOnly")}>
              {selectedOption === "VerfiedOnly" ? (
                <Ionicons
                  name="ios-radio-button-on-sharp"
                  size={24}
                  color={
                    isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor
                  }
                />
              ) : (
                <Ionicons
                  name="radio-button-off"
                  size={24}
                  color={COLORS.extraLightGray}
                />
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between items-center pb-4 border-b-[1px] border-grayNeutral mt-3">
            <Text
              style={styles.sheetText}
              className="font-normal text-extraLightGray dark:text-gray100"
            >
              Verified and Unverified
            </Text>
            <TouchableOpacity
              onPress={() => setSelectedOption("VerfiedAndUnverified")}
            >
              {selectedOption === "VerfiedAndUnverified" ? (
                <Ionicons
                  name="ios-radio-button-on-sharp"
                  size={24}
                  color={
                    isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor
                  }
                />
              ) : (
                <Ionicons
                  name="radio-button-off"
                  size={24}
                  color={COLORS.extraLightGray}
                />
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between items-center pb-4 mt-3">
            <Text
              style={styles.sheetText}
              className="font-normal text-extraLightGray dark:text-gray100"
            >
              Unverified News Only
            </Text>
            <TouchableOpacity
              onPress={() => setSelectedOption("UnVerfiedOnly")}
            >
              {selectedOption === "UnVerfiedOnly" ? (
                <Ionicons
                  name="ios-radio-button-on-sharp"
                  size={24}
                  color={
                    isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor
                  }
                />
              ) : (
                <Ionicons
                  name="radio-button-off"
                  size={24}
                  color={COLORS.extraLightGray}
                />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleNewsFilter}
            className="bg-primaryColor dark:bg-primaryColorTheme py-3 rounded-md mt-5"
          >
            <Text className="text-white font-semibold text-center text-xl">
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
