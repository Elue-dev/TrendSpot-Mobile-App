import { View, Text, Platform, ScrollView, Image } from "react-native";
import React, { useLayoutEffect } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { useQuery } from "@tanstack/react-query";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { COLORS } from "../../common/colors";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { httpRequest } from "../../services";
import { Likes } from "../../types/likes";
import Loader from "../../components/loader";
import ServerError from "../../components/custom_news/server_error";
import { formatTimeAgo } from "../../helpers";
import UnionSVG from "../../assets/union.svg";

export default function UserLikes() {
  const navigation = useNavigation<NavigationProp<any>>();
  const {
    state: { user },
  } = useAuth();
  const { isDarkMode } = useSheet();

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
          Your Likes
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

  const queryFn = async function (): Promise<Likes[]> {
    return httpRequest
      .get(`/likes?userId=${user?.id}`, authHeaders)
      .then((res) => {
        return res.data.likes;
      });
  };

  const {
    data: likes,
    isLoading,
    error,
    refetch,
  } = useQuery<Likes[]>(["userLikes"], queryFn, {
    staleTime: 60000,
    refetchOnWindowFocus: true,
    onError(error) {
      console.log(error);
    },
  });

  if (isLoading) return <Loader />;
  if (error) return <ServerError refetch={refetch} />;

  return (
    <ScrollView className="flex-1 bg-shadowWhite dark:bg-darkNeutral">
      <View className="pt-2 mx-2">
        {likes?.length === 0 ? (
          <View className="mt-4">
            <UnionSVG width={"90%"} height={300} />
            <Text
              style={{ fontFamily: "rubikREG" }}
              className="text-xl text-center pb-4 text-darkNeutral dark:text-lightText"
            >
              All your likes will appear here
            </Text>
          </View>
        ) : (
          <FlatList
            keyExtractor={(likes) => likes.id}
            data={likes}
            scrollEnabled={false}
            renderItem={({ item: like }) => (
              <View className="bg-shadowWhite dark:bg-darkCard border border-gray-200 dark:border-lightBorder shadow-lg px-2 py-4 mt-[5px] rounded-lg relative">
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
                          {like?.news.category}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("CustomNewsDetails", {
                            newsId: like.newsId,
                            slug: like.news.slug,
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
                      {like.news.title}
                    </Text>
                    <View className="flex-row items-center justify-between gap-1 pt-2">
                      <View className="flex-row items-center">
                        <AntDesign
                          name="like2"
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
                          {formatTimeAgo(like.createdAt)}
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
                          {like.news.readTime} mins read
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="w-[25%]">
                    <Image
                      source={{ uri: like.news.image }}
                      className="h-32 w-20 rounded-lg bg-primaryColorDisabled"
                      resizeMode="cover"
                    />
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
}
