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
  Ionicons,
} from "@expo/vector-icons";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { News } from "../../types/news";
import RafikiSVG from "../../assets/rafiki.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NewsParams {
  news: News[];
}

export default function Search() {
  const { news } = useRoute().params as NewsParams;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNews, setFilteredNews] = useState<undefined | News[]>([]);
  const [userRecentSearchHistory, setUserRecentSearchHistory] = useState<
    string[] | null
  >(null);
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
            <Ionicons
              name="arrow-back-circle"
              size={29}
              color={COLORS.gray200}
            />
          </TouchableOpacity>
        ) : null,
    });
  }, [isDarkMode]);

  useEffect(() => {
    const newsBySearchQuery = news.filter(
      (n: News) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredNews(newsBySearchQuery);
  }, [searchQuery]);

  useEffect(() => {
    (async function getUserSearchHistory() {
      const userSearchHistory = await AsyncStorage.getItem("userSearches");
      const parsedUserSearchHistory = JSON.parse(userSearchHistory!);
      if (!parsedUserSearchHistory) return;
      setUserRecentSearchHistory(parsedUserSearchHistory?.slice(0, 4));
    })();
  }, []);

  async function pushSearchToUserSearchHistory() {
    if (searchQuery === "") return;
    const userRecentSearches = await AsyncStorage.getItem("userSearches");
    if (userRecentSearches) {
      const parsedSearches = JSON.parse(userRecentSearches);
      let userRecentSearchesWithoutCurrentSearch;
      if (userRecentSearches.includes(searchQuery)) {
        userRecentSearchesWithoutCurrentSearch = parsedSearches.filter(
          (search: string) => search !== searchQuery
        );
      }
      const updatedSearchHistory = [
        searchQuery,
        ...userRecentSearchesWithoutCurrentSearch,
      ];
      await AsyncStorage.setItem(
        "userSearches",
        JSON.stringify(updatedSearchHistory)
      );
    } else {
      const newSearchArray = [];
      newSearchArray.push(searchQuery);
      await AsyncStorage.setItem(
        "userSearches",
        JSON.stringify(newSearchArray)
      );
    }
  }

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
            <TouchableOpacity onPress={() => setSearchQuery("")}>
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
                      pushSearchToUserSearchHistory();
                    }}
                    className="shadow-sm rounded-md bg-white dark:bg-darkCard px-2 py-3 mb-1"
                  >
                    <View className="flex-row items-center gap-2">
                      <Image
                        source={{ uri: news.image }}
                        className="w-10 h-12 rounded-lg object-cover bg-primaryColorDisabled"
                      />
                      <Text
                        style={{ fontFamily: "rubikB" }}
                        className="text-darkNeutral dark:text-lightText w-80"
                      >
                        {news.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        )}

        {userRecentSearchHistory !== null && !searchQuery && (
          <View className="pt-6">
            <Text
              style={{ fontFamily: "rubikB" }}
              className="text-darkNeutral dark:text-lightText text-[17px]"
            >
              Some Recent Searches
            </Text>
            <View className="shadow-sm rounded-md  bg-white dark:bg-darkCard mb-[2px] p-2 mt-2">
              {userRecentSearchHistory?.map((searchString, idx) => (
                <View
                  key={idx}
                  className={`${
                    userRecentSearchHistory.length === 1 ? "mb-2" : "mb-4"
                  }`}
                >
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
                        className="text-darkNeutral dark:text-lightText ml-1 text-[16px]"
                      >
                        {searchString}
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => {
                        setSearchQuery(searchString);
                        pushSearchToUserSearchHistory();
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
