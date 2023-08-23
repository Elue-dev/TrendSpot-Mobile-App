import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { useLayoutEffect } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/auth/AuthContext";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { Platform } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../common/colors";
import { httpRequest } from "../../services";
import { Activity } from "../../types/activities";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/loader";
import ServerError from "../../components/custom_news/server_error";
import { formatTimeAgo } from "../../helpers";

export default function Activities() {
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
          Your Activities
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

  const queryFn = async function (): Promise<Activity[]> {
    return httpRequest
      .get(`/activities?userId=${user?.id}`, authHeaders)
      .then((res) => {
        return res.data.activities;
      });
  };

  const {
    data: activities,
    isLoading,
    error,
    refetch,
  } = useQuery<Activity[]>(["activities"], queryFn, {
    staleTime: 60000,
    refetchOnWindowFocus: true,
    onError(error) {
      console.log(error);
    },
  });

  if (isLoading) return <Loader />;
  if (error) return <ServerError refetch={refetch} />;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-shadowWhite dark:bg-darkNeutral"
    >
      <View className="mx-3 mt-3">
        <FlatList
          keyExtractor={(activities) => activities.id}
          scrollEnabled={false}
          data={activities}
          renderItem={({ item: activity }) => (
            <View className="bg-shadowWhite dark:bg-transparent border border-gray-200 dark:border-lightBorder shadow-sm px-2 py-3 mt-2 rounded-lg">
              <View className="flex-row items-center mb-2">
                <MaterialIcons
                  name="workspaces-outline"
                  size={20}
                  color={COLORS.primaryColorTheme}
                />
                <Text
                  style={{ fontFamily: "rubikREG" }}
                  className="text-darkNeutral dark:text-lightText text-[16px]"
                >
                  You {activity.description}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <MaterialIcons
                    name="date-range"
                    size={20}
                    color={COLORS.primaryColorTheme}
                  />
                  <Text
                    style={{ fontFamily: "rubikL" }}
                    className="text-darkNeutral dark:text-lightText ml-[6px] text-[15px]"
                  >
                    {formatTimeAgo(activity.activityDate)}
                  </Text>
                </View>

                {activity.category === "news" && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("CustomNewsDetails", {
                        news: activity.news,
                      })
                    }
                  >
                    <Text
                      style={{ fontFamily: "rubikREG" }}
                      className="text-primaryColorTheme"
                    >
                      See News
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}
