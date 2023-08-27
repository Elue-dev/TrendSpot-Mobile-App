import { View, Text, TouchableOpacity } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import SVG1 from "../../assets/cuate.svg";
import SVG2 from "../../assets/rafiki.svg";
import SVG3 from "../../assets/union.svg";
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import { MaterialIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { COLORS } from "../../common/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OnboardingScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const onboardingRef = useRef<Onboarding | any>(null);
  const { isDarkMode } = useSheet();

  async function handleOnboardingFinish() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "CreateAccountStart" }],
      })
    );
    await AsyncStorage.setItem("userHasOnboarded", "true");
  }

  function indicatorComponent({ selected }: any) {
    return (
      <View
        className={`w-4 h-4 flex items-center justify-center rounded-full p-2 ${
          selected ? "border border-primaryColor" : ""
        }`}
      >
        <View
          className={`w-2 h-2 rounded-full ${
            selected ? "bg-primaryColor" : "bg-primaryColorDisabled"
          }`}
        ></View>
      </View>
    );
  }

  return (
    <Onboarding
      ref={onboardingRef}
      DotComponent={indicatorComponent}
      titleStyles={{
        fontFamily: "rubikSB",
        color: isDarkMode ? COLORS.grayNeutral : COLORS.primaryColorSec,
      }}
      subTitleStyles={{
        marginLeft: 19,
        fontSize: 16,
        textAlign: "center",
        maxWidth: "90%",
        color: isDarkMode ? COLORS.gray300 : COLORS.primaryColorSec,
        lineHeight: 23,
      }}
      SkipButtonComponent={() => (
        <TouchableOpacity
          onPress={() => onboardingRef.current?.goToPage(2, true)}
          className="flex-row items-center"
        >
          <Text
            style={{ fontFamily: "rubikSB" }}
            className="ml-2 text-[18px] text-darkNeutral dark:text-lightText"
          >
            Skip
          </Text>
          <MaterialIcons
            name="double-arrow"
            size={15}
            color={isDarkMode ? COLORS.lightText : COLORS.darkNeutral}
          />
        </TouchableOpacity>
      )}
      NextButtonComponent={() => (
        <TouchableOpacity onPress={() => onboardingRef.current?.goNext()}>
          <Text
            style={{ fontFamily: "rubikSB" }}
            className="mr-2 text-[18px] text-darkNeutral dark:text-lightText"
          >
            Next
          </Text>
        </TouchableOpacity>
      )}
      DoneButtonComponent={() => (
        <TouchableOpacity onPress={handleOnboardingFinish}>
          <Text
            style={{ fontFamily: "rubikSB" }}
            className="mr-2 text-[18px] text-darkNeutral dark:text-lightText"
          >
            Get Started
          </Text>
        </TouchableOpacity>
      )}
      pages={[
        {
          backgroundColor: isDarkMode ? COLORS.darkNeutral : COLORS.shadowWhite,
          image: <SVG1 width={"100%"} height={290} />,
          title: "Welcome to TrendSpot",
          subtitle:
            "Stay Updated with the Latest News from across different sectors.",
        },
        {
          backgroundColor: isDarkMode ? COLORS.darkNeutral : COLORS.shadowWhite,
          image: <SVG2 width={"100%"} height={290} />,
          title: "Read and Discuss",
          subtitle:
            "Join discussions and share articles with friends, making news more interactive.",
        },
        {
          backgroundColor: isDarkMode ? COLORS.darkNeutral : COLORS.shadowWhite,
          image: <SVG3 width={"100%"} height={290} />,
          title: "Explore Different Categories",
          subtitle:
            "From Tech to Sports, Politics to Entertainment, we've got you covered.",
        },
      ]}
    />
  );
}
