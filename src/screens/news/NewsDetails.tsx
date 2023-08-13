import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import {
  MaterialIcons,
  Ionicons,
  Entypo,
  SimpleLineIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { COLORS } from "../../common/colors";
import { News } from "../../types/news";
import { SharedElement } from "react-native-shared-element";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import BottomSheetTwo from "../../components/bottom_sheet/BottomSheetTwo";
import { formatDate } from "../../helpers";

import { useAlert } from "../../context/alert/AlertContext";
import { useAuth } from "../../context/auth/AuthContext";
import PostContent from "../../helpers/PostContent";
import RelatedNews from "../../components/news/related_news";

interface NewsParams {
  news: News;
}

export default function NewsDetails() {
  const [loading, setLoading] = useState(false);
  const { width } = Dimensions.get("window");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { news } = useRoute().params as NewsParams;
  const scrollRef = useRef<ScrollView>(null);
  const {
    state: { user },
  } = useAuth();
  const {
    state: { bottomSheetOpen },
    isDarkMode,
    toggleBottomSheet,
    toggleOverlay,
  } = useSheet();
  const { showAlertAndContent } = useAlert();

  function handleBottomSheetActions() {
    toggleBottomSheet();
    toggleOverlay();
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          className={`${
            isDarkMode ? "text-gray300" : "text-primaryColorSec"
          }  font-semibold text-[18px]`}
        >
          News
        </Text>
      ),

      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("NewsComments", { newsId: news.id })
          }
        >
          <MaterialCommunityIcons
            name="comment-text-multiple-outline"
            size={22}
            color={`${isDarkMode ? COLORS.gray300 : "#666"}`}
          />
        </TouchableOpacity>
      ),
    });
  }, [bottomSheetOpen, isDarkMode]);

  async function upvoteNews() {}

  return (
    <SafeAreaView
      className={`${isDarkMode ? "bg-darkNeutral" : "bg-white"} flex-1`}
    >
      <ScrollView
        ref={scrollRef}
        className={`pb-44 ${
          !bottomSheetOpen && "mx-3"
        } bg-white dark:bg-darkNeutral flex-1`}
        showsVerticalScrollIndicator={false}
      >
        <View className="border-b-2 border-b-slate-200 dark:border-b-lightBorder">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <View className="pt-6">
              <View className="flex-row items-center gap-1 pb-2">
                <Text
                  className={`${
                    isDarkMode ? "text-gray100" : "text-grayText"
                  }  text-[14px]`}
                >
                  News Status:
                </Text>
                <View className="flex-row items-center">
                  <Text
                    className={`text-[14px] font-semibold ${
                      news.isVerified ? "text-customGreen" : "text-red-500"
                    }`}
                  >
                    {news.isVerified ? "Verified" : "Unverified"}{" "}
                  </Text>
                  {news.isVerified ? (
                    <MaterialIcons
                      name="verified"
                      size={16}
                      color={COLORS.customGreen}
                    />
                  ) : (
                    <Ionicons
                      name="ios-warning-outline"
                      size={16}
                      color={COLORS.primaryColor}
                    />
                  )}
                </View>
              </View>

              <View className="flex-row items-center gap-1 pb-2">
                <Text
                  className={`${
                    isDarkMode ? "text-gray100" : "text-grayText"
                  } text-[14px] font-normal`}
                >
                  Time Posted:
                </Text>
                <View className="flex-row">
                  <Text
                    className={`${
                      isDarkMode ? "text-gray100" : "text-grayText"
                    } text-[14px] font-medium`}
                  >
                    {formatDate(news.date)}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-center gap-4">
              {loading ? (
                <Text className="text-darkNeutral dark:text-lightText">
                  ...
                </Text>
              ) : (
                <TouchableOpacity onPress={upvoteNews}>
                  <SimpleLineIcons
                    name="like"
                    size={18}
                    color={isDarkMode ? "white" : "black"}
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={toggleBottomSheet}>
                <Entypo
                  name="dots-three-vertical"
                  size={18}
                  color={isDarkMode ? "white" : "black"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Cotent */}
          <View className="flex-row items-center gap-1 pt-6">
            <Image
              source={{ uri: news.authorPhoto }}
              className="h-8 w-8 rounded-full bg-primaryColorLighter object-cover"
            />
            <View className="flex-row gap-1">
              <Text className="text-authDark dark:text-lightText font-bold">
                {news.authorName}
              </Text>

              {news.authorVerified && (
                <MaterialIcons
                  name="verified"
                  size={14}
                  color={
                    isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor
                  }
                />
              )}
            </View>
          </View>
          <Text
            className={`${
              isDarkMode ? "text-grayNeutral" : "text-extraLightGray"
            }  text-[20px] leading-6  font-bold mt-3`}
          >
            {news.title}
          </Text>

          {news.image && (
            <Image
              source={{ uri: news.image }}
              style={{
                height: 300,
                width: width - 25,
                borderRadius: 10,
                marginTop: 20,
                zIndex: -1,
                resizeMode: "cover",
                backgroundColor: COLORS.primaryColorLighter,
              }}
            />
          )}
          <View className="pt-3">
            <Text
              className={`${
                isDarkMode ? "text-gray100" : "text-grayText"
              } pt-2 leading-5 font-light  text-base`}
            >
              <PostContent content={news.content} />
            </Text>
            {/* <View className="pt-5 pb-10">
            <Text
              className={`${
                isDarkMode ? "text-gray100" : "text-grayText"
              } uppercase pb-3 text-[17px] font-bold`}
            >
              News Sources
            </Text>
            {news.sources?.map((source, index) => (
              <View className="flex-row items-start" key={index}>
                <Entypo
                  name="dot-single"
                  size={24}
                  color={
                    isDarkMode
                      ? COLORS.primaryColorTheme
                      : COLORS.primaryColorTet
                  }
                />
                <Text
                  className={`${
                    isDarkMode
                      ? "text-primaryColorTheme"
                      : "text-primaryColorTet"
                  } mb-2  underline`}
                >
                  {source}
                </Text>
              </View>
            ))}
          </View> */}
          </View>
        </View>

        <RelatedNews newsCategory={news.category} newsId={news.id} />
      </ScrollView>

      {bottomSheetOpen && (
        <>
          <TouchableOpacity onPress={handleBottomSheetActions}>
            <SharedElement id="overlay" onNode={toggleOverlay}>
              <View />
            </SharedElement>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            onPress={handleBottomSheetActions}
          />
        </>
      )}

      {bottomSheetOpen && <BottomSheetTwo currentNews={news} />}
    </SafeAreaView>
  );
}
