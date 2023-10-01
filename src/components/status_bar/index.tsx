import { StatusBar } from "expo-status-bar";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { usePushTokenContext } from "../../context/push_token/PushTokenContext";
import { useEffect } from "react";
import { ExpoPushToken } from "expo-notifications";

export default function CustomStatusBar({
  token,
}: {
  token: ExpoPushToken | undefined;
}) {
  const { isDarkMode } = useSheet();
  const { updateExpoPushToken } = usePushTokenContext();

  useEffect(() => {
    updateExpoPushToken(token);
  }, []);

  return <StatusBar style={isDarkMode ? "light" : "dark"} />;
}
