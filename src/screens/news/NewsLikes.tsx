import {
  View,
  Text,
  Platform,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import { useLayoutEffect } from "react";

import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { useQuery } from "@tanstack/react-query";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLORS } from "../../common/colors";
import { Ionicons } from "@expo/vector-icons";
import { httpRequest } from "../../services";
import Loader from "../../components/loader";
import ServerError from "../../components/custom_news/server_error";
import { Likes } from "../../types/likes";
import { formatTimeAgo } from "../../helpers";
import CuateSVG from "../../assets/cuate.svg";

interface LikeParams {
  newsId: string;
  newsLikes: string;
}

export default function NewsLikes() {
  const { newsId, newsLikes } = useRoute().params as LikeParams;
  const navigation = useNavigation<NavigationProp<any>>();
  const { isDarkMode } = useSheet();

  const queryFn = async function (): Promise<Likes[]> {
    return httpRequest.get(`/likes/${newsId}`).then((res) => {
      return res.data.likes;
    });
  };

  const {
    data: likes,
    isLoading,
    error,
    refetch,
  } = useQuery<Likes[]>([`likes-${newsId}`], queryFn, {
    staleTime: 60000,
    refetchOnWindowFocus: true,
    onError(error: any) {
      console.log(error.response.data);
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{ fontFamily: "rubikSB" }}
          className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px]"
        >
          Likes ({newsLikes})
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

  if (isLoading) return <Loader />;
  if (error) return <ServerError refetch={refetch} />;

  return (
    <ScrollView className="bg-shadowWhite dark:bg-darkNeutral flex-1">
      {likes?.length === 0 ? (
        <View className="mt-7">
          <CuateSVG width={"90%"} height={300} />
          <Text
            style={{ fontFamily: "rubikREG" }}
            className="text-darkNeutral dark:text-lightGray text-[19px] text-center mt-5 mx-3"
          >
            No likes for this news yet
          </Text>
        </View>
      ) : (
        <FlatList
          keyExtractor={(likes) => likes.id}
          data={likes}
          scrollEnabled={false}
          renderItem={({ item: like }) => (
            <View className="mx-2 mt-4">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-start gap-2">
                  <Image
                    source={{ uri: like.user.avatar }}
                    className="h-12 w-12 rounded-full"
                  />
                  <View>
                    <Text
                      style={{ fontFamily: "rubikSB" }}
                      className="text-darkNeutral dark:text-lightText mb-1 text-[16px]"
                    >
                      {like.user?.firstName}
                    </Text>
                    <Text
                      style={{ fontFamily: "rubikL" }}
                      className="text-darkNeutral dark:text-lightText"
                    >
                      Liked{" "}
                      {formatTimeAgo(like.createdAt).includes("about")
                        ? formatTimeAgo(like.createdAt).split("about ")[1]
                        : formatTimeAgo(like.createdAt)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity className="border-2 border-primaryColorTheme rounded-full p-2 bg-primaryColorLighter">
                  <Text
                    style={{ fontFamily: "rubikREG" }}
                    className="text-shadowWhite text-[16px]"
                  >
                    View Profile
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}
