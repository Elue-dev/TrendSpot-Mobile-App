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
import { httpRequest } from "../../services";
import { usePushTokenContext } from "../../context/push_token/PushTokenContext";
import { useQueryClient } from "@tanstack/react-query";

export default function Modal() {
  const { width } = Dimensions.get("window");
  const { isDarkMode } = useSheet();
  const {
    state: { user },
    setActiveUser,
  } = useAuth();
  const {
    showModal,
    closeModal,
    title,
    message,
    actionBtnText,
    action,
    param,
    setParam,
  } = useModal();
  const { showAlertAndContent } = useAlert();
  const [loading, setLoading] = useState(false);
  const authHeaders = { headers: { authorization: `Bearer ${user?.token}` } };
  const { expoPushToken } = usePushTokenContext();
  const queryClient = useQueryClient();

  function handleModalAction() {
    switch (action) {
      case "Deactivate":
        deactivateAccount();
        break;
      case "Reactivate":
        reactivateAccount();
      case "BecomeAuthor":
        requestToBecomeAuthor();
        break;
      case "DeleteNotif":
        deleteNotification();
        break;
      default:
        return null;
    }
  }

  async function deactivateAccount() {
    setLoading(true);
    try {
      const response = await httpRequest.put(
        "/users/account/deactivate",
        {
          userId: user?.id,
          token: expoPushToken,
        },
        authHeaders
      );

      const modifiedUser = { token: user?.token, ...response.data.updatedUser };
      setActiveUser(modifiedUser);
      setLoading(false);
      closeModal();
      showAlertAndContent({
        type: "success",
        message: response.data.message,
      });
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      closeModal();
      showAlertAndContent({
        type: "error",
        message:
          error.response.data.message ||
          "Something went wrong. Please try again",
      });
    }
  }

  async function reactivateAccount() {
    setLoading(true);
    try {
      const response = await httpRequest.put(
        "/users/account/reactivate",
        {
          userId: user?.id,
          token: expoPushToken,
        },
        authHeaders
      );
      const modifiedUser = { token: user?.token, ...response.data.updatedUser };
      setActiveUser(modifiedUser);
      setLoading(false);
      closeModal();
      showAlertAndContent({
        type: "success",
        message: response.data.message,
      });
    } catch (error: any) {
      // console.log({ error: error.response.data.message });
      setLoading(false);
      closeModal();
      showAlertAndContent({
        type: "error",
        message:
          error.response.data.message ||
          "Something went wrong. Please try again",
      });
    }
  }

  async function requestToBecomeAuthor() {
    setLoading(true);
    try {
      const response = await httpRequest.post(
        "/become-author",
        "",
        authHeaders
      );

      if (response) {
        setLoading(false);
        closeModal();
        showAlertAndContent({
          type: "success",
          message: response.data.message,
          timeout: 8000,
        });
      }
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      closeModal();
      showAlertAndContent({
        type: "error",
        message:
          error.response.data.message ||
          "Something went wrong. Please try again",
      });
    }
  }

  async function deleteNotification() {
    setLoading(true);

    try {
      const response = await httpRequest.delete(
        `/notifications/${param}`,
        authHeaders
      );

      if (response) {
        setLoading(false);
        closeModal();
        setParam(null);
        queryClient.invalidateQueries(["notifications"]);
        showAlertAndContent({
          type: "success",
          message: response.data.message,
        });
      }
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      closeModal();
      showAlertAndContent({
        type: "error",
        message:
          error.response.data.message ||
          "Something went wrong. Please try again",
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
            onPress={
              loading
                ? () => {}
                : () => {
                    setParam(null);
                    closeModal;
                  }
            }
          />
          <View
            style={[styles.alertBox, { maxWidth: width - 50 }]}
            className="bg-white dark:bg-darkNeutral"
          >
            <Text
              style={[styles.title, { fontFamily: "rubikSB" }]}
              className="text-darkNeutral dark:text-lightText"
            >
              {title}
            </Text>
            <Text
              style={{ fontFamily: "rubikREG" }}
              className="text-grayText dark:text-lightGray text-base font-normal mb-4 text-center leading-6"
            >
              {message}
            </Text>

            <View className="flex-row justify-center items-center pt-3">
              <TouchableOpacity
                onPress={loading ? () => {} : closeModal}
                className="border border-1 border-lightGray mr-3 rounded-md bg-grayNeutral"
              >
                <Text
                  className="py-2 px-10 text-center text-base font-semibold dark:font-bold"
                  style={{
                    color: isDarkMode ? "#4E0F12" : "#74171C",
                    fontFamily: "rubikSB",
                  }}
                >
                  CLOSE
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
                    style={{ fontFamily: "rubikSB", color: "#FFF" }}
                    className="py-2 px-10 text-center text-base font-semibold dark:font-bold"
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
