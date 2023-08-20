import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import React, { useRef, useState } from "react";
import { ExternalNewsI } from "../../types/news";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { formatTimeAgo } from "../../helpers";
import { StatusBar } from "expo-status-bar";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { COLORS } from "../../common/colors";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";

interface NewsParams {
  news: ExternalNewsI;
}

export default function ExternalNewsDetails() {
  const { news } = useRoute().params as NewsParams;
  const navigation = useNavigation<NavigationProp<any>>();
  const { isDarkMode } = useSheet();

  return (
    <View className="bg-shadowWhite dark:bg-darkNeutral flex-1">
      <ScrollView>
        <StatusBar style="light" />
        <View>
          <Image
            source={{ uri: news.urlToImage }}
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
          <TouchableOpacity className="absolute top-14 right-0 mr-3 bg-shadowWhite rounded-full h-7 w-7 flex-col justify-center items-center">
            <MaterialCommunityIcons
              name="bookmark-outline"
              size={20}
              color={COLORS.primaryColorTheme}
            />
          </TouchableOpacity>
          <View className="mx-2">
            <Text
              style={{ fontFamily: "rubikB" }}
              className="absolute bottom-24 text-white font-bold text-[18px]"
            >
              {news.title}
            </Text>
            <Text
              style={{ fontFamily: "rubikSB" }}
              className="absolute bottom-[62px] text-white font-bold text-base"
            >
              Source: {news.source.name}
            </Text>
          </View>
        </View>

        <View className="rounded-tl-[14px] dark:rounded-tl-[20px] rounded-tr-[14px] dark:rounded-tr-[20px] w-ull h-full bg-shadowWhite dark:bg-darkNeutral -mt-4">
          <View className="mx-2 mt-5">
            <View className="flex-row justify-between items-center mb-6">
              {news.author && (
                <View className="flex-row items-center gap-2">
                  <Feather
                    name="user"
                    size={22}
                    color={
                      isDarkMode
                        ? COLORS.primaryColorTheme
                        : COLORS.primaryColor
                    }
                  />
                  <Text
                    style={{ fontFamily: "rubikREG" }}
                    className="text-darkNeutral dark:text-lightText font-semibold text-base"
                  >
                    {news.author.split(",")[0] || news.source.name}
                  </Text>
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
                <Text
                  style={{ fontFamily: "rubikREG" }}
                  className="text-darkNeutral dark:text-lightText font-semibold text-base"
                >
                  {formatTimeAgo(news.publishedAt)}
                </Text>
              </View>
            </View>
            <Text
              style={{ fontFamily: "rubikREG" }}
              className="leading-5 text-darkNeutral dark:text-lightText text-base"
            >
              {news.content
                ? news.content?.split("[")[0]
                : "View more via the link below"}
            </Text>

            <TouchableOpacity
              onPress={() => Linking.openURL(news.url)}
              className=" py-2 px-6 mt-8 rounded-md border-2 border-primaryColor dark:border-primaryColorTheme"
            >
              <Text
                style={{ fontFamily: "rubikREG" }}
                className="font-semibold text-center text-xl text-primaryColor dark:text-primaryColorTheme"
              >
                Read Full News
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
