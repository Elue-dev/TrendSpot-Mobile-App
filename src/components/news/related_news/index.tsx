import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { News } from "../../../types/news";
import { useSheet } from "../../../context/bottom_sheet/BottomSheetContext";
import { COLORS } from "../../../common/colors";
import { AntDesign } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Loader from "../../loader";
import { parseText } from "../../../utils";
import { useState } from "react";

interface Props {
  newsCategory: string;
  newsId: string;
}

export default function RelatedNews({ newsCategory, newsId }: Props) {
  const [data, setdata] = useState([]);
  const [loading, setloading] = useState(false);
  const { isDarkMode } = useSheet();
  const navigation = useNavigation<NavigationProp<any>>();

  const relatedNews: News[] = data.filter(
    (news: News) => news.category === newsCategory && news.id !== newsId
  );

  if (loading) return <Loader />;

  return (
    <View className="pb-10 pt-10">
      <Text className="text-primaryColor dark:text-primaryColorTheme text-xl font-bold mb-3">
        More news on {newsCategory}
      </Text>
      {relatedNews.length === 0 ? (
        <Text className="text-darkNeutral dark:text-lightText text-base">
          No related news were found.{" "}
          <Text
            onPress={() => navigation.navigate("TabStack")}
            className="underline"
          >
            View all news.
          </Text>
        </Text>
      ) : (
        <FlatList
          keyExtractor={(relatedNews) => relatedNews.id}
          data={relatedNews.slice(0, 3)}
          scrollEnabled={false}
          renderItem={({ item: news, index }) => (
            <View
              className={`${
                relatedNews.length - 1 !== index && isDarkMode
                  ? "border-b border-b-authDark"
                  : relatedNews.length - 1 !== index && !isDarkMode
                  ? "border-b border-b-lightText"
                  : ""
              } mb-3`}
            >
              <View>
                {news.image && (
                  <Image
                    source={{ uri: news.image }}
                    className="h-40 w-full rounded-md bg-primaryColorLighter mb-3 mt-4"
                  />
                )}
                <View>
                  <Text className="text-darkNeutral dark:text-lightText text-[17px] font-bold">
                    {news.title}
                  </Text>
                  <Text className="text-darkNeutral dark:text-lightText text-base font-light dark:font-extralight mt-1">
                    {parseText(news.content.substring(0, 100))}...
                  </Text>
                  <View className="flex-row justify-between items-center pt-3 pb-3">
                    <Text className="text-darkNeutral dark:text-lightText text-base font-light">
                      {news.readTime} mins read
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.goBack();
                        navigation.navigate("NewsDetails", { news });
                      }}
                      className="flex-row gap-1 items-center"
                    >
                      <Text className="text-darkNeutral dark:text-lightText text-base font-light">
                        Read More
                      </Text>
                      <AntDesign
                        name="doubleright"
                        size={14}
                        color={COLORS.authDark}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
