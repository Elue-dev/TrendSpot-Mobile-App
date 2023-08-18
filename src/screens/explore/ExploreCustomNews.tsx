import {
  View,
  Text,
  Platform,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { COLORS } from "../../common/colors";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import {
  Ionicons,
  SimpleLineIcons,
  FontAwesome5,
  Fontisto,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
import { News } from "../../types/news";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/loader";
import { formatTimeAgo } from "../../helpers";
import ServerError from "../../components/custom_news/server_error";
import { filterCustomNewsBySearchQuery } from "../../helpers/search.algorithm";
import CuateSVG from "../../assets/cuate.svg";
import { httpRequest } from "../../services";
import { categories } from "../../data/categories";

export default function ExploreCustomNews() {
  let originalNews: News[];
  const [externalNews, setExternalNews] = useState<News[]>([]);
  const [filterHasOccured, setFilterHasOccured] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCategory, setCurrentCategory] = useState("");
  const navigation = useNavigation<NavigationProp<any>>();
  const { isDarkMode } = useSheet();
  const modifiedCategories = ["All", ...categories];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]">
          Custom News
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

  const queryFn = async (): Promise<News[]> => {
    return httpRequest.get("/news").then((res) => {
      return res.data.news;
    });
  };
  const {
    data: news,
    isLoading,
    error,
    refetch,
  } = useQuery<News[]>(["customNews"], queryFn, {
    staleTime: 60000,
    refetchOnWindowFocus: false,
    onSuccess(data) {
      setExternalNews(data);
    },
  });

  if (isLoading) return <Loader />;
  if (error) return <ServerError refetch={refetch} />;

  originalNews = news!;

  useEffect(() => {
    if (searchQuery === "") setExternalNews(originalNews);
  }, [searchQuery]);

  useEffect(() => {
    const filteredNewsByCategory = originalNews.filter((news) =>
      news.category.includes(currentCategory)
    );

    const newsToUse =
      currentCategory === "All" ? originalNews : filteredNewsByCategory;

    setExternalNews(newsToUse);
    setFilterHasOccured(true);
  }, [currentCategory]);

  if (isLoading) return <Loader />;
  if (error) return <ServerError refetch={refetch} />;

  return (
    <ScrollView
      className="flex-1 bg-[#f8f8f8] dark:bg-darkNeutral"
      showsVerticalScrollIndicator={false}
    >
      <View className="px-3 pt-8 pb-5">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={modifiedCategories}
          keyExtractor={(categories) => categories}
          renderItem={({ item: category }) => (
            <TouchableOpacity
              onPress={() => setCurrentCategory(category)}
              className="mr-2"
            >
              <View
                className={`p-3 border-[2px] border-primaryColorLighter rounded-lg 
                ${
                  currentCategory === category
                    ? "bg-primaryColor dark:bg-primaryColorTheme"
                    : "bg-transparent"
                }`}
              >
                <Text
                  className={`${
                    currentCategory === category
                      ? "text-lightText"
                      : "text-primaryColor dark:text-primaryColorTheme"
                  }  font-bold`}
                >
                  {category}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {filterHasOccured &&
        externalNews.length !== 0 &&
        currentCategory !== "All" && (
          <View>
            <Text className="text-darkNeutral dark:text-lightText text-center text-base">
              {externalNews.length} news found on{" "}
              <Text className="font-bold">'{currentCategory}'</Text>
            </Text>
          </View>
        )}

      {externalNews.length === 0 && filterHasOccured ? (
        <View className="mt-2">
          <CuateSVG width={"90%"} height={300} />
          <Text className="text-darkNeutral dark:text-lightGray text-[19px] text-center mt-5 mx-3">
            No news found for '
            <Text className="text-primaryColor dark:text-primaryColorTheme">
              {currentCategory}
            </Text>
            '
          </Text>
          <Text className="text-authDark dark:text-lightGray text-[19px] text-center mt-1 mx-3">
            Try searching something else
          </Text>
        </View>
      ) : (
        <View className="mb-20 mx-2">
          <FlatList
            keyExtractor={(externalNews) => externalNews.title}
            data={externalNews}
            scrollEnabled={false}
            renderItem={({ item: news }) => (
              <View className="overflow-hidden border dark:border bg-white dark:bg-transparent border-gray-200 dark:border-lightBorder shadow-lg mt-[11px] rounded-lg">
                <View className="gap-2">
                  <View className="w-full">
                    <Image
                      source={{ uri: news.image }}
                      className="h-44 w-full rounded-lg bg-primaryColorDisabled"
                      resizeMode="cover"
                    />
                  </View>
                  <View className="flex-col justify-around gap-1 p-1 mx-1">
                    <View className="flex-row justify-between items-center mb-2">
                      <View
                        className="rounded-lg"
                        style={{ backgroundColor: "rgba(0,0,0,.7)" }}
                      >
                        <Text className="text-white py-[3px] px-[5px] font-semibold text-sm">
                          {news.category}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("CustomNewsDetails", { news })
                        }
                      >
                        <SimpleLineIcons
                          name="eye"
                          size={22}
                          color={COLORS.authDark}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text className="text-[17px] font-semibold leading-5 text-darkNeutral dark:text-lightText">
                      {news.title}
                    </Text>

                    <Text className="text-[15px] font-light mt-2 leading-6 text-darkNeutral dark:text-lightText">
                      {news.content.slice(0, 200)}...
                    </Text>
                    <View className="flex-row items-center justify-between gap-1 pt-2 pb-4">
                      <View className="flex-row items-center">
                        <Fontisto
                          name="date"
                          size={16}
                          color={
                            isDarkMode
                              ? COLORS.primaryColorTheme
                              : COLORS.primaryColor
                          }
                        />
                        <Text className="text-darkNeutral dark:text-lightText ml-1">
                          {formatTimeAgo(news.createdAt).includes("about")
                            ? formatTimeAgo(news.createdAt).split("about")[1]
                            : formatTimeAgo(news.createdAt)}
                        </Text>
                      </View>

                      {news.author && (
                        <View className="flex-row items-center gap-1">
                          <FontAwesome5
                            name="user-alt"
                            size={14}
                            color={
                              isDarkMode
                                ? COLORS.primaryColorTheme
                                : COLORS.primaryColor
                            }
                          />
                          <Text className="text-darkNeutral dark:text-lightText">
                            {news.author.firstName} {news.author.lastName}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </ScrollView>
  );
}
