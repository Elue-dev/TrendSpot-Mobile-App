import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { useLayoutEffect, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/auth/AuthContext";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { Platform } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { COLORS } from "../../common/colors";
import { httpRequest } from "../../services";
import { Notifications as NotificationsI } from "../../types/activities";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../components/loader";
import ServerError from "../../components/custom_news/server_error";
import { formatTimeAgo } from "../../helpers";
import RafikiSVG from "../../assets/rafiki.svg";
import UnionSVG from "../../assets/union.svg";
import { User } from "../../types/auth";
import { useAlert } from "../../context/alert/AlertContext";
import { useModal } from "../../context/modal/ModalCotext";
import { RefreshControl } from "react-native-gesture-handler";

function AuthenticatedNotifications({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [allLoading, setAllLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<any>>();
  const { isDarkMode } = useSheet();
  const authHeaders = {
    headers: { authorization: `Bearer ${user?.token}` },
  };
  const { showAlertAndContent } = useAlert();
  const { showModalAndContent } = useModal();
  const queryClient = useQueryClient();

  function handleRefresh() {
    setRefresh(true);
    queryClient.invalidateQueries(["notifications"]);

    setTimeout(() => setRefresh(false), 3000);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{ fontFamily: "rubikSB" }}
          className="text-primaryColorSec dark:text-gray300 font-semibold text-[18px] -ml-4"
        >
          Notifications
        </Text>
      ),

      headerLeft: () =>
        Platform.OS === "ios" ? (
          <TouchableOpacity
            onPress={() => navigation.navigate("TabStack", { route: "Home" })}
          >
            <Ionicons
              name="arrow-back-circle"
              size={29}
              color={COLORS.gray200}
            />
          </TouchableOpacity>
        ) : null,
    });
  }, [isDarkMode]);

  const queryFn = async function (): Promise<NotificationsI[]> {
    return httpRequest
      .get(`/notifications?userId=${user?.id}`, authHeaders)
      .then((res) => {
        return res.data.notifications;
      });
  };

  const {
    data: notifications,
    isLoading,
    error,
    refetch,
  } = useQuery<NotificationsI[]>(["notifications"], queryFn, {
    staleTime: 60000,
    refetchOnWindowFocus: true,
    onError(error) {
      console.log(error);
    },
  });

  if (isLoading) return <Loader />;
  if (error) return <ServerError refetch={refetch} />;

  const unReadNotifications = notifications?.filter(
    (notif) => notif.isRead === false
  );

  console.log({ unReadNotifications: unReadNotifications?.length });

  async function markNotificationAsRead(notifId: string | null, type: string) {
    console.log({ type });

    try {
      type === "all" ? setAllLoading(true) : setLoading(true);
      const dbResponse = await httpRequest.patch(
        `/notifications/mark-as-read/${notifId}?type=${type}`,
        "",
        authHeaders
      );
      if (dbResponse) {
        type === "all" ? setAllLoading(false) : setLoading(false);
        showAlertAndContent({
          type: "success",
          message: dbResponse.data.message,
        });
        queryClient.invalidateQueries(["notifications"]);
        refetch();
      }
    } catch (error: any) {
      type === "all" ? setAllLoading(false) : setLoading(false);
      showAlertAndContent({
        type: "error",
        message:
          error.response.data.message ||
          "Something went wrong. Please try again.",
      });
    }
  }

  async function handleDeleteNotification(notifId: string) {
    showModalAndContent({
      title: "Delete Notification",
      message: "Are you sure you want to delete this notification?",
      actionBtnText: "YES, DELETE",
      action: "DeleteNotif",
      param: notifId,
    });
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-shadowWhite dark:bg-darkNeutral"
    >
      <RefreshControl
        refreshing={refresh}
        onRefresh={handleRefresh}
        progressBackgroundColor={
          isDarkMode ? COLORS.primaryColor : COLORS.primaryColorTheme
        }
        tintColor={isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor}
      />
      <View className="mx-2 mt-3 mb-12">
        {notifications?.length === 0 ? (
          <View className="mt-4">
            <RafikiSVG width={"90%"} height={300} />
            <Text
              style={{ fontFamily: "rubikREG" }}
              className="text-xl text-center pb-4 text-darkNeutral dark:text-lightText"
            >
              All your notifications will appear here
            </Text>
          </View>
        ) : (
          <View>
            {unReadNotifications!.length > 1 ? (
              <TouchableOpacity
                onPress={
                  allLoading
                    ? () => {}
                    : () => markNotificationAsRead(null, "all")
                }
                className="flex-row items-center justify-end gap-1 mb-2"
              >
                <FontAwesome5
                  name="check-double"
                  size={15}
                  color={COLORS.primaryColorTheme}
                />
                <Text className="text-primaryColorTheme text-base font-bold">
                  {allLoading ? "..." : "Mark All As Read"}
                </Text>
              </TouchableOpacity>
            ) : null}

            <FlatList
              keyExtractor={(notifications) => notifications.id}
              scrollEnabled={false}
              data={notifications}
              renderItem={({ item: notification }) => (
                <View
                  className={` border border-gray-200 dark:border-lightBorder shadow-sm px-2 py-4 mt-1 rounded-lg ${
                    !notification.isRead && isDarkMode
                      ? "bg-darkCard"
                      : !notification.isRead && !isDarkMode
                      ? "bg-zinc-100"
                      : "bg-white dark:bg-darkNeutral"
                  }`}
                >
                  <View className="flex-row items-center mb-2">
                    <Text
                      style={{ fontFamily: "rubikREG" }}
                      className="text-darkNeutral dark:text-lightText text-[16px] leading-6"
                    >
                      {notification.description}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center gap-1">
                        <MaterialIcons
                          name="date-range"
                          size={20}
                          color={COLORS.primaryColorTheme}
                        />
                        <Text
                          style={{ fontFamily: "rubikL" }}
                          className="text-darkNeutral dark:text-lightText ml-[6px] text-[15px]"
                        >
                          {formatTimeAgo(notification.notificationDate)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row items-end justify-end gap-2 pt-2">
                    {!notification.isRead && (
                      <TouchableOpacity
                        onPress={
                          loading
                            ? () => {}
                            : () =>
                                markNotificationAsRead(
                                  notification.id,
                                  "specific"
                                )
                        }
                      >
                        <Text className="text-primaryColorTheme underline">
                          {loading ? "..." : "Mark as Read"}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {notification.category === "news" && (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("CustomNewsDetails", {
                            newsId: notification.news?.id,
                            slug: notification.news?.slug,
                          })
                        }
                      >
                        <Text
                          style={{ fontFamily: "rubikREG" }}
                          className="text-primaryColorTheme underline"
                        >
                          See News
                        </Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={() => handleDeleteNotification(notification.id)}
                    >
                      <Text
                        style={{ fontFamily: "rubikREG" }}
                        className="text-primaryColorTheme underline"
                      >
                        Delete
                      </Text>
                      {/* <AntDesign
                        name="delete"
                        size={17}
                        color={COLORS.primaryColorTheme}
                      /> */}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function UnauthenticatedNotifications() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { setPreviousRoute } = useAuth();

  return (
    <View className="flex-1 bg-shadowWhite dark:bg-darkNeutral">
      <View className="mx-3 mt-4">
        <UnionSVG width={"90%"} height={300} />
        <Text
          style={{ fontFamily: "rubikREG" }}
          className="text-xl text-center pb-4 text-darkNeutral dark:text-lightText"
        >
          Sign in to see all your notifications
        </Text>
        <TouchableOpacity
          onPress={() => {
            setPreviousRoute("Notifications");
            navigation.navigate("AuthSequence", { state: "Sign In" });
          }}
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

export default function Notifications() {
  const {
    state: { user },
  } = useAuth();

  if (!user) {
    return <UnauthenticatedNotifications />;
  }

  return <AuthenticatedNotifications user={user} />;
}
