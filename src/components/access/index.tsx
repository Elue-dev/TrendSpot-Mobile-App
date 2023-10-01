import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function AccessPrompt({
  authenticateUser,
}: {
  authenticateUser: () => void;
}) {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <MaterialIcons name="app-blocking" size={150} color="black" />
      <Text
        className="text-xl my-4 px-3 text-center"
        style={{ fontFamily: "rubikMD" }}
      >
        Access Denied. You must authenticate with your device to continue to
        TrendSpot
      </Text>
      <TouchableOpacity
        onPress={authenticateUser}
        className="bg-primaryColor dark:bg-primaryColorTheme py-3 px-3 rounded-md"
      >
        <Text className="text-white font-semibold text-[18px]">
          Authenticate To Continue
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
