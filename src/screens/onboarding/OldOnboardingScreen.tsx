import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from "react-native";
import { useRef, useState } from "react";
import { screensData } from "./screensData";
import { onBoardingScreensdata } from "../../types";
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../types/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./styles";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { COLORS } from "../../common/colors";
import SVG1 from "../../assets/cuate.svg";
import SVG2 from "../../assets/rafiki.svg";
import SVG3 from "../../assets/union.svg";

export default function OnboardingScreenOld() {
  const { width, height } = Dimensions.get("window");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const flatListRef = useRef<FlatList<onBoardingScreensdata>>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isDarkMode } = useSheet();

  function updateCurrentSlideIndex(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  }

  function goToNextSlide() {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex !== screensData.length) {
      const offset = nextSlideIndex * width;
      flatListRef?.current?.scrollToOffset({ offset });
    }
  }

  function skipOnboarding() {
    const lastSlideIndex = screensData.length - 1;
    const offset = lastSlideIndex * width;
    flatListRef?.current?.scrollToOffset({ offset });

    setCurrentSlideIndex(lastSlideIndex);
  }

  async function initiateAccountCreation() {
    await AsyncStorage.setItem("userHasOnboarded", "true");
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "CreateAccountStart" }],
      })
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-darkNeutral">
      {currentSlideIndex !== screensData.length - 1 && (
        <TouchableOpacity
          onPress={skipOnboarding}
          className={`flex-row justify-end items-center  gap-1 ${
            Platform.OS === "ios" ? "mt-5" : "mt-12"
          }`}
        >
          <Text
            style={{ fontFamily: "rubikREG" }}
            className="text-right text-primaryColorTheme dark:text-primaryColorTheme text-xl"
          >
            Skip
          </Text>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={30}
            color={isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor}
          />
        </TouchableOpacity>
      )}
      <FlatList
        ref={flatListRef}
        data={screensData}
        keyExtractor={(screensData) => screensData.id.toString()}
        contentContainerStyle={{ height: height * 0.75, marginTop: 100 }}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        renderItem={({ item, index }) => (
          <View style={{ width }} key={item.id}>
            {index === 0 ? (
              <SVG1 width={"100%"} height={290} />
            ) : index === 1 ? (
              <SVG2 width={"100%"} height={290} />
            ) : (
              <SVG3 width={"100%"} height={290} />
            )}
            <Text
              style={[
                styles.titleText,
                {
                  fontFamily: "rubikSB",
                },
                isDarkMode
                  ? { color: COLORS.grayNeutral }
                  : { color: COLORS.primaryColorSec },
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                styles.subTitle,
                {
                  fontFamily: "rubikREG",
                },
                isDarkMode
                  ? { color: COLORS.gray300 }
                  : { color: COLORS.primaryColorSec },
              ]}
            >
              {item.subTitle}
            </Text>

            {Platform.OS === "ios" ? (
              <View style={styles.slidesWrap}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  {screensData.map((_, index) => (
                    <View
                      style={[
                        styles.indicator,
                        isDarkMode
                          ? { borderColor: COLORS.primaryColorTheme }
                          : { borderColor: COLORS.primaryColor },
                        currentSlideIndex === index && {
                          backgroundColor: isDarkMode ? "#CE5158" : "#C2262E",
                          width: 28,
                        },
                      ]}
                      key={index}
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.btn,
                    isDarkMode
                      ? { backgroundColor: COLORS.primaryColorTheme }
                      : { backgroundColor: COLORS.primaryColor },
                  ]}
                  onPress={
                    currentSlideIndex === screensData.length - 1
                      ? initiateAccountCreation
                      : goToNextSlide
                  }
                >
                  <View className="flex-col justify-center items-center">
                    <Text className="text-center text-white font-bold text-xl">
                      {currentSlideIndex === screensData.length - 1
                        ? "Get Started"
                        : "Next"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.slidesWrapA}>
                <View
                  style={{
                    marginBottom: 30,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    {screensData.map((_, index) => (
                      <View
                        style={[
                          styles.indicator,
                          isDarkMode
                            ? { borderColor: COLORS.primaryColorTheme }
                            : { borderColor: COLORS.primaryColor },
                          currentSlideIndex === index && {
                            backgroundColor: isDarkMode ? "#CE5158" : "#C2262E",
                            width: 28,
                          },
                        ]}
                        key={index}
                      />
                    ))}
                  </View>
                </View>

                {currentSlideIndex === screensData.length - 1 && (
                  <TouchableOpacity
                    style={[
                      styles.btn,
                      isDarkMode
                        ? { backgroundColor: COLORS.primaryColorTheme }
                        : { backgroundColor: COLORS.primaryColor },
                    ]}
                    onPress={
                      currentSlideIndex === screensData.length - 1
                        ? initiateAccountCreation
                        : goToNextSlide
                    }
                  >
                    <View className="flex-col justify-center items-center">
                      <Text
                        style={{ fontFamily: "rubikSB" }}
                        className="text-center text-white font-bold text-xl"
                      >
                        {currentSlideIndex === screensData.length - 1
                          ? "Get Started"
                          : "Next"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}
