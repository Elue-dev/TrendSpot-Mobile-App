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
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { ExternalNewsI } from "../../types/news";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/loader";
import { formatTimeAgo } from "../../helpers";
import ServerError from "../../components/custom_news/server_error";
import { filterNewsBySearchQuery } from "../../helpers/search.algorithm";
import CuateSVG from "../../assets/cuate.svg";
import CustomLeftHeader from "../../helpers/CustomLeftHeader";

const apiKey = "48f6f47da09747cda4b6e8cbb903d4d1";
const apiUrl = `https://newsapi.org/v2/top-headlines`;
const params = {
  apiKey,
  country: "us",
  category: "general",
};

export default function ExploreExternalNews() {
  let originalNews: ExternalNewsI[];
  const [externalNews, setExternalNews] = useState<ExternalNewsI[]>([]);
  const [searchHasOccured, setSearchHasOccured] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation<NavigationProp<any>>();
  const { isDarkMode } = useSheet();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{ fontFamily: "rubikSB" }}
          className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]"
        >
          External News
        </Text>
      ),

      headerLeft: () => <CustomLeftHeader />,
    });
  }, [isDarkMode]);

  const queryFn = async function () {
    return axios.get(apiUrl, { params }).then((response) => {
      return response.data.articles;
    });
  };

  const { data, isLoading, error, refetch } = useQuery<ExternalNewsI[]>(
    [`customnews`],
    queryFn,
    {
      staleTime: 60000,
      refetchOnWindowFocus: false,
      onSuccess(data) {
        setExternalNews(data);
      },
    }
  );

  originalNews = data!;
  useEffect(() => {
    if (searchQuery === "") setExternalNews(originalNews);
  }, [searchQuery]);

  if (isLoading) return <Loader />;
  if (error) return <ServerError refetch={refetch} />;

  return (
    <ScrollView
      className="flex-1 bg-[#f8f8f8] dark:bg-darkNeutral"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row items-center mb-1">
        <View
          className={`mt-8 px-3 pb-4 mx-4 shadow-sm bg-white rounded-lg flex-row justify-between items-center border-gray100 dark:border-gray200 ${
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
            className="text-base h-8 mt-2 text-darkNeutral dark:text-grayNeutral w-[90%]"
            placeholder="Search by title, keywords, sources"
            placeholderTextColor={isDarkMode ? "white" : COLORS.grayText}
            selectionColor={
              isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor
            }
          />
        </View>
        {searchHasOccured ? (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery("");
              setSearchHasOccured(false);
            }}
          >
            <AntDesign
              name="closecircleo"
              size={33}
              color={isDarkMode ? "#E5E5EA" : COLORS.authDark}
              style={{ paddingTop: 27, marginLeft: -8 }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              searchQuery &&
                filterNewsBySearchQuery(
                  externalNews!,
                  searchQuery,
                  setExternalNews,
                  setSearchHasOccured
                );
            }}
          >
            <FontAwesome
              name="send"
              size={30}
              color={isDarkMode ? "#E5E5EA" : COLORS.authDark}
              style={{ paddingTop: 24, marginLeft: -5 }}
            />
          </TouchableOpacity>
        )}
      </View>
      {externalNews.length === 0 && searchHasOccured ? (
        <View className="mt-2">
          <CuateSVG width={"90%"} height={300} />
          <Text
            style={{ fontFamily: "rubikREG" }}
            className="text-darkNeutral dark:text-lightGray text-[19px] text-center mt-5 mx-3"
          >
            No news found for '
            <Text className="text-primaryColor dark:text-primaryColorTheme">
              {searchQuery}
            </Text>
            '
          </Text>
          <Text
            style={{ fontFamily: "rubikREG" }}
            className="text-authDark dark:text-lightGray text-[19px] text-center mt-1 mx-3"
          >
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
              <View className="border-x dark:border bg-white dark:bg-transparent border-x-gray-200 dark:border-lightBorder shadow-lg px-2 py-4 mt-[5px] rounded-lg">
                <View className="flex-row gap-2">
                  <View className="w-[25%]">
                    <Image
                      source={{ uri: news.urlToImage }}
                      className="h-32 w-22 rounded-lg bg-primaryColorDisabled"
                      resizeMode="cover"
                    />
                  </View>

                  <View className="w-[70%] flex-col justify-around">
                    <View className="flex-row justify-between items-center mb-2">
                      <View
                        className="rounded-lg"
                        style={{ backgroundColor: "rgba(0,0,0,.7)" }}
                      >
                        <Text
                          style={{ fontFamily: "rubikSB" }}
                          className="text-white py-[3px] px-[5px] font-semibold text-sm"
                        >
                          {news.source.name}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("ExternalNewsDetails", { news })
                        }
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
                      className="text-[17px] font-semibold leading-5 text-darkNeutral dark:text-lightText"
                    >
                      {news.title.length > 50
                        ? `${news.title.slice(0, 95)}...`
                        : news.title}
                    </Text>
                    <View className="flex-row items-center justify-between gap-1 pt-2">
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
                          {formatTimeAgo(news.publishedAt).includes("about")
                            ? formatTimeAgo(news.publishedAt).split("about")[1]
                            : formatTimeAgo(news.publishedAt)}
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
                            {news.author?.split(",")[0].split("and")[0].length >
                            20
                              ? news.author
                                  ?.split(",")[0]
                                  .split("and")[0]
                                  .slice(0, 20)
                              : news.author?.split(",")[0].split("and")[0]}
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
