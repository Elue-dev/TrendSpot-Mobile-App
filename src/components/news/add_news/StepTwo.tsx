import {
  View,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { useLayoutEffect, useState } from "react";
import { AddNews, News, StepTwoProps } from "../../../types/news";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useSheet } from "../../../context/bottom_sheet/BottomSheetContext";
import { COLORS } from "../../../common/colors";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { categories } from "../../../data/categories";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { styles } from "./styles";
import { useAlert } from "../../../context/alert/AlertContext";
import { useAuth } from "../../../context/auth/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpRequest } from "../../../services";
import { uploadImageToCloud } from "../../../helpers/imageUpload";
import { usePushTokenContext } from "../../../context/push_token/PushTokenContext";

export default function StepTwo({
  values,
  category,
  image,
  setCategory,
  previousStep,
  content,
  setContent,
  richText,
  resetFields,
}: StepTwoProps) {
  const navigation = useNavigation<NavigationProp<any>>();
  const { isDarkMode } = useSheet();

  const [loading, setLoading] = useState(false);
  const { showAlertAndContent } = useAlert();
  const { title, readTime } = values;
  const {
    setCurrRoute,
    state: { user },
  } = useAuth();
  const { expoPushToken } = usePushTokenContext();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{ fontFamily: "rubikSB" }}
          className="font-semibold text-[18px] text-primaryColorSec dark:text-gray300"
        >
          Add News
        </Text>
      ),

      headerLeft: () => (
        <TouchableOpacity onPress={previousStep} className="mx-3">
          <Ionicons name="arrow-back-circle" size={29} color={COLORS.gray200} />
        </TouchableOpacity>
      ),

      headerRight: () => (
        <TouchableOpacity
          className="mr-3"
          onPress={() => {
            resetFields();
            Keyboard.dismiss();
          }}
        >
          <Text
            style={{ fontFamily: "rubikREG" }}
            className="text-darkNeutral dark:text-lightText text-base"
          >
            Reset
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [isDarkMode]);

  function inputsValidated() {
    let validationsPassed = true;

    if (!category)
      return showAlertAndContent({
        type: "error",
        message: "Please specify news category",
      });

    if (!title)
      return showAlertAndContent({
        type: "error",
        message: "Please specify news title",
      });

    if (!content)
      return showAlertAndContent({
        type: "error",
        message: "Please specify news content",
      });

    return validationsPassed;
  }

  const queryClient = useQueryClient();
  const authHeaders = {
    headers: { authorization: `Bearer ${user?.token}` },
  };

  const mutation = useMutation(
    (news: AddNews) => {
      return httpRequest.post("/news", news, authHeaders);
    },
    {
      onSuccess: () => {
        setLoading(false);
        queryClient.invalidateQueries(["customNews"]);
        queryClient.invalidateQueries(["userNews"]);
      },
      onError: () => {
        setLoading(false);
      },
    }
  );

  async function addNews() {
    Keyboard.dismiss();

    if (inputsValidated()) {
      setLoading(true);

      try {
        const newsData = {
          title,
          content,
          image: await uploadImageToCloud(image || ""),
          readTime: parseInt(readTime),
          category,
          token: expoPushToken,
        };

        const response = await mutation.mutateAsync(newsData);
        console.log(response.data);

        if (response) {
          showAlertAndContent({
            type: "success",
            message: "News added successfully",
          });
          setLoading(false);
          navigation.navigate("TabStack", { screen: "Home" });
          setCurrRoute("Home");
          resetFields();
        }
      } catch (error: any) {
        console.log(error.response.data.message);
        setLoading(false);
        showAlertAndContent({
          type: "error",
          message:
            error.response.data.message ||
            "Something went wrong. Please try again later",
        });
      }
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-shadowWhite dark:bg-darkNeutral"
      showsVerticalScrollIndicator={false}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* CATEGORY PICKER */}
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item
            label="Select news category"
            value=""
            style={{ fontFamily: "rubikREG" }}
            color={isDarkMode ? COLORS.lightGray : COLORS.darkNeutral}
            enabled={false}
          />
          {categories.map((category) => (
            <Picker.Item
              label={category}
              value={category}
              key={category}
              color={isDarkMode ? COLORS.lightGray : COLORS.darkNeutral}
            />
          ))}
        </Picker>

        {/* EDITOR */}
        <View className="mx-2">
          <View className="flex-col-reverse w-full mb-2 ">
            <RichEditor
              ref={richText}
              initialContentHTML={content}
              onChange={(val) => setContent(val)}
              placeholder="Add news content..."
              style={styles.richTextEditorStyle}
              className="border-authDark dark:border-lightText"
              hideKeyboardAccessoryView={true}
              collapsable={true}
              initialHeight={250}
              editorStyle={{
                backgroundColor: isDarkMode ? COLORS.darkNeutral : "#fff",
                color: isDarkMode ? "#fff" : COLORS.darkNeutral,
              }}
              onBlur={() => {
                Keyboard.dismiss();
              }}
            />

            <RichToolbar
              editor={richText}
              selectedIconTint="#873c1e"
              iconTint="#222"
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.insertLink,
                actions.setStrikethrough,
                actions.setUnderline,
              ]}
              style={styles.richTextToolbarStyle}
            />
          </View>
        </View>

        {/* BUTTON */}
        <View className="justify-end items-end mt-2 mx-2 pb-80  ">
          {loading ? (
            <TouchableOpacity className="bg-primaryColorLighter py-3 rounded-md w-full">
              <ActivityIndicator color={"#fff"} size="small" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={addNews}
              className="bg-primaryColor dark:bg-primaryColorTheme py-3 rounded-md w-full mb-4"
            >
              <Text
                style={{ fontFamily: "rubikSB" }}
                className="text-white font-semibold text-center text-xl"
              >
                Add News
              </Text>
            </TouchableOpacity>
          )}

          {/* <TouchableOpacity
            className="mr-3 mb-16"
            onPress={() => Keyboard.dismiss()}
          >
            <Text className="text-darkNeutral dark:text-lightText text-base">
              Close keyboard
            </Text>
          </TouchableOpacity> */}
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
