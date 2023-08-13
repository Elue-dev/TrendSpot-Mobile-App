import { View, Text } from "react-native";
import { TouchableOpacity } from "@gorhom/bottom-sheet";

export default function ServerError({ refetch }: { refetch: () => void }) {
  return (
    <View
      className="bg-white dark:bg-darkNeutral"
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="font-bold text-xl text-darkNeutral dark:text-lightText">
        SOMETHING WENT WRONG ☹️
      </Text>

      <TouchableOpacity onPress={refetch}>
        <Text className="text-primaryColor dark:text-primaryColorTheme text-xl">
          Retry
        </Text>
      </TouchableOpacity>
    </View>
  );
}
