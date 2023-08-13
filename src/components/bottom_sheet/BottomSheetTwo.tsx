import { useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  MaterialCommunityIcons,
  AntDesign,
  SimpleLineIcons,
  Ionicons,
} from "@expo/vector-icons";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { styles } from "./style";
import { COLORS } from "../../common/colors";
import { useModal } from "../../context/modal/ModalCotext";
import { useAlert } from "../../context/alert/AlertContext";
import { useAuth } from "../../context/auth/AuthContext";
import { BottomSheetTwoProps } from "../../types/bottom_sheet";

export default function BottomSheetTwo({ currentNews }: BottomSheetTwoProps) {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const { isDarkMode, toggleBottomSheet, toggleOverlay } = useSheet();
  const { showModalAndContent } = useModal();
  const { showAlertAndContent, closeAlert } = useAlert();
  const {
    state: { user },
  } = useAuth();
  const SheetRef = useRef(null);
  const snapPoints = useMemo(() => ["45"], []);
  const borderTouse = isDarkMode ? " border-b-[0.4px]" : " border-b-[1px]";

  function handleBottomSheetActions() {
    toggleBottomSheet();
    toggleOverlay();
  }

  function flagNews() {
    closeAlert();

    if (user?.isDeactivated) {
      showAlertAndContent({
        type: "error",
        message:
          "Your account is currently deactivated. Reactivate your account to continue",
      });
      handleBottomSheetActions();
      return;
    }

    showModalAndContent({
      title: "You are about to flag this News",
      message:
        "This will put this news up for further verification and might be removed from this platform if proven false",
      actionBtnText: "Flag News",
      action: "Flag",
    });
  }

  async function reactToNews(action: string) {}

  async function saveNews() {}

  return (
    <BottomSheet
      ref={SheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      handleComponent={() => null}
      onClose={handleBottomSheetActions}
      backgroundStyle={{ borderRadius: 20 }}
    >
      <BottomSheetView style={{ paddingBottom: 0 }}>
        <View
          style={[
            styles.bottomSheetWrap,
            isDarkMode && { backgroundColor: COLORS.darkNeutral },
          ]}
        >
          <TouchableOpacity
            onPress={handleBottomSheetActions}
            className="flex-row items-end justify-end mb-6"
          >
            <AntDesign name="closecircle" size={24} color={COLORS.gray50} />
          </TouchableOpacity>

          {loading ? (
            <View
              className={`flex-row justify-start items-center pb-4 border-grayNeutral pt-4 gap-3 ${borderTouse}`}
            >
              <SimpleLineIcons
                name="like"
                size={20}
                color={isDarkMode ? COLORS.gray300 : COLORS.extraLightGray}
              />
              <Text
                className={`${
                  isDarkMode ? "text-gray300" : "text-extraLightGray"
                }  text-[19px]  font-normal`}
              >
                ...
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => reactToNews("upvote")}
              className={`flex-row justify-start items-center pb-4 border-grayNeutral mt-3 gap-3 ${borderTouse}`}
            >
              <SimpleLineIcons
                name="like"
                size={20}
                color={isDarkMode ? COLORS.gray300 : COLORS.extraLightGray}
              />
              <Text
                className={`${
                  isDarkMode ? "text-gray300" : "text-extraLightGray"
                }  text-[19px]  font-normal`}
              >
                Upvote
              </Text>
            </TouchableOpacity>
          )}

          {loading ? (
            <View
              className={`flex-row justify-start items-center pb-4 border-grayNeutral pt-4 gap-3 ${borderTouse}`}
            >
              <SimpleLineIcons
                name="dislike"
                size={20}
                color={isDarkMode ? COLORS.gray300 : COLORS.extraLightGray}
              />
              <Text
                className={`${
                  isDarkMode ? "text-gray300" : "text-extraLightGray"
                }  text-[19px]  font-normal`}
              >
                ...
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => reactToNews("downvote")}
              className={`flex-row justify-start items-center pb-4 border-grayNeutral pt-4 gap-3 ${borderTouse}`}
            >
              <SimpleLineIcons
                name="dislike"
                size={20}
                color={isDarkMode ? COLORS.gray300 : COLORS.extraLightGray}
              />
              <Text
                className={`${
                  isDarkMode ? "text-gray300" : "text-extraLightGray"
                }  text-[19px]  font-normal`}
              >
                Show less of this
              </Text>
            </TouchableOpacity>
          )}

          {saveLoading ? (
            <Pressable
              className={`flex-row justify-start items-center pb-4 border-grayNeutral pt-4 gap-3 ${borderTouse}`}
            >
              <MaterialCommunityIcons
                name="bookmark-multiple-outline"
                size={25}
                color={isDarkMode ? COLORS.gray300 : COLORS.extraLightGray}
              />
              <Text
                className={`${
                  isDarkMode ? "text-gray300" : "text-extraLightGray"
                }  text-[19px]  font-normal`}
              >
                ...
              </Text>
            </Pressable>
          ) : (
            <TouchableOpacity
              onPress={saveNews}
              className={`flex-row justify-start items-center pb-4 border-grayNeutral pt-4 gap-3 ${borderTouse}`}
            >
              <MaterialCommunityIcons
                name="bookmark-multiple-outline"
                size={25}
                color={isDarkMode ? COLORS.gray300 : COLORS.extraLightGray}
              />
              <Text
                className={`${
                  isDarkMode ? "text-gray300" : "text-extraLightGray"
                }  text-[19px]  font-normal`}
              >
                Save
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={flagNews}
            className={`flex-row justify-start items-center pb-4 border-grayNeutral pt-4 gap-3 ${borderTouse}`}
          >
            <Ionicons
              name="md-flag-outline"
              size={25}
              color={isDarkMode ? COLORS.gray300 : COLORS.extraLightGray}
            />
            <Text
              className={`${
                isDarkMode ? "text-gray300" : "text-extraLightGray"
              }  text-[19px]  font-normal`}
            >
              Flag News
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
