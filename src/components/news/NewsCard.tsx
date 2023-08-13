import { View, Text, FlatList, TouchableOpacity } from "react-native";
// import { newsData } from "../../screens/news/data";
import {
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { COLORS } from "../../common/colors";
import { Dispatch, SetStateAction, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import { News } from "../../types/news";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { formatDate } from "../../helpers";
import { useAlert } from "../../context/alert/AlertContext";
import { useAuth } from "../../context/auth/AuthContext";
import SavedIcon from "../../assets/saved.svg";
import { parseText } from "../../utils";
import PostContent from "../../helpers/PostContent";

export default function NewsCard({
  dataToUse,
  location,
}: {
  dataToUse: any;
  location: string;
  setDataToUse?: Dispatch<SetStateAction<News[]>>;
}) {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isDarkMode } = useSheet();
  const { showAlertAndContent } = useAlert();
  const { state } = useAuth();

  async function saveNews(news: News, action: string) {}

  return (
    <View className="mx-2">
      <FlatList
        keyExtractor={(dataToUse) => dataToUse.id.toString()}
        data={dataToUse}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: news, index }) => (
          <View
            className={`border-gray100 dark:border-gray200  ${
              index === dataToUse.length - 1 ? "pb-24 border-b-0" : ""
            }`}
          >
            <View
              className={`border border-gray100 dark:border-extraLightGray  shadow-sm px-2 py-4 mt-3 rounded-lg
             ${index === dataToUse.length - 1 ? "mb-24" : "mb-2"}
               `}
              style={{
                elevation: 1,
                backgroundColor: isDarkMode ? COLORS.darkNeutral : "#FFF",
              }}
            >
              {/* Header */}
              {location !== "saved" && (
                <View className="flex-row justify-between items-center pb-3">
                  <Text className="text-extraLightGray dark:text-lightText font-light">
                    {formatDate(news.date)}
                  </Text>

                  <View className="flex-row gap-1">
                    {news.isVerified ? (
                      <MaterialIcons
                        name="verified"
                        size={15}
                        color={COLORS.customGreen}
                      />
                    ) : (
                      <Ionicons
                        name="ios-warning-outline"
                        size={15}
                        color={
                          isDarkMode
                            ? COLORS.primaryColorTheme
                            : COLORS.primaryColor
                        }
                      />
                    )}

                    <View className="flex-row items-center">
                      <Text className="mr-1 text-lightGray font-bold dark:text-lightText dark:font-normal">
                        |
                      </Text>
                      <Text className="text-gray200 font-light">
                        {news.upvotes.length}{" "}
                        {news.upvotes.length === 1 ? "upvote" : "upvotes"}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Body */}
              <Text className="text-extraLightGray dark:text-grayNeutral text-[18px] font-bold">
                {news.title}
              </Text>
              <View className="">
                <Text className="text-extraLightGray dark:text-white font-light leading-6 pt-2 text-base">
                  {parseText(news.content.slice(0, 175))}...
                  {/* <PostContent content={news.content.slice(0, 175)} /> */}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("NewsDetails", { news })}
                >
                  <Text className="text-primaryColor dark:text-primaryColorTheme pt-1 pb-2 font-semibold text-base">
                    Read More
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View className="flex-row justify-between items-center">
                <View className="flex-row gap-1">
                  <Text className="text-gray50 text-base">{news.category}</Text>
                  <Text className="text-gray50 text-base">|</Text>
                  <Text className="text-gray50 text-base">
                    {news.readTime}{" "}
                    {news.readTime === 1 ? "min read" : "mins read"}
                  </Text>
                </View>
                {loading ? (
                  <Text className="text-darkNeutral dark:text-gray100">
                    ...
                  </Text>
                ) : (
                  <>
                    {location === "saved" ? (
                      <TouchableOpacity
                        onPress={() => saveNews(news, "unsave")}
                      >
                        <Octicons
                          name="bookmark-slash"
                          size={20}
                          color={isDarkMode ? COLORS.gray100 : COLORS.grayText}
                        />
                      </TouchableOpacity>
                    ) : (
                      // <TouchableOpacity onPress={() => saveNews(news, "save")}>
                      //   <MaterialCommunityIcons
                      //     name="bookmark-multiple-outline"
                      //     size={20}
                      //     color={isDarkMode ? COLORS.gray100 : COLORS.grayText}
                      //   />
                      // </TouchableOpacity>
                      <SavedIcon onPress={() => saveNews(news, "save")} />
                    )}
                  </>
                )}
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
