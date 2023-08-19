import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useRef, useState } from "react";
import { News } from "../../types/news";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { formatTimeAgo } from "../../helpers";
import { StatusBar } from "expo-status-bar";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { COLORS } from "../../common/colors";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import PostContent from "../../helpers/PostContent";
import VirtualHeader from "../../helpers/VirtualHeader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpRequest } from "../../services";
import { useAuth } from "../../context/auth/AuthContext";
import { useAlert } from "../../context/alert/AlertContext";
import { Bookmark } from "../../types/bookmarks";

interface NewsParams {
  news: News;
}

export default function CustomNewsDetails() {
  const { news } = useRoute().params as NewsParams;
  const navigation = useNavigation<NavigationProp<any>>();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useSheet();
  const { showAlertAndContent } = useAlert();
  const {
    state: { user },
  } = useAuth();
  const [scrollPage, setScrollPage] = useState(false);
  const scrollViewRef = useRef(null);
  const scrollY = new Animated.Value(0);
  const authHeaders = {
    headers: { authorization: `Bearer ${user?.token}` },
  };
  const queryClient = useQueryClient();

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
    const newOpacity = offsetY > 80 ? 1 : 0;
    const newHeight = offsetY > 80 ? 14 : 0;
    const scrollPageOpacity = new Animated.Value(0);
    const scrollPageHeight = new Animated.Value(0);

    Animated.timing(scrollPageOpacity, {
      toValue: newOpacity,
      duration: 200,
      useNativeDriver: false,
    }).start();

    Animated.timing(scrollPageHeight, {
      toValue: newHeight,
      duration: 200,
      useNativeDriver: false,
    }).start();

    if (offsetY > 100) {
      setScrollPage(true);
    } else {
      setScrollPage(false);
    }
  }

  const bookmarksMutation = useMutation(
    (newsId: string) => {
      return httpRequest.post(
        `/bookmarks/toggleBookmark/${newsId}`,
        "",
        authHeaders
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["customNews"]);
        queryClient.invalidateQueries(["bookmarks"]);
      },
    }
  );

  const addRemoveBookmark = async (newsId: string) => {
    setIsLoading(true);
    try {
      const response = await bookmarksMutation.mutateAsync(newsId);
      if (response && response.data.message === "News added to bookmarks") {
        setIsLoading(false);
        showAlertAndContent({
          type: "success",
          message: "News added to bookmarks",
        });
        setIsBookmarked(true);
      } else {
        setIsLoading(false);
        showAlertAndContent({
          type: "info",
          message: "News removed from bookmarks",
        });
      }
    } catch (error: any) {
      setIsLoading(false);
      showAlertAndContent({
        type: "error",
        message:
          error.response.data.message ||
          "Something went wrong. Please try again later",
      });
    }
  };

  const userHasBookmarkedPost = (bookmarks: Bookmark[]): boolean => {
    console.log({ bookmarks });

    return bookmarks?.some((bookmark) => bookmark?.userId === user?.id);
  };

  return (
    <View className="bg-shadowWhite dark:bg-darkNeutral flex-1">
      {scrollPage && <VirtualHeader navigation={navigation} />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        scrollEventThrottle={16}
      >
        <StatusBar style="light" />

        <View>
          <Image
            source={{ uri: news.image }}
            className="h-96 w-full relative"
          />
          <View className="absolute bottom-0 left-0 right-0 h-96 bg-black opacity-50" />
          {/* top icons */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute left-0 top-14 ml-3 bg-shadowWhite rounded-full h-7 w-7 flex-col justify-center items-center"
          >
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              color={COLORS.primaryColorTheme}
            />
          </TouchableOpacity>
          {isLoading ? (
            <View className="absolute top-14 right-0 mr-3 bg-shadowWhite rounded-full h-7 w-7 flex-col justify-center items-center">
              <ActivityIndicator
                size="small"
                color={
                  isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor
                }
              />
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => addRemoveBookmark(news.id)}
              className="absolute top-14 right-0 mr-3 bg-shadowWhite rounded-full h-7 w-7 flex-col justify-center items-center"
            >
              {userHasBookmarkedPost(news.bookmarks) || isBookmarked ? (
                <Octicons
                  name="bookmark-slash"
                  size={20}
                  color={COLORS.primaryColorTheme}
                />
              ) : (
                <MaterialCommunityIcons
                  name="bookmark-outline"
                  size={20}
                  color={COLORS.primaryColorTheme}
                />
              )}
            </TouchableOpacity>
          )}
          <View className="mx-2">
            <Text className="absolute bottom-24 text-white font-bold text-[18px]">
              {news.title}
            </Text>
            <Text className="absolute bottom-[62px] text-white font-bold text-base">
              Category: {news.category}
            </Text>
          </View>
        </View>

        <View className="rounded-tl-[10px] dark:rounded-tl-[20px] rounded-tr-[10px] dark:rounded-tr-[20px] w-ull h-full bg-white dark:bg-darkNeutral -mt-4">
          <View className="mx-3 mt-5">
            <View className="flex-row justify-between items-center mb-6">
              {news.author && (
                <View className="flex-row items-center gap-2">
                  <Image
                    source={{ uri: news.author.avatar }}
                    className="h-8 w-8 bg-primaryColorDisabled rounded-full"
                  />

                  <View className="flex-row items-center">
                    <Text className="text-darkNeutral dark:text-lightText font-semibold text-base mr-1">
                      {news.author.firstName} {news.author.lastName}
                    </Text>

                    {news.author.isAdmin && (
                      <MaterialIcons
                        name="verified"
                        size={16}
                        color={
                          isDarkMode
                            ? COLORS.primaryColorTheme
                            : COLORS.primaryColor
                        }
                      />
                    )}
                  </View>
                </View>
              )}

              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons
                  name="clock-time-two-outline"
                  size={20}
                  color={
                    isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor
                  }
                />
                <Text className="text-darkNeutral dark:text-lightText font-semibold text-base">
                  {formatTimeAgo(news.createdAt)}
                </Text>
              </View>
            </View>
            <View className="pb-14">
              <PostContent content={news.content} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
