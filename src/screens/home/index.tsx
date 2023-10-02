import { useState } from "react";
import { View, SafeAreaView, ScrollView } from "react-native";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { COLORS } from "../../common/colors";
import Header from "../../components/header";
import ExternalNews from "../../components/exteral_news";
import CustomNews from "../../components/custom_news";
import { RefreshControl } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";
import { httpRequest } from "../../services";
import { useAuth } from "../../context/auth/AuthContext";

export default function HomeScreen() {
  const [refresh, setRefresh] = useState(false);
  const { isDarkMode } = useSheet();
  const queryClient = useQueryClient();
  const {
    state: { user },
    setActiveUser,
  } = useAuth();

  console.log({ user });

  async function getUserData() {
    const dbResponse = await httpRequest.get(`/users/${user?.id}`);
    const modifiedUser = { token: user?.token, ...dbResponse.data.user };
    setActiveUser(modifiedUser);
  }

  function handleRefresh() {
    setRefresh(true);
    queryClient.invalidateQueries(["customNews"]);
    queryClient.invalidateQueries(["externalNews"]);
    queryClient.invalidateQueries(["userNews"]);
    queryClient.invalidateQueries(["bookmarks"]);
    queryClient.invalidateQueries(["activities"]);
    queryClient.invalidateQueries(["userLikes"]);
    getUserData();

    setTimeout(() => setRefresh(false), 3000);
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f7f7f7] dark:bg-darkNeutral">
      <View className="h-4" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={handleRefresh}
            progressBackgroundColor={
              isDarkMode ? COLORS.primaryColor : COLORS.primaryColorTheme
            }
            tintColor={
              isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor
            }
          />
        }
      >
        <Header />
        <ExternalNews />
        <CustomNews />
      </ScrollView>
    </SafeAreaView>
  );
}
