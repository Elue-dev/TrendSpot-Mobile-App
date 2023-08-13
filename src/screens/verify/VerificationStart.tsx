import {
  View,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { News, VerificationStartProps } from "../../types/news";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { COLORS } from "../../common/colors";
import { useEffect, useState } from "react";
import { useAlert } from "../../context/alert/AlertContext";
import { useLayoutEffect } from "react";
import {
  NavigationProp,
  useNavigation,
  useIsFocused,
} from "@react-navigation/native";

export default function VerificationStart({
  newsData,
  nextStep,
  keyword,
  setKeyword,
  setVerificationResults,
}: VerificationStartProps) {
  const { isDarkMode } = useSheet();
  const [loading, setLoading] = useState(false);
  const { showAlertAndContent } = useAlert();
  const navigation = useNavigation<NavigationProp<any>>();
  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]">
          Verify
        </Text>
      ),

      headerLeft: () => null,
    });
  }, [isDarkMode]);

  useEffect(() => {
    setKeyword("");
  }, [isFocused]);

  async function verifyNews() {
    setLoading(true);
    try {
      const verificationResults = newsData.filter(
        (news: News) =>
          news.title.toLowerCase().includes(keyword.toLowerCase()) ||
          news.category.toLowerCase().includes(keyword.toLowerCase()) ||
          news.content.toLowerCase().includes(keyword.toLowerCase())
      );
      setVerificationResults(verificationResults);
      setLoading(false);
      nextStep();
    } catch (error) {
      setLoading(false);
      showAlertAndContent({
        type: "error",
        message: "Something went wrong. Please try again",
      });
    }
  }

  return (
    <View className="flex-1 bg-white dark:bg-darkNeutral">
      <View className="mx-3">
        <View>
          <Text className="text-darkNeutral dark:text-lightText text-xl font-bold mt-12">
            News Verification
          </Text>
          <Text className="text-darkNeutral dark:text-lightText font-normal dark:font-light text-[16px] mt-3 tracking-wide leading-6">
            You can verify a news by typing in the keywords in that particular
            news.{" "}
            <Text className="text-authDark">
              (news outside your interests also appear)
            </Text>
          </Text>
        </View>

        <View className="border-gray100 dark:border-gray200 mt-10">
          <View
            className="border border-gray100 dark:border-extraLightGray mb-5 shadow-sm px-2 py-4 mt-3 rounded-lg"
            style={{
              elevation: 1,
              backgroundColor: isDarkMode ? COLORS.darkNeutral : "#FFF",
            }}
          >
            <View className="mx-1">
              <Text className="text-darkNeutral dark:text-lightText text-base font-bold mt-4">
                Verify via Keywords
              </Text>

              <View
                className={`mt-4 mb-8 px-3 pb-3 shadow-sm rounded-lg flex-row justify-between items-center border-gray100 dark:border-gray200 ${
                  Platform.OS === "android" ? "border-4 dark:border" : "border"
                }`}
                style={{
                  elevation: 1,
                  backgroundColor: isDarkMode ? "transparent" : "#FFF",
                }}
              >
                <TextInput
                  value={keyword}
                  onChangeText={(newVal) => setKeyword(newVal)}
                  className="text-base mt-2 text-darkNeutral dark:text-grayNeutral w-full h-full"
                  placeholder="Enter news keywords"
                  placeholderTextColor={
                    isDarkMode ? COLORS.lightGray : COLORS.grayText
                  }
                  selectionColor={
                    isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor
                  }
                />
              </View>
            </View>
          </View>
          <View className="mt-4">
            {loading ? (
              <TouchableOpacity className="bg-primaryColorLighter py-3 rounded-md">
                <ActivityIndicator color={"#fff"} size="small" />
              </TouchableOpacity>
            ) : !keyword ? (
              <View className="bg-[#e48287] py-3 rounded-md">
                <Text className="text-white font-semibold text-center text-xl">
                  Verify News
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={verifyNews}
                className="bg-primaryColor dark:bg-primaryColorTheme py-3 rounded-md"
              >
                <Text className="text-white font-semibold text-center text-xl">
                  Verify News
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
