import {
  View,
  Text,
  Platform,
  ScrollView,
  TextInput,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLORS } from "../../common/colors";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { News } from "../../types/news";
import RafikiSVG from "../../assets/rafiki.svg";

interface NewsParams {
  news: News[];
}

export default function Search() {
  const { news } = useRoute().params as NewsParams;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNews, setFilteredNews] = useState<undefined | News[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(true);
  const navigation = useNavigation<NavigationProp<any>>();
  const { isDarkMode } = useSheet();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{ fontFamily: "rubikSB" }}
          className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]"
        >
          Search News
        </Text>
      ),

      headerLeft: () =>
        Platform.OS === "ios" ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="closecircle" size={23} color={COLORS.gray200} />
          </TouchableOpacity>
        ) : null,
    });
  }, [isDarkMode]);

  const recentSearches = ["ios", "AI", "Technology"];

  useEffect(() => {
    const newsBySearchQuery = news.filter(
      (n: News) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredNews(newsBySearchQuery);
  }, [searchQuery]);

  return (
    <ScrollView className="bg-shadowWhite dark:bg-darkNeutral">
      <View className="mx-3">
        <View
          className={`mt-8 px-3 pb-4 shadow-sm rounded-lg flex-row justify-between items-center border-gray100 dark:border-gray200 ${
            Platform.OS === "android" ? "border-4 dark:border" : "border"
          }`}
          style={{
            elevation: 1,
            backgroundColor: isDarkMode ? "transparent" : "#FFF",
          }}
        >
          <TextInput
            value={searchQuery}
            onChangeText={(value) => setSearchQuery(value)}
            className="text-base h-full mt-2 text-darkNeutral dark:text-grayNeutral w-[90%]"
            placeholder="Search news by title, category"
            placeholderTextColor={isDarkMode ? "white" : COLORS.grayText}
            selectionColor={
              isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor
            }
          />

          {searchQuery && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                setShowRecentSearches(true);
              }}
            >
              <MaterialIcons
                name="clear"
                size={28}
                color={isDarkMode ? "#E5E5EA" : COLORS.authDark}
                style={{ paddingTop: 10 }}
              />
            </TouchableOpacity>
          )}
        </View>

        {searchQuery && (
          <View className="mt-4">
            {filteredNews?.length === 0 && searchQuery ? (
              <View className="mt-4">
                <RafikiSVG width={"90%"} height={300} />
                <Text
                  style={{ fontFamily: "rubikREG" }}
                  className="text-xl text-center pb-1 text-darkNeutral dark:text-lightGray"
                >
                  No news found for{" "}
                  <Text
                    style={{ fontFamily: "rubikB" }}
                    className="text-primaryColorTheme"
                  >
                    '{searchQuery}'
                  </Text>
                </Text>
                <Text
                  style={{ fontFamily: "rubikREG" }}
                  className="text-xl text-center text-darkNeutral dark:text-lightText"
                >
                  Try Searching something else
                </Text>
              </View>
            ) : (
              <FlatList
                keyExtractor={(filteredNews) => filteredNews.id}
                data={filteredNews}
                scrollEnabled={false}
                renderItem={({ item: news }) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.goBack();
                      navigation.navigate("CustomNewsDetails", { news });
                    }}
                    className="shadow-sm rounded-md  bg-white dark:bg-darkCard p-2 mb-1"
                  >
                    <View className="flex-row items-center gap-2">
                      <Image
                        source={{ uri: news.image }}
                        className="w-12 h-10 rounded-lg object-cover"
                      />
                      <Text
                        style={{ fontFamily: "rubikB" }}
                        className="text-darkNeutral dark:text-lightText w-80"
                      >
                        {news.title}
                      </Text>
                      <Text
                        style={{ fontFamily: "rubikB" }}
                        className="text-darkNeutral dark:text-lightText w-80"
                      >
                        Category:{" "}
                        <Text className="text-primaryColorTheme">
                          {news.category}
                        </Text>
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        )}
        {showRecentSearches && !searchQuery && (
          <View className="pt-6">
            <Text
              style={{ fontFamily: "rubikB" }}
              className="text-darkNeutral dark:text-lightText"
            >
              Recent Searches
            </Text>
            <View className="shadow-sm rounded-md  bg-white dark:bg-darkCard mb-[2px] p-2 mt-2">
              {recentSearches.map((searchString, idx) => (
                <View key={idx} className="mb-3">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <MaterialIcons
                        name="youtube-searched-for"
                        size={20}
                        color={
                          isDarkMode ? COLORS.authDark : COLORS.darkNeutral
                        }
                      />
                      <Text
                        style={{ fontFamily: "rubikREG" }}
                        className="text-darkNeutral dark:text-lightText ml-1"
                      >
                        {searchString}
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => {
                        setShowRecentSearches(false);
                        setSearchQuery(searchString);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="arrow-up-right"
                        size={20}
                        color={isDarkMode ? COLORS.gray50 : COLORS.darkNeutral}
                      />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
