import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { httpRequest } from "../../services";
import Loader from "../loader";
import { ExternalNewsI } from "../../types/news";
import { formatTimeAgo } from "../../helpers";
import axios from "axios";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const apiKey = "48f6f47da09747cda4b6e8cbb903d4d1";
const apiUrl = `https://newsapi.org/v2/top-headlines`;
const params = {
  apiKey,
  country: "us",
  category: "general",
};

export default function ExternalNews() {
  const navigation = useNavigation<NavigationProp<any>>();

  const queryFn = async function () {
    return axios.get(apiUrl, { params }).then((response) => {
      return response.data.articles;
    });
  };

  const { data, isLoading, error, refetch } = useQuery<ExternalNewsI[]>(
    [`externalNews`],
    queryFn,
    {
      staleTime: 60000,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) return <Loader />;

  const news = data?.filter(
    (n) => n.content !== null && n.description !== null
  );

  return (
    <View className="pt-8 mx-3">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-darkNeutral dark:text-lightText font-bold text-[17px]">
          External News
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("ExploreExternalNews")}
        >
          {/* <Text className="text-authDark dark:text-lightText text-[16px]">
            See More
          </Text> */}
        </TouchableOpacity>
      </View>
      <FlatList
        keyExtractor={(news) => news.title}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={news?.slice(0, 4)}
        renderItem={({ item: news }) => (
          <TouchableOpacity
            className="mr-1 bg-shadowWhite dark:bg-transparent border border-gray-200 dark:border-lightBorder shadow-sm overflow-hidden rounded-lg mt-3"
            onPress={() => navigation.navigate("ExternalNewsDetails", { news })}
          >
            <View>
              <Image
                source={{ uri: news.urlToImage }}
                className="h-60 w-full relative bg-primaryColorDisabled object-cover"
              />
              <View
                className="absolute top-3 left-2 rounded-lg"
                style={{ backgroundColor: "rgba(0,0,0,.7)" }}
              >
                <Text className="text-white p-2 font-semibold text-sm">
                  {news.source.name}
                </Text>
              </View>
              <View
                className="absolute bottom-[112px] right-2 rounded-lg"
                style={{ backgroundColor: "rgba(0,0,0,.7)" }}
              >
                <Text className="text-white p-2 font-semibold text-sm">
                  {formatTimeAgo(news.publishedAt)}
                </Text>
              </View>
              <Text className="w-80 mb-5 font-semibold text-base mt-2 p-2 leading-5 text-darkNeutral dark:text-lightText">
                {news.title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
