import { useQuery } from "@tanstack/react-query";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { httpRequest } from "../../services";
import { News } from "../../types/news";
import Loader from "../loader";
import ServerError from "./server_error";
import { formatTimeAgo } from "../../helpers";
import { SimpleLineIcons, Fontisto, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../common/colors";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";

export default function CustomNews() {
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
  });

  if (isLoading)
    return (
      <View className="mt-28">
        <Loader />
      </View>
    );

  if (error)
    return (
      <View className="mt-28">
        <ServerError refetch={refetch} />
      </View>
    );

  return (
    <View className="pt-10 mx-3 pb-28">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-darkNeutral dark:text-lightText font-bold text-[17px]">
          News From Us
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("ExploreCustomNews")}
        >
          {/* <Text className="text-authDark dark:text-lightText text-[16px]">
            See More
          </Text> */}
        </TouchableOpacity>
      </View>
      <FlatList
        keyExtractor={(news) => news.id}
        data={news?.slice(0, 5)}
        scrollEnabled={false}
        renderItem={({ item: news }) => (
          <View className="bg-shadowWhite dark:bg-transparent border border-gray-200 dark:border-lightBorder shadow-lg px-2 py-4 mt-[5px] rounded-lg">
            <View className="flex-row gap-4">
              <View className="w-[70%] flex-col justify-around">
                <View className="flex-row justify-between items-center mb-2">
                  <View
                    className="rounded-lg"
                    style={{ backgroundColor: "rrgba(185, 48, 55, 0.524)" }}
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
                <Text className="text-[18px] font-semibold leading-5 text-darkNeutral dark:text-lightText">
                  {news.title}
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
                    <Text className="text-darkNeutral dark:text-lightText ml-1">
                      {formatTimeAgo(news.createdAt)}
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
                    <Text className="text-darkNeutral dark:text-lightText ml-1">
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
    </View>
  );
}
