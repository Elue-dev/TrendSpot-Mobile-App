import { TouchableOpacity, View } from "react-native";
import { COLORS } from "../common/colors";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";

interface HeaderProps {
  navigation: NavigationProp<any>;
}

export default function VirtualHeader({ navigation }: HeaderProps) {
  return (
    <View className="h-24 w-full border-b border-b-lightText dark:border-b-grayNeutralTheme">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="absolute left-0 top-14 ml-3 bg-gray-200 rounded-full h-7 w-7 flex-col justify-center items-center"
      >
        <MaterialIcons
          name="keyboard-arrow-left"
          size={24}
          color={COLORS.primaryColorTheme}
        />
      </TouchableOpacity>
      <TouchableOpacity className="absolute top-14 right-0 mr-3 bg-gray-200 rounded-full h-7 w-7 flex-col justify-center items-center">
        <MaterialCommunityIcons
          name="bookmark-outline"
          size={20}
          color={COLORS.primaryColorTheme}
        />
      </TouchableOpacity>
    </View>
  );
}
