import { useQuery } from "@tanstack/react-query";
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { httpRequest } from "../../services";
import { News } from "../../types/news";
import ServerError from "../../components/custom_news/server_error";
import Loader from "../../components/loader";
import { FlatList } from "react-native";
import { COLORS } from "../../common/colors";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { formatTimeAgo } from "../../helpers";

export default function NewsByUser({ userId }: { userId: string }) {
  const navigation = useNavigation<NavigationProp<any>>();
  const { isDarkMode } = useSheet();

  const queryFn = async (): Promise<News[]> => {
    return httpRequest.get(`/news/user-news/${userId}`).then((res) => {
      return res.data.news;
    });
  };

  const {
    data: userNews,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useQuery<News[]>(["userNews"], queryFn, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  if (isLoading || isFetching) return <Loader />;
  if (error) return <ServerError refetch={refetch} />;

  return (
    <ScrollView className="flex-1 bg-white dark:bg-darkNeutral">
      {userNews?.length === 0 ? (
        <Text
          style={{ fontFamily: "rubikSB" }}
          className="text-[18px] font-semibold leading-5 text-darkNeutral dark:text-lightText"
        >
          No news added yet.
        </Text>
      ) : (
        <FlatList
          keyExtractor={(userNews) => userNews.id}
          data={userNews}
          scrollEnabled={false}
          renderItem={({ item: news }) => (
            <View className="bg-shadowWhite dark:bg-transparent border border-gray-200 dark:border-lightBorder shadow-lg px-2 py-4 mt-[5px] rounded-lg relative">
              <View className="flex-row gap-4">
                <View className="w-[70%] flex-col justify-around">
                  <View className="flex-row justify-between items-center mb-2">
                    <View
                      className="rounded-lg"
                      style={{ backgroundColor: "rrgba(185, 48, 55, 0.524)" }}
                    >
                      <Text
                        style={{ fontFamily: "rubikREG" }}
                        className="text-white py-[3px] px-[5px] font-semibold text-sm"
                      >
                        {news.category}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("CustomNewsDetails", {
                          newsId: news.id,
                          slug: news.slug,
                        });
                      }}
                    >
                      <View className="flex-row items-center">
                        <Text
                          style={{ fontFamily: "rubikSB" }}
                          className="text-primaryColor dark:text-primaryColorLighter mr-1"
                        >
                          Read More
                        </Text>
                        <Ionicons
                          name="arrow-redo-outline"
                          size={18}
                          color={COLORS.primaryColorTheme}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{ fontFamily: "rubikSB" }}
                    className="text-[18px] font-semibold leading-5 text-darkNeutral dark:text-lightText"
                  >
                    {news.title}
                  </Text>
                  <View className="flex-row items-center justify-between gap-1 pt-2">
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons
                        name="bookmark-plus-outline"
                        size={20}
                        color={
                          isDarkMode
                            ? COLORS.primaryColorTheme
                            : COLORS.primaryColor
                        }
                      />

                      <Text
                        style={{ fontFamily: "rubikL" }}
                        className="text-darkNeutral dark:text-lightText ml-1"
                      >
                        {formatTimeAgo(news?.createdAt)}
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <Ionicons
                        name="ios-time-outline"
                        size={16}
                        color={
                          isDarkMode
                            ? COLORS.primaryColorTheme
                            : COLORS.primaryColor
                        }
                      />
                      <Text
                        style={{ fontFamily: "rubikL" }}
                        className="text-darkNeutral dark:text-lightText ml-1"
                      >
                        {news.readTime} mins read
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="w-[25%]">
                  <Image
                    source={{ uri: news.image }}
                    className="h-32 w-20 rounded-lg bg-primaryColorDisabled"
                    resizeMode="cover"
                  />
                </View>
              </View>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}
