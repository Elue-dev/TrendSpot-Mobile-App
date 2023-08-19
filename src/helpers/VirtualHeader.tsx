import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { COLORS } from "../common/colors";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { News } from "../types/news";
import { addRemoveBookmark, userHasBookmarkedPost } from "./handleBookmarks";
import { useSheet } from "../context/bottom_sheet/BottomSheetContext";
import { Dispatch, SetStateAction, useState } from "react";
import { useAuth } from "../context/auth/AuthContext";
import { QueryClient, UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { AlertArgs } from "../types/alert";

interface HeaderProps {
  navigation: NavigationProp<any>;
  news: News | undefined;
  bookmarksMutation: UseMutationResult<
    AxiosResponse<any, any>,
    unknown,
    string,
    unknown
  >;
  showAlertAndContent: ({ type, message }: AlertArgs) => void;
  queryClient: QueryClient;
  loading: boolean;
  setloading: Dispatch<SetStateAction<boolean>>;
}

export default function VirtualHeader({
  navigation,
  news,
  bookmarksMutation,
  showAlertAndContent,
  queryClient,
  loading,
  setloading,
}: HeaderProps) {
  const { isDarkMode } = useSheet();
  const {
    state: { user },
  } = useAuth();

  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <View className="h-24 w-full border-b border-b-lightText dark:border-b-grayNeutralTheme">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="absolute left-0 top-14 ml-3 bg-lightText dark:bg-shadowWhite rounded-full h-8 w-8 flex-col justify-center items-center"
      >
        <MaterialIcons
          name="keyboard-arrow-left"
          size={24}
          color={COLORS.primaryColorTheme}
        />
      </TouchableOpacity>
      {loading ? (
        <View className="absolute top-14 right-0 mr-3 bg-authDark dark:bg-shadowWhite rounded-full h-7 w-7   flex-col justify-center items-center">
          <ActivityIndicator
            size="small"
            color={isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor}
          />
        </View>
      ) : (
        <TouchableOpacity
          onPress={() =>
            addRemoveBookmark({
              newsId: news?.id || "",
              setIsBookmarked,
              setloading,
              bookmarksMutation,
              showAlertAndContent,
              queryClient,
            })
          }
          className="absolute top-14 right-0 mr-3 bg-lightText dark:bg-shadowWhite rounded-full h-8 w-8  flex-col justify-center items-center"
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
    </View>
  );
}
