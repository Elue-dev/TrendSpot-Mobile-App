import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import { ScrollView } from "react-native-gesture-handler";
import { DEFAULT_AVATAR } from "../../utils";
import * as ImagePicker from "expo-image-picker";
import { useAlert } from "../../context/alert/AlertContext";
import { COLORS } from "../../common/colors";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { httpRequest } from "../../services";
import { uploadImageToCloud } from "../../helpers/imageUpload";

export default function EditProfile() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isDarkMode } = useSheet();
  const scrollViewRef = useRef(null);
  const {
    state: { user },
    setActiveUser,
  } = useAuth();
  const { showAlertAndContent } = useAlert();
  const [image, setImage] = useState(user?.avatar);
  const [imageHasChanged, setImageHasChanged] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState(false);
  const authHeaders = { headers: { authorization: `Bearer ${user?.token}` } };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]">
          Edit Profile
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

  async function pickImageAsync() {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageHasChanged(true);
    }
  }

  function validateThatProfileWasUpdated() {
    let validationsPassed = true;

    if (
      firstName === user?.firstName &&
      lastName === user?.lastName &&
      !imageHasChanged
    ) {
      navigation.goBack();
      return showAlertAndContent({
        type: "info",
        message: "You did not make changes to your profile",
      });
    }

    return validationsPassed;
  }

  async function updateUserProfile() {
    if (validateThatProfileWasUpdated()) {
      setLoading(true);

      const userData = {
        firstName,
        lastName,
        avatar: imageHasChanged
          ? await uploadImageToCloud(image!)
          : user?.avatar,
      };

      try {
        const response = await httpRequest.put(
          "/users/update-me",
          userData,
          authHeaders
        );
        setActiveUser(response.data.updatedUser);
        navigation.goBack();
        showAlertAndContent({
          type: "success",
          message: "Profile updated",
        });
        setLoading(false);
      } catch (error: any) {
        console.log({ error });
        navigation.goBack();
        showAlertAndContent({
          type: "error",
          message:
            error.response.data.message ||
            "Something went wrong. Please try again",
        });
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      className="bg-white dark:bg-darkNeutral"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView ref={scrollViewRef} keyboardShouldPersistTaps="handled">
        <Text className="text-[17px] text-darkNeutral font-bold dark:text-gray-400 mb-3">
          Photo
        </Text>
        <View style={styles.flexTop}>
          <Image
            source={{ uri: image || DEFAULT_AVATAR }}
            style={styles.avatar}
            className="bg-primaryColorLighter"
          />
          <View>
            <TouchableOpacity onPress={pickImageAsync}>
              <Text
                style={styles.replaceText}
                className="text-primaryColor dark:text-primaryColorTheme"
              >
                {user?.avatar !== "" ? "Replace Photo" : "Add Photo"}
              </Text>
            </TouchableOpacity>
            <Text className="text-darkNeutral dark:text-lightText text-base">
              JPG and PNG are acceptable
            </Text>
          </View>
        </View>

        <View className="pt-11">
          <Text className="text-[17px] text-darkNeutral font-bold dark:text-gray-400">
            First Name
          </Text>
          <View style={styles.flexInput}>
            <TextInput
              style={styles.input}
              className={`text-darkNeutral dark:text-grayNeutral  ${
                inputError
                  ? "border-red-700 border-b"
                  : "border-b border-b-darkNeutral dark:border-b-authDark"
              }`}
              onTextInput={() => setInputError(false)}
              value={firstName}
              onChangeText={(newName) => setFirstName(newName)}
            />
          </View>

          <Text className="text-[17px] text-darkNeutral font-bold dark:text-gray-400 mt-4">
            Last Name
          </Text>
          <View style={styles.flexInput}>
            <TextInput
              style={styles.input}
              className={`text-darkNeutral dark:text-grayNeutral  ${
                inputError
                  ? "border-red-700 border-b"
                  : "border-b border-b-darkNeutral dark:border-b-authDark"
              }`}
              onTextInput={() => setInputError(false)}
              value={lastName}
              onChangeText={(newName) => setLastName(newName)}
            />
          </View>
          <Text className="text-authDark">
            This will appear on your posts and profile.
          </Text>

          <View className="flex-row items-center gap-4 pt-10">
            <TouchableOpacity
              style={styles.btn}
              className="bg-primaryColor dark:bg-primaryColorTheme"
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.btnText} className="text-white">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btn}
              className="bg-transparent border border-primaryColor dark:border-primaryColorTheme"
              onPress={!loading ? updateUserProfile : () => {}}
            >
              {loading ? (
                <ActivityIndicator
                  color={
                    isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor
                  }
                  size="small"
                />
              ) : (
                <Text
                  style={styles.btnText}
                  className="text-primaryColor dark:text-primaryColorTheme"
                >
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {user?.isDeactivated && (
            <Text className="text-gray-500 dark:text-gray-400 mt-10 text-right italic">
              Your account is currently deactivated
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
