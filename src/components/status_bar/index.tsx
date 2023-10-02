import { StatusBar } from "expo-status-bar";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { usePushTokenContext } from "../../context/push_token/PushTokenContext";
import { useEffect } from "react";
import { ExpoPushToken } from "expo-notifications";
import { httpRequest } from "../../services";
import { useAuth } from "../../context/auth/AuthContext";

export default function CustomStatusBar({
  token,
}: {
  token: ExpoPushToken | undefined;
}) {
  const { isDarkMode } = useSheet();
  const { updateExpoPushToken } = usePushTokenContext();
  const {
    state: { user },
  } = useAuth();
  const authHeaders = {
    headers: { authorization: `Bearer ${user?.token}` },
  };

  async function updateUserPushToken(token: ExpoPushToken | undefined) {
    try {
      await httpRequest.put(
        `/users/${user?.id}`,
        {
          pushToken: token,
        },
        authHeaders
      );
    } catch (error: any) {
      console.log(error);
    }
  }

  useEffect(() => {
    updateExpoPushToken(token);
    updateUserPushToken(token);
  }, [user]);

  return <StatusBar style={isDarkMode ? "light" : "dark"} />;
}
