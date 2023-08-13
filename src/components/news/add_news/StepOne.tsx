import {
  View,
  Text,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { useSheet } from "../../../context/bottom_sheet/BottomSheetContext";
import { COLORS } from "../../../common/colors";
import { StepOneProps } from "../../../types/news";
import { TextInput } from "react-native-gesture-handler";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { useLayoutEffect } from "react";
import { useAlert } from "../../../context/alert/AlertContext";

export default function StepOne({
  values,
  handleTextChange,
  image,
  setImage,
  nextStep,
  resetFields,
}: StepOneProps) {
  const navigation = useNavigation<NavigationProp<any>>();
  const { isDarkMode } = useSheet();
  const { title, readTime } = values;
  const { showAlertAndContent } = useAlert();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]">
          Add News
        </Text>
      ),

      headerLeft: () => null,
      headerRight: () => (
        <TouchableOpacity
          className="mr-3"
          onPress={() => {
            resetFields();
            Keyboard.dismiss();
          }}
        >
          <Text className="text-darkNeutral dark:text-lightText text-base">
            Reset
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [isDarkMode]);

  async function pickImageAsync() {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  }

  function handleStepChange() {
    Keyboard.dismiss();
    if (!title || !readTime)
      return showAlertAndContent({
        type: "error",
        message: "News title and estimated read time are required fields",
      });
    nextStep();
  }

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-darkNeutral"
      showsVerticalScrollIndicator={false}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View className="mx-2">
          <View className="border-gray100 dark:border-gray200 mt-4">
            <View
              className="border border-gray100 dark:border-extraLightGray shadow-sm px-2 py-4 mt-3 rounded-lg"
              style={{
                elevation: 1,
                backgroundColor: isDarkMode ? COLORS.darkNeutral : "#FFF",
              }}
            >
              <View className="mx-1">
                <Text className="text-darkNeutral dark:text-lightText text-base font-bold mt-1">
                  News Title
                </Text>

                <View
                  className={`mt-4 mb-8 px-3 pb-3 shadow-sm rounded-lg flex-row justify-between items-center border-gray100 dark:border-gray200 ${
                    Platform.OS === "android"
                      ? "border-4 dark:border"
                      : "border"
                  }`}
                  style={{
                    elevation: 1,
                    backgroundColor: isDarkMode ? "transparent" : "#FFF",
                  }}
                >
                  <TextInput
                    value={title}
                    onChangeText={(text) => handleTextChange("title", text)}
                    className="text-base mt-2 text-darkNeutral dark:text-grayNeutral w-full h-full"
                    placeholder="Enter news title"
                    placeholderTextColor={
                      isDarkMode ? COLORS.lightGray : COLORS.grayText
                    }
                    selectionColor={
                      isDarkMode
                        ? COLORS.primaryColorTheme
                        : COLORS.primaryColor
                    }
                  />
                </View>
              </View>
            </View>
          </View>

          <View className="border-gray100 dark:border-gray200 mt-4">
            <View
              className="border border-gray100 dark:border-extraLightGray mb-5 shadow-sm px-2 py-4 mt-3 rounded-lg"
              style={{
                elevation: 1,
                backgroundColor: isDarkMode ? COLORS.darkNeutral : "#FFF",
              }}
            >
              <View className="mx-1">
                <Text className="text-darkNeutral dark:text-lightText text-base font-bold mt-1">
                  News Read Time
                </Text>

                <View
                  className={`mt-4 mb-8 px-3 pb-3 shadow-sm rounded-lg flex-row justify-between items-center border-gray100 dark:border-gray200 ${
                    Platform.OS === "android"
                      ? "border-4 dark:border"
                      : "border"
                  }`}
                  style={{
                    elevation: 1,
                    backgroundColor: isDarkMode ? "transparent" : "#FFF",
                  }}
                >
                  <TextInput
                    value={readTime}
                    onChangeText={(text) => handleTextChange("readTime", text)}
                    keyboardType="numeric"
                    returnKeyType="done"
                    className="text-base mt-2 text-darkNeutral dark:text-grayNeutral w-full h-full"
                    placeholder="Estimated time it would take to read this news"
                    placeholderTextColor={
                      isDarkMode ? COLORS.lightGray : COLORS.grayText
                    }
                    selectionColor={
                      isDarkMode
                        ? COLORS.primaryColorTheme
                        : COLORS.primaryColor
                    }
                  />
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={pickImageAsync}>
            <View
              style={styles.imgWrap}
              className="border-lightBorder dark:border-lightText bg-grayNeutral dark:bg-darkNeutral"
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{
                    height: "100%",
                    width: "100%",
                    resizeMode: "cover",
                  }}
                />
              ) : (
                <View style={styles.textWrap}>
                  <View className="flex-row items-center gap-1">
                    <Ionicons
                      name="ios-image-outline"
                      size={30}
                      color={
                        isDarkMode
                          ? COLORS.primaryColorTheme
                          : COLORS.primaryColor
                      }
                    />
                    <Text className="text-primaryColor dark:text-primaryColorTheme text-[20px]">
                      {" "}
                      Click to add image
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <View className="">
            <TouchableOpacity
              onPress={handleStepChange}
              className="bg-primaryColor dark:bg-primaryColorTheme py-3 rounded-md w-full mt-3"
            >
              <Text className="text-white font-semibold text-center text-xl">
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
