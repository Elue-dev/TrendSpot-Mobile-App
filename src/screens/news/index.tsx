import { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Button,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import NewsCard from "../../components/news/NewsCard";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import BottomSheetComponent from "../../components/bottom_sheet";
import { SharedElement } from "react-native-shared-element";
import { News } from "../../types/news";
import { COLORS } from "../../common/colors";
import Loader from "../../components/loader";
import { useAuth } from "../../context/auth/AuthContext";
import { interests } from "../../data/interests";
import CuateSVG from "../../assets/cuate.svg";
import Header from "../../components/header";
import ExternalNews from "../../components/exteral_news";

export default function NewsScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [newsData, setNewsData] = useState<any[]>([]);
  const [dataToUse, setDataToUse] = useState<News[]>([]);
  const [selectedOption, setSelectedOption] = useState("VerfiedAndUnverified");
  const modifiedInterests = ["All", ...interests];
  const {
    state: { user },
    selectedInterest,
    setSelectedInterest,
  } = useAuth();

  const {
    state: { bottomSheetOpen },
    isDarkMode,
    toggleBottomSheet,
    toggleOverlay,
  } = useSheet();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const filteredNews: News[] = newsData.filter(
      (news) =>
        news.category === selectedInterest ||
        news.category.toLowerCase().includes(selectedInterest.toLowerCase())
    );
    const newsToUse = selectedInterest === "All" ? newsData : filteredNews;
    setDataToUse(newsToUse);
  }, [selectedInterest]);

  async function resetOnboarding() {
    await AsyncStorage.removeItem("userHasOnboarded");
    navigation.navigate("Onboarding");
  }

  function handleBottomSheetActions() {
    toggleBottomSheet();
    toggleOverlay();
  }

  if (loading) return <Loader />;

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-darkNeutral" : "bg-white"} `}
    >
      <Header />
      <ExternalNews />
      {/* {selectedInterest !== "All" && dataToUse.length === 0 ? (
        <View className="mx-4 mt-4">
          <CuateSVG width={"90%"} height={300} />
          <Text className="pt-8 text-xl text-center text-extraLightGray dark:text-grayNeutral">
            No news found with category {selectedInterest}{" "}
            {selectedOption !== "VerfiedAndUnverified" &&
              (selectedOption === "UnVerfiedOnly"
                ? "that is unverified"
                : selectedOption === "VerfiedOnly"
                ? "that is verified"
                : null)}
          </Text>
          {selectedOption === "VerfiedAndUnverified" && user ? (
            <View>
              <Text className="pt-2 text-base text-center text-extraLightGray dark:text-grayNeutral">
                Either there are no news on {selectedInterest} or{" "}
                {selectedInterest} is not among your interests.
              </Text>

              <View className="mt-4">
                {Platform.OS === "android" ? (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ManageInterests")}
                    className="py-3 rounded-md bg-trasparent border border-primaryColor dark:border-primaryColorTheme"
                  >
                    <Text className="text-primaryColor dark:text-primaryColorTheme font-semibold text-center text-xl">
                      Manage interests
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Button
                    title="Manage interests"
                    onPress={() => navigation.navigate("ManageInterests")}
                    color={
                      isDarkMode
                        ? COLORS.primaryColorTheme
                        : COLORS.primaryColor
                    }
                  />
                )}
              </View>
            </View>
          ) : null}
        </View>
      ) : (
        <View className="pt-3 pb-20" style={{ zIndex: -1 }}>
          <NewsCard
            dataToUse={dataToUse}
            setDataToUse={setDataToUse}
            location=""
          />
        </View>
      )} */}
    </SafeAreaView>
  );
}
