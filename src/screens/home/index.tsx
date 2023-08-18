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
import { categories } from "../../data/categories";
import CuateSVG from "../../assets/cuate.svg";
import Header from "../../components/header";
import ExternalNews from "../../components/exteral_news";
import CustomNews from "../../components/custom_news";
import { News } from "../../types/news";
import { RefreshControl } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";

export default function HomeScreen() {
  const [refresh, setRefresh] = useState(false);
  const { isDarkMode } = useSheet();
  const queryClient = useQueryClient();

  function handleRefresh() {
    setRefresh(true);
    queryClient.invalidateQueries(["customNews"]);
    queryClient.invalidateQueries(["externalNews"]);

    setTimeout(() => setRefresh(false), 5000);
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f0f0f0] dark:bg-darkNeutral">
      <Header />
      <View className="h-4" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={handleRefresh}
            progressBackgroundColor={
              isDarkMode ? COLORS.primaryColor : COLORS.primaryColorTheme
            }
            tintColor={
              isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor
            }
          />
        }
      >
        <ExternalNews />
        <CustomNews />
      </ScrollView>
    </SafeAreaView>
  );
}
