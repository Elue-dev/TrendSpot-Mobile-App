import { View, Text, Platform, ScrollView } from "react-native";
import { VerificationResultsProps } from "../../types/news";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { useEffect, useLayoutEffect } from "react";
import {
  NavigationProp,
  useNavigation,
  useIsFocused,
} from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../common/colors";
import { TextInput } from "react-native";

export default function VerificationResults({
  keyword,
  prevStep,
  verificationResults,
}: VerificationResultsProps) {
  const { isDarkMode } = useSheet();
  const navigation = useNavigation<NavigationProp<any>>();
  const isFocused = useIsFocused();
  const notFocused = !isFocused;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]">
          Verification Results
        </Text>
      ),

      headerLeft: () =>
        Platform.OS === "ios" ? (
          <TouchableOpacity onPress={prevStep} className="mx-3">
            <Ionicons
              name="arrow-back-circle"
              size={29}
              color={COLORS.gray200}
            />
          </TouchableOpacity>
        ) : null,
    });
  }, [isDarkMode]);

  useEffect(() => {
    if (notFocused) prevStep();
  }, [notFocused]);

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-darkNeutral"
      showsVerticalScrollIndicator={false}
    >
      <View className="mx-3 mb-10">
        <Text className="text-darkNeutral dark:text-lightText text-xl font-bold mt-12">
          Verify via Keywords
        </Text>

        <View
          className={`mt-4 mb-8 px-3 pb-4 shadow-sm rounded-lg flex-row justify-between items-center border-gray100 dark:border-gray200 ${
            Platform.OS === "android" ? "border-4 dark:border" : "border"
          }`}
          style={{
            elevation: 1,
            backgroundColor: isDarkMode ? "transparent" : "#FFF",
          }}
        >
          <TextInput
            value={keyword}
            className="text-base mt-2 text-darkNeutral dark:text-grayNeutral"
            editable={false}
          />
        </View>

        {verificationResults.length === 0 && (
          <View
            className={`mt-4 mb-2 px-3 pb-4 shadow-sm rounded-lg flex-row justify-center items-center border-gray100 dark:border-gray200 ${
              Platform.OS === "android" ? "border-4 dark:border" : "border"
            }`}
            style={{
              elevation: 1,
              backgroundColor: isDarkMode ? "transparent" : "#FFF",
            }}
          >
            <View>
              <Text className="text-darkNeutral dark:text-white text-[18px] text-center font-bold mt-4">
                Verification status
              </Text>

              <Ionicons
                name="warning-outline"
                size={110}
                color={isDarkMode ? "#e52828" : "#e81919"}
                style={{ justifyContent: "center", alignSelf: "center" }}
              />
              <Text className="text-gray600 dark:text-lightText text-center text-base">
                There are no news with these keywords here. It is likely a false
                news.
              </Text>

              <TouchableOpacity onPress={prevStep}>
                <Text className="text-primaryColor dark:text-primaryColorTheme text-base text-right font-bold mt-4 underline">
                  Go back
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {verificationResults.length > 0 && (
          <View>
            <Text className="text-darkNeutral dark:text-lightText text-base font-bold mt-8">
              News with similar keywords
            </Text>

            <View
              style={{
                marginBottom: 100,
              }}
            >
              {verificationResults.map((news, index) => (
                <View
                  key={news.id}
                  className={`mt-4 px-3 pb-4 shadow-sm rounded-lg flex-row justify-between items-center border-gray100 dark:border-gray200 ${
                    Platform.OS === "android"
                      ? "border-4 dark:border"
                      : "border"
                  }`}
                  style={{
                    elevation: 1,
                    backgroundColor: isDarkMode ? "transparent" : "#FFF",
                  }}
                >
                  <View>
                    {/* header */}
                    <View className="flex-row items-center gap-1 mt-1">
                      <Text className="text-gray200 dark:text-lightText text-base font-normal">
                        News status:
                      </Text>
                      {news.isVerified ? (
                        <View className="flex-row items-center gap-[.7px]">
                          <Text className="text-customGreen text-base font-bold">
                            Verified
                          </Text>
                          <MaterialIcons
                            name="verified"
                            size={16}
                            color={COLORS.customGreen}
                          />
                        </View>
                      ) : (
                        <Text className="text-red-500 text-base font-bold">
                          Unverified
                        </Text>
                      )}
                    </View>

                    {/* title */}
                    <View className="mt-3">
                      <Text className="text-extraLightGray dark:text-grayNeutral text-[16px] font-bold">
                        {news.title}
                      </Text>

                      <Text className="text-extraLightGray dark:text-lightGray font-light leading-6 pt-2 text-base">
                        {news.content.slice(0, 90)}...
                      </Text>
                      {news.isVerified && (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("NewsDetails", { news })
                          }
                        >
                          <Text className="text-primaryColor dark:text-primaryColorTheme text-[15px] text-right mt-3 font-bold underline">
                            Read News
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
