import { View, Text } from "react-native";
import { ExpoPushToken } from "expo-notifications";
import { usePushTokenContext } from "../context/push_token/PushTokenContext";
import { useEffect } from "react";

export default function Savetoken({
  token,
}: {
  token: ExpoPushToken | undefined;
}) {
  console.log("Rendering Savetoken Component"); // Add this line
  const { updateExpoPushToken } = usePushTokenContext();

  useEffect(() => {
    if (token) {
      console.log({ token });
      updateExpoPushToken(token);
    }
  }, [token, updateExpoPushToken]);

  return (
    <View>
      <Text>Savetoken Component</Text>
    </View>
  );
}
