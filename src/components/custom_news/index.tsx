import { useQuery } from "@tanstack/react-query";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { httpRequest } from "../../services";
import { News } from "../../types/news";
import Loader from "../loader";
import ServerError from "./server_error";

import { SimpleLineIcons } from "@expo/vector-icons";
import { COLORS } from "../../common/colors";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function CustomNews() {
  const navigation = useNavigation<NavigationProp<any>>();

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
    <View className="pt-10 mx-3 pb-14">
      <View className="flex-row justify-between items-center mb-3">
        <Text
          style={{ fontFamily: "rubikSB" }}
          className="text-darkNeutral dark:text-lightText font-bold text-[19px]"
        >
          News From Us
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("ExploreCustomNews")}
        ></TouchableOpacity>
      </View>
      <FlatList
        keyExtractor={(news) => news.id}
        data={news?.slice(0, 5)}
        scrollEnabled={false}
        renderItem={({ item: news }) => (
          <View className="bg-white dark:bg-darkCard border border-gray-200 dark:border-lightBorder shadow-sm px-2 py-4 mt-[5px] rounded-lg">
            <View className="flex-row gap-4">
              <View className="w-[70%] flex-col justify-around">
                <Text
                  style={{ fontFamily: "rubikMD" }}
                  className="text-[18px] leading-5 text-darkNeutral dark:text-lightText"
                >
                  {news.title}
                </Text>
                <View className="flex-row items-center justify-between gap-1 pt-2">
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
                      navigation.navigate("CustomNewsDetails", {
                        newsId: news.id,
                        slug: news.slug,
                      })
                    }
                    className="flex-row items-center"
                  >
                    <SimpleLineIcons
                      name="eye"
                      size={17}
                      color={COLORS.primaryColor}
                    />
                    <Text
                      style={{ fontFamily: "rubikSB" }}
                      className="text-primaryColorTheme  ml-1"
                    >
                      Read More
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="w-[25%]">
                <Image
                  source={{ uri: news.image }}
                  className="h-24 w-20 rounded-lg bg-primaryColorDisabled"
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
