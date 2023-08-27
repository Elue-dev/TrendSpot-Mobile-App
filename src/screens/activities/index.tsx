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
import RafikiSVG from "../../assets/rafiki.svg";
import UnionSVG from "../../assets/union.svg";
import { User } from "../../types/auth";

function AuthenticatedActivities({ user }: { user: User }) {
  const navigation = useNavigation<NavigationProp<any>>();
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
      <View className="mx-3 mt-3 mb-12">
        {activities?.length === 0 ? (
          <View className="mt-4">
            <RafikiSVG width={"90%"} height={300} />
            <Text
              style={{ fontFamily: "rubikREG" }}
              className="text-xl text-center pb-4 text-darkNeutral dark:text-lightText"
            >
              All your activities will appear here
            </Text>
          </View>
        ) : (
          <FlatList
            keyExtractor={(activities) => activities.id}
            scrollEnabled={false}
            data={activities}
            renderItem={({ item: activity }) => (
              <View className="bg-white dark:bg-transparent border border-gray-200 dark:border-lightBorder shadow-sm px-2 py-4 mt-1 rounded-lg">
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
        )}
      </View>
    </ScrollView>
  );
}

function UnauthenticatedActivities() {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View className="flex-1 bg-shadowWhite dark:bg-darkNeutral">
      <View className="mx-3 mt-4">
        <UnionSVG width={"90%"} height={300} />
        <Text
          style={{ fontFamily: "rubikREG" }}
          className="text-xl text-center pb-4 text-darkNeutral dark:text-lightText"
        >
          Sign in to see all your activities
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AuthSequence", { state: "Sign In" })
          }
          className="bg-primaryColor dark:bg-primaryColorTheme py-3 rounded-md"
        >
          <Text
            style={{ fontFamily: "rubikSB" }}
            className="text-white font-semibold text-center text-xl"
          >
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Activities() {
  const {
    state: { user },
  } = useAuth();

  if (!user) {
    return <UnauthenticatedActivities />;
  }

  return <AuthenticatedActivities user={user} />;
}
