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
  Platform,
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
  AntDesign,
} from "@expo/vector-icons";
import { COLORS } from "../../common/colors";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import PostContent from "../../helpers/PostContent";
import VirtualHeader from "../../helpers/VirtualHeader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpRequest } from "../../services";
import { useAuth } from "../../context/auth/AuthContext";
import { useAlert } from "../../context/alert/AlertContext";
import {
  addRemoveBookmark,
  userHasBookmarkedPost,
} from "../../helpers/handleBookmarks";
import Loader from "../../components/loader";
import ServerError from "../../components/custom_news/server_error";

interface NewsParams {
  news: News;
}

export default function CustomNewsDetails() {
  const { news: newsFromParams } = useRoute().params as NewsParams;
  const navigation = useNavigation<NavigationProp<any>>();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setloading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
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

  const queryFn = async (): Promise<News> => {
    return httpRequest
      .get(`/news/${newsFromParams.slug}/${newsFromParams.id}`)
      .then((res) => {
        return res.data.news;
      });
  };

  const {
    data: news,
    isLoading,
    error,
    refetch,
  } = useQuery<News>([`news-${newsFromParams?.id}`], queryFn, {
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  // console.log({ likes: news?.likes });

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
        queryClient.invalidateQueries([`news-${newsFromParams.id}`]);
        queryClient.invalidateQueries(["bookmarks"]);
        queryClient.invalidateQueries(["activities"]);
      },
    }
  );

  const likeMutation = useMutation(
    (newsId: string) => {
      return httpRequest.post(
        `/likes/togglePostLike/${newsId}`,
        "",
        authHeaders
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`news-${newsFromParams.id}`]);
        queryClient.invalidateQueries(["bookmarks"]);
        queryClient.invalidateQueries(["likes"]);
        queryClient.invalidateQueries(["activities"]);
        queryClient.invalidateQueries(["userNews"]);
        queryClient.invalidateQueries(["userLikes"]);
      },
    }
  );

  async function handlePostLike() {
    if (!user) return navigation.navigate("AuthSequence", { state: "Sign In" });
    setLikeLoading(true);
    try {
      const response = await likeMutation.mutateAsync(newsFromParams.id);
      if (response && response.data.message === "News liked") {
        setLikeLoading(false);
        showAlertAndContent({
          type: "success",
          message: "News liked",
        });
        setIsLiked(true);
      } else {
        setLikeLoading(false);
        showAlertAndContent({
          type: "info",
          message: "News like removed",
        });
        setIsLiked(false);
      }
      queryClient.invalidateQueries(["likes"]);
      queryClient.invalidateQueries(["activities"]);
      queryClient.invalidateQueries(["userLikes"]);
    } catch (error: any) {
      setLikeLoading(false);
      showAlertAndContent({
        type: "error",
        message:
          error.response.data?.message ||
          "Something went wrong. Please try again later",
      });
    }
  }

  if (isLoading)
    return (
      <View className="flex-1 bg-transparent dark:bg-darkNeutral">
        <View className="mt-24">
          <Loader />
        </View>
      </View>
    );

  if (error) return <ServerError refetch={refetch} />;

  function userHasLikedPost(): boolean | undefined {
    return news?.likes?.some((like) => like?.userId === user?.id);
  }

  return (
    <View className="bg-shadowWhite dark:bg-darkNeutral flex-1">
      {scrollPage && (
        <VirtualHeader
          loading={loading}
          setloading={setloading}
          navigation={navigation}
          news={news}
          bookmarksMutation={bookmarksMutation}
          showAlertAndContent={showAlertAndContent}
          queryClient={queryClient}
        />
      )}
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
            source={{ uri: news?.image }}
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
          {loading ? (
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
              onPress={() =>
                addRemoveBookmark({
                  newsId: news?.id || "",
                  user,
                  navigation,
                  setIsBookmarked,
                  setloading,
                  bookmarksMutation,
                  showAlertAndContent,
                  queryClient,
                })
              }
              className="absolute top-14 right-0 mr-3 bg-shadowWhite rounded-full h-7 w-7 flex-col justify-center items-center"
            >
              {userHasBookmarkedPost({
                bookmarks: news?.bookmarks || [],
                user,
              }) || isBookmarked ? (
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
            <Text
              style={{ fontFamily: "rubikB" }}
              className="absolute bottom-24 text-white font-bold text-[18px]"
            >
              {news?.title}
            </Text>
            <Text
              style={{ fontFamily: "rubikSB" }}
              className="absolute bottom-[62px] text-white font-bold text-base"
            >
              Category: {news?.category}
            </Text>
          </View>
        </View>

        <View className="rounded-tl-[10px] dark:rounded-tl-[20px] rounded-tr-[10px] dark:rounded-tr-[20px] w-ull h-full bg-white dark:bg-darkNeutral -mt-4">
          <View className="mx-3 mt-5">
            <View className="mb-4 border-b border-b-lightText dark:border-b-dark">
              <View className="mb-2 flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <Image
                    source={{ uri: news?.author.avatar }}
                    className="h-11 w-11 bg-primaryColorDisabled rounded-full"
                  />
                  <View>
                    <View className="flex-row items-center">
                      <Text
                        style={{ fontFamily: "rubikSB" }}
                        className="text-darkNeutral dark:text-lightText text-base mr-1"
                      >
                        {news?.author.firstName} {news?.author.lastName}
                      </Text>
                      {news?.author.isAdmin && (
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
                    <View className="flex-row items-center">
                      <Text className="text-darkNeutral dark:text-lightText font-light text-base mr-1">
                        {formatTimeAgo(news?.createdAt || "")} .
                      </Text>

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("NewsLikes", {
                            newsId: news?.id,
                            newsLikes: news?.likes.length.toString(),
                          })
                        }
                      >
                        <Text
                          style={{ fontFamily: "rubikREG" }}
                          className={`text-primaryColorLighter font-light text-base underline ${
                            Platform.OS === "android" && "mt-1"
                          }`}
                        >
                          {news?.likes.length}{" "}
                          {news?.likes.length === 1 ? "like" : "likes"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {likeLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={COLORS.primaryColorTheme}
                  />
                ) : userHasLikedPost() || isLiked ? (
                  <TouchableOpacity onPress={handlePostLike}>
                    <AntDesign
                      name="heart"
                      size={26}
                      color={COLORS.primaryColorTheme}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={handlePostLike}>
                    <AntDesign
                      name="hearto"
                      size={26}
                      color={COLORS.primaryColorTheme}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View className="pb-8">
              <PostContent content={news?.content || ""} />
            </View>

            <View className="pb-14">
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("NewsComments", {
                    newsId: news?.id,
                  });
                }}
                className="flex-row items-center gap-1 justify-center border-2 border-primaryColorTheme px-2 py-3 rounded-full"
              >
                <MaterialCommunityIcons
                  name="comment-text-multiple-outline"
                  size={20}
                  color={COLORS.primaryColorTheme}
                />
                <Text
                  style={{ fontFamily: "rubikSB" }}
                  className="text-primaryColorTheme text-[18px]"
                >
                  View Comments
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
