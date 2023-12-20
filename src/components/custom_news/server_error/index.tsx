import { View, Text } from "react-native";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { httpRequest } from "../../../services";
import { useAuth } from "../../../context/auth/AuthContext";

export default function ServerError({ refetch }: { refetch: () => void }) {
  const {
    state: { user },
    setActiveUser,
  } = useAuth();

  async function retryAndGetNewUserToken() {
    refetch();
    const dbResponse = await httpRequest.get(
      `/users/user-with-token/${user?.id}`
    );
    const modifiedUser = { token: user?.token, ...dbResponse.data.user };
    setActiveUser(modifiedUser);
  }
  return (
    <View
      className="bg-shadowWhite dark:bg-darkNeutral"
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View className="pt-2">
        <Text className="font-bold text-xl text-darkNeutral dark:text-lightText text-center">
          Something Went Wrong ☹️
        </Text>

        <Text className="font-bold text-xl text-authDark dark:text-lightText text-center">
          Your session may have expired. Try to sign in again.
        </Text>

        <TouchableOpacity onPress={retryAndGetNewUserToken}>
          <Text className="text-primaryColor dark:text-primaryColorTheme text-xl text-center">
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
