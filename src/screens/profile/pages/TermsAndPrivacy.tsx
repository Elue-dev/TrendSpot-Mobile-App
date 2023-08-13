import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamList } from "../../../types/navigation";
import { useLayoutEffect, useState } from "react";
import { useSheet } from "../../../context/bottom_sheet/BottomSheetContext";
import CustomLeftHeader from "../../../helpers/CustomLeftHeader";
import TermsOfUse from "../../../components/terms_and_privacy/TermsOfUse";
import PrivacyPolicy from "../../../components/terms_and_privacy/PrivacyPolicy";
import { COLORS } from "../../../common/colors";

interface PageParams {
  defaultTitle: string;
}

export default function TermsAndPrivacy() {
  const { defaultTitle } = useRoute().params as PageParams;
  const [currentTitle, setCurrentTitle] = useState(defaultTitle);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isDarkMode } = useSheet();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]">
          Terms and Privacy Policy
        </Text>
      ),

      headerLeft: () =>
        isDarkMode && Platform.OS === "ios" ? <CustomLeftHeader /> : null,
    });
  }, [isDarkMode]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-darkNeutral">
      <View className="pt-6 mx-3">
        <View className="flex-row p-[5px] bg-grayNeutral dark:bg-dark justify-around items-center rounded-lg mt-5 overflow-hidden">
          {["Terms Of Use", "Privacy Policy"].map((title) => (
            <TouchableOpacity
              onPress={() => setCurrentTitle(title)}
              key={title}
              className={`py-1 px-12 rounded-lg ${
                currentTitle === title && isDarkMode
                  ? "bg-authDark"
                  : currentTitle === title && !isDarkMode
                  ? "bg-white"
                  : ""
              }`}
            >
              <Text
                className={`text-center text-sm dark:text-white ${
                  currentTitle === title ? "font-bold" : "font-semibold"
                } `}
              >
                {title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View
          className="shadow-lg"
          style={{
            height: 12,
            elevation: 1,
            backgroundColor: isDarkMode
              ? COLORS.darkNeutral
              : "rgba(255, 255, 255, 0.9)",
          }}
        />

        {currentTitle === "Terms Of Use" ? <TermsOfUse /> : <PrivacyPolicy />}
      </View>
    </SafeAreaView>
  );
}
