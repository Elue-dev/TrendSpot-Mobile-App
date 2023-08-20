import { View, Text, Platform, ScrollView, Image } from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { COLORS } from "../../common/colors";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import {
  Ionicons,
  SimpleLineIcons,
  FontAwesome5,
  Fontisto,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { News } from "../../types/news";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/loader";
import { formatTimeAgo } from "../../helpers";
import ServerError from "../../components/custom_news/server_error";
import CuateSVG from "../../assets/cuate.svg";
import { httpRequest } from "../../services";
import { parseText } from "../../utils";

interface CategoryParams {
  selectedCategories?: string[] | string;
}

export default function ExploreCustomNews() {
  let originalNews: News[];
  const { selectedCategories } = useRoute().params as CategoryParams;
  const [customNews, setCustomNews] = useState<News[]>([]);

  const navigation = useNavigation<NavigationProp<any>>();
  const { isDarkMode } = useSheet();

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
      setCustomNews(data);
    },
  });

  useEffect(() => {
    const newsBySelectedCategories = news?.filter((currNews) =>
      selectedCategories?.includes(currNews.category)
    );

    const newsToUse =
      selectedCategories === "All" ? originalNews : newsBySelectedCategories;

    setCustomNews(newsToUse!);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{ fontFamily: "rubikSB" }}
          className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]"
        >
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

      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <FontAwesome name="search" size={24} color={COLORS.gray200} />
        </TouchableOpacity>
      ),
    });
  }, [isDarkMode]);

  useEffect(() => {
    // categoriesFromRoute
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <ServerError refetch={refetch} />;

  originalNews = news!;

  return (
    <View className="flex-1 bg-[#f8f8f8] dark:bg-darkNeutral">
      <View className="px-3 pt-4 pb-4">
        {selectedCategories === "All" ? (
          <Text
            style={{ fontFamily: "rubikREG" }}
            className="text-darkNeutral dark:text-lightText text-[17px] leading-6"
          >
            Showing{" "}
            <Text className="text-primaryColorTheme">All Categories</Text> of
            News
          </Text>
        ) : (
          <>
            {customNews.length > 0 && (
              <Text
                style={{ fontFamily: "rubikREG" }}
                className="text-darkNeutral dark:text-lightText text-[17px] leading-6"
              >
                Showing news results for{" "}
                <Text className="text-primaryColorTheme">
                  {Array.isArray(selectedCategories) &&
                    selectedCategories?.join(", ")}
                </Text>
              </Text>
            )}
          </>
        )}
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {customNews.length === 0 ? (
          <View className="mt-2">
            <CuateSVG width={"90%"} height={300} />
            <Text
              style={{ fontFamily: "rubikSB" }}
              className="text-darkNeutral dark:text-lightGray text-center text-[19px] mt-5 mx-3"
            >
              No news found for '
              <Text className="text-primaryColor dark:text-primaryColorTheme font-bold">
                {Array.isArray(selectedCategories) &&
                  selectedCategories?.join(", ")}
              </Text>
              '
            </Text>
            <Text
              style={{ fontFamily: "rubikREG" }}
              className="text-authDark dark:text-lightGray text-[19px] text-center mt-2 mx-3"
            >
              Try searching something else
            </Text>
          </View>
        ) : (
          <View className="mb-20 mx-2">
            <FlatList
              keyExtractor={(customNews) => customNews.title}
              data={customNews}
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
                          <Text
                            style={{ fontFamily: "rubikSB" }}
                            className="text-white py-[3px] px-[5px] font-semibold text-sm"
                          >
                            {news.category}
                          </Text>
                        </View>

                        <TouchableOpacity
                          onPress={() => {
                            navigation.goBack();
                            navigation.navigate("CustomNewsDetails", { news });
                          }}
                        >
                          <SimpleLineIcons
                            name="eye"
                            size={22}
                            color={COLORS.authDark}
                          />
                        </TouchableOpacity>
                      </View>
                      <Text
                        style={{ fontFamily: "rubikSB" }}
                        className="text-[17px] font-semibold leading-6 text-darkNeutral dark:text-lightText"
                      >
                        {news.title}
                      </Text>

                      <Text
                        style={{ fontFamily: "rubikL" }}
                        className="text-[15px] font-light mt-2 leading-6 text-darkNeutral dark:text-lightText"
                      >
                        {news.content.includes("<div>")
                          ? `${parseText(news.content.slice(0, 300))}...`
                          : news.content.slice(0, 150)}
                        ...
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
                          <Text
                            style={{ fontFamily: "rubikREG" }}
                            className="text-darkNeutral dark:text-lightText ml-1"
                          >
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
                            <Text
                              style={{ fontFamily: "rubikREG" }}
                              className="text-darkNeutral dark:text-lightText"
                            >
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
    </View>
  );
}
