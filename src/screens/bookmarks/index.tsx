import {
  View,
  Text,
  Button,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLayoutEffect, useState } from "react";
import { httpRequest } from "../../services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Loader from "../../components/loader";
import ServerError from "../../components/custom_news/server_error";
import { useAuth } from "../../context/auth/AuthContext";
import { FlatList } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { COLORS } from "../../common/colors";
import { formatTimeAgo } from "../../helpers";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { Image } from "react-native";
import { Bookmark } from "../../types/bookmarks";
import CuateSVG from "../../assets/cuate.svg";
import { addRemoveBookmark } from "../../helpers/handleBookmarks";
import { useAlert } from "../../context/alert/AlertContext";

export default function Bookmarks() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setloading] = useState(false);
  const queryClient = useQueryClient();
  const navigation = useNavigation<NavigationProp<any>>();
  const {
    state: { user },
  } = useAuth();
  const { isDarkMode } = useSheet();
  const { showAlertAndContent } = useAlert();
  const authHeaders = {
    headers: { authorization: `Bearer ${user?.token}` },
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{ fontFamily: "rubikSB" }}
          className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]"
        >
          Bookmarks
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

  const queryFn = async function (): Promise<Bookmark[]> {
    return httpRequest
      .get(`/bookmarks?userId=${user?.id}`, authHeaders)
      .then((res) => {
        return res.data.bookmarks;
      });
  };

  const {
    data: bookmarks,
    isLoading,
    error,
    refetch,
  } = useQuery<Bookmark[]>(["bookmarks"], queryFn, {
    staleTime: 60000,
    refetchOnWindowFocus: true,
    onError(error) {
      console.log(error);
    },
  });

  const bookmarksMutation = useMutation(function (newsId: string) {
    return httpRequest.post(
      `/bookmarks/toggleBookmark/${newsId}`,
      "",
      authHeaders
    );
  });

  if (isLoading) return <Loader />;
  if (error) return <ServerError refetch={refetch} />;

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      className="bg-shadowWhite dark:bg-darkNeutral"
    >
      {bookmarks?.length === 0 ? (
        <View className="mt-7">
          <CuateSVG width={"90%"} height={300} />
          <Text
            style={{ fontFamily: "rubikREG" }}
            className="text-darkNeutral dark:text-lightGray text-[19px] text-center mt-5 mx-3"
          >
            All your bookmarks will appear here
          </Text>
        </View>
      ) : (
        <View className="pt-5 mx-2">
          <FlatList
            keyExtractor={(bookmarks) => bookmarks.id}
            data={bookmarks}
            scrollEnabled={false}
            renderItem={({ item: bookmark }) => (
              <View className="bg-shadowWhite dark:bg-transparent border border-gray-200 dark:border-lightBorder shadow-lg px-2 py-4 mt-[20px] rounded-lg relative">
                <TouchableOpacity
                  onPress={() => {
                    loading
                      ? () => {}
                      : addRemoveBookmark({
                          newsId: bookmark.news?.id || "",
                          setIsBookmarked,
                          setloading,
                          bookmarksMutation,
                          showAlertAndContent,
                          queryClient,
                        });
                  }}
                  className="absolute right-0 top-[-15px] bg-primaryColorTheme rounded-full h-7 w-7 flex-col justify-center items-center"
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={COLORS.lightText} />
                  ) : (
                    <MaterialCommunityIcons
                      name="window-close"
                      size={24}
                      color={COLORS.lightText}
                    />
                  )}
                </TouchableOpacity>

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
                          {bookmark.news.category}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("CustomNewsDetails", {
                            news: bookmark.news,
                          })
                        }
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
                      {bookmark.news.title}
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
                          {formatTimeAgo(bookmark.createdAt)}
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
                          {bookmark.news.readTime} mins read
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="w-[25%]">
                    <Image
                      source={{ uri: bookmark.news.image }}
                      className="h-32 w-20 rounded-lg bg-primaryColorDisabled"
                      resizeMode="cover"
                    />
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
