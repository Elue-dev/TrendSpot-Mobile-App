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
import { COLORS } from "../../common/colors";
import Loader from "../../components/loader";
import { useAuth } from "../../context/auth/AuthContext";
import { interests } from "../../data/interests";
import CuateSVG from "../../assets/cuate.svg";
import Header from "../../components/header";
import ExternalNews from "../../components/exteral_news";
import CustomNews from "../../components/custom_news";
import { News } from "../../types/news";

export default function HomeScreen() {
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
    <SafeAreaView className="flex-1 bg-white dark:bg-darkNeutral">
      <Header />
      <View className="h-4" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ExternalNews />
        <CustomNews />
      </ScrollView>
    </SafeAreaView>
  );
}
