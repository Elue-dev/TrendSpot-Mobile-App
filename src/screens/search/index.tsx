import { View, Text, SafeAreaView, Image } from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import Search from "../../components/search";
import { News } from "../../types/news";
import NewsCard from "../../components/news/NewsCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../common/colors";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import Loader from "../../components/loader";
import CuateSVG from "../../assets/union.svg";

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [newsData, setNewsData] = useState<News[] | undefined>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInitiated, setSearchIntiated] = useState(false);
  const { isDarkMode } = useSheet();

  useEffect(() => {
    setNewsData(data);
  }, [loading, data]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          className={`${
            isDarkMode ? "text-gray300" : "text-primaryColorSec"
          }  font-semibold text-[18px]`}
        >
          Search
        </Text>
      ),
    });
  }, [isDarkMode]);

  if (loading) return <Loader />;

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-darkNeutral" : "bg-white"}`}
    >
      <Search
        newsFromComponent={newsData}
        setNewsData={setNewsData || undefined}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchInitiated={searchInitiated}
        setSearchIntiated={setSearchIntiated}
      />

      {!searchQuery ? (
        <>
          <View className="flex-1 justify-center items-center bg-white dark:bg-darkNeutral">
            {/* <Image
              source={require("../../assets/cuate.png")}
              className="h-80 w-80"
              style={{ resizeMode: "contain" }}
            /> */}
            <CuateSVG width={"90%"} height={300} />

            <Text className="text-darkNeutral dark:text-lightGray text-[19px] text-center mt-5 mx-3">
              Start searching some news by Title, Keywords or Categories!{" "}
              <Text className="text-gray-500">
                (news found are according to your interests)
              </Text>
            </Text>
          </View>
        </>
      ) : searchInitiated && newsData?.length === 0 ? (
        <View className="justify-center items-center pt-20">
          <View className="flex-row items-center gap-1 pb-2">
            <Text className="text-xl font-semibold text-grayText dark:text-lightText">
              No News found for
            </Text>
            <Text className="text-xl font-semibold text-primaryColor dark:text-primaryColorTheme">
              '{searchQuery}'
            </Text>
          </View>
          <Text className="text-xl font-bold text-grayText dark:text-lightText">
            Try searching something else.
          </Text>
          <Text className="text-base font-bold text-gray-500 dark:text-gray-400">
            (results are based on your interests)
          </Text>
        </View>
      ) : (
        <NewsCard dataToUse={newsData} location="search" />
      )}
    </SafeAreaView>
  );
}
