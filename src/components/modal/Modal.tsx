import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { useModal } from "../../context/modal/ModalCotext";
import { useAlert } from "../../context/alert/AlertContext";
import { useAuth } from "../../context/auth/AuthContext";
import { styles } from "./styles";

export default function Modal() {
  const { width } = Dimensions.get("window");
  const { isDarkMode, toggleBottomSheet, toggleOverlay } = useSheet();
  const {
    state: { user },
    setActiveUser,
  } = useAuth();
  const { showModal, closeModal, title, message, actionBtnText, action } =
    useModal();
  const { showAlertAndContent } = useAlert();
  const [loading, setLoading] = useState(false);

  function handleModalAction() {
    switch (action) {
      case "Deactivate":
        deactivateAccount();
        break;
      case "Reactivate":
        reactivateAccount();
        break;
      case "Flag":
        flagNews();
        break;
      default:
        return null;
    }
  }

  function flagNews() {
    closeModal();
    showAlertAndContent({
      type: "success",
      message: "Your response has been noted and will be looked into",
    });
    toggleBottomSheet();
    toggleOverlay();
  }

  async function deactivateAccount() {
    setLoading(true);
    try {
    } catch (error) {
      setLoading(false);
      closeModal();
      showAlertAndContent({
        type: "error",
        message: "Something went wrong. Please try again",
      });
    }
  }

  async function reactivateAccount() {
    setLoading(true);
    try {
      setLoading(false);
      closeModal();
      showAlertAndContent({
        type: "success",
        message: "Your account has been reactivated",
      });
    } catch (error) {
      setLoading(false);
      closeModal();
      showAlertAndContent({
        type: "error",
        message: "Something went wrong. Please try again",
      });
    }
  }

  return (
    <>
      {showModal ? (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={closeModal}
          />
          <View
            style={[styles.alertBox, { maxWidth: width - 50 }]}
            className="bg-white dark:bg-darkNeutral"
          >
            <Text
              style={styles.title}
              className="text-darkNeutral dark:text-lightText"
            >
              {title}
            </Text>
            <Text className="text-grayText dark:text-lightGray text-base font-normal mb-4 text-center leading-6">
              {message}
            </Text>

            <View className="flex-row justify-center items-center pt-3">
              <TouchableOpacity
                onPress={closeModal}
                className="border border-1 border-lightGray mr-3 rounded-md bg-grayNeutral"
              >
                <Text
                  className="py-2 px-10 text-center text-base font-semibold dark:font-bold"
                  style={{ color: isDarkMode ? "#4E0F12" : "#74171C" }}
                >
                  Close
                </Text>
              </TouchableOpacity>

              {loading ? (
                <View className="border border-1 border-primaryColor bg-primaryColor  dark:border-primaryColorTheme dark:bg-primaryColorTheme mr-3 rounded-md">
                  <View className="py-2 px-14 justify-center items-center text-center text-base font-semibold  dark:font-bold">
                    <ActivityIndicator size="small" color={"#fff"} />
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleModalAction}
                  className="border border-1 border-primaryColor bg-primaryColor dark:bg-primaryColorTheme dark:border-primaryColorTheme mr-3 rounded-md"
                >
                  <Text
                    className="py-2 px-10 text-center text-base font-semibold dark:font-bold"
                    style={{ color: "#FFF" }}
                  >
                    {actionBtnText}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
}
